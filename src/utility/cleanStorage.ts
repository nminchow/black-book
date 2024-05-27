import inquirer from 'inquirer';
import { dbClient } from './database';

const db = dbClient();

if (!db) {
  throw 'db not configured'
}

const ensureClean = {
  type: 'list',
  name: 'confirm',
  message: 'Warning!!\nThis method uses an offset and only leaves the 20 most recent images in place!\nProceed? ',
  choices: ['No', 'Yes'],
};

const bucketName = {
  type: 'input',
  name: 'name',
  message: 'Bucket name?'
}

const prompts = [ensureClean, bucketName]

inquirer.prompt(prompts).then(async answers => {
  if (answers?.confirm === 'No') return;
  console.log('Deleting...');
  try {
    if (!answers?.name) {
      console.log('no bucket name found');
      return;
    }
    console.log(
      `Cleaning up bucket: ${answers.name}.`
    );

    await deleteImages(answers.name);

  } catch (error) {
    console.error(error);
  }
});


const deleteImages = async (name: string) => {
  const { data, error: fetchError } = await db.storage.from(name).list(undefined, {
    sortBy: {
      column: 'created_at',
      order: 'desc'
    },
    limit: 10000,
    offset: 20,
  });

  if (fetchError) {
    console.log(fetchError);
    return;
  }

  const names = data?.map(x => x.name) || [];
  console.log(`Deleting ${names.length} images.`);
  const { error } = await db.storage.from(name).remove(names);
  if (error) {
    console.log(error);
  } else {
    console.log('done.')
  }
}
