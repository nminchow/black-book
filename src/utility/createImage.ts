import captureWebsite from "capture-website";
import { dbWrapper } from "../bot";

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


export const createImage = async (db: NonNullable<dbWrapper>) => {
  const bucketPromise = createBucketIfNeeded(db);
  const imagePromise = captureWebsite.buffer('https://d4armory.io/events/', {
    element: '#helltideMap',
    removeElements: ['.leaflet-control-layers-toggle'],
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

  if (process.env.NGROK_URL) {
    const url = new URL(publicUrl);
    const newUrl = `${process.env.NGROK_URL}${url.pathname}`;
    console.log(`overrideing url with ${newUrl}`);
    return newUrl;
  }

  console.log(publicUrl);
  return publicUrl;
};