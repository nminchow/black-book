import captureWebsite from "capture-website";
import { dbWrapper } from './database';
import fetch, { FormData } from "node-fetch";

const bucketName = 'helltides';

const createBucket = async (db: NonNullable<dbWrapper>) => {
  const { error } = await db
    .storage
    .createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png']
    });
  if (error) {
    throw 'error creating storage bucket';
  }
};

const createBucketIfNeeded = async (db: NonNullable<dbWrapper>) => {
  const { data, error } = await db.storage.listBuckets();
  if (error) {
    throw 'error looking up storage bucket';
  }
  if(!data?.some(({ name }) => name === bucketName)) {
    await createBucket(db);
  };
};


const scanAndUploadImage = async (db: NonNullable<dbWrapper>) => {
  const bucketPromise = createBucketIfNeeded(db);
  const imagePromise = captureWebsite.buffer('https://helltides.com/', {
    element: '#map',
    removeElements: ['.inline-flex', '.leaflet-top'],
    launchOptions: {
      args: [
        '--no-sandbox'
      ]
    }
  });

  const [,image] = await Promise.all([bucketPromise, imagePromise]);
  const { data, error: upsertError } = await db
    .storage
    .from(bucketName)
    .upload(`helltide-${new Date().getTime()}.png`, image, {
      upsert: true,
      contentType: 'image/png'
    });

  if (upsertError) {
    console.log(upsertError);
    throw 'error upserting image';
  };

  const { data: { publicUrl } } = db
    .storage
    .from(bucketName)
    .getPublicUrl(data.path)
    // note - if running locally or supabase project is upgraded, the following
    // can be used for image compression:
    // .getPublicUrl(data.path, { transform: { width: 400 }  })

  if (process.env.NGROK_URL) {
    const url = new URL(publicUrl);
    const ngrokUrl = new URL(process.env.NGROK_URL);
    url.protocol = ngrokUrl.protocol;
    url.hostname = ngrokUrl.hostname;
    url.port = ngrokUrl.port;
    const newUrl =  url.href;
    console.log(`overrideing url with ${newUrl}`);
    return newUrl;
  }

  console.log(publicUrl);
  return publicUrl;
};

type CloudflareResponse = {
  result: {
    variants: [string]
  },
  success: boolean,
  errors: [string],
  messages: [string],
};

export const createImage = async (db: NonNullable<dbWrapper>) => {
  const imageUrl = await scanAndUploadImage(db);
  if (!process.env.CLOUDFLARE_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) return imageUrl;
  const body = new FormData()
  body.append('url', imageUrl);
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
      body,
    },
  );
  const images = await response.json() as CloudflareResponse;
  if (!images.success) {
    console.error(JSON.stringify(images.errors));
    throw 'error sending to cloudflare';
  }
  return images.result.variants[0];
};

export const createImageMetadata = async (db: NonNullable<dbWrapper>, isUpdated: boolean) => {
  try {
    return { imagePath: await createImage(db), isUpdated };
  } catch (error) {
    console.error('error creating image');
    console.error(error);
    return { imagePath: null, isUpdated };
  }
}
