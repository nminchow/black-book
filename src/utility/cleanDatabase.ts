import inquirer from 'inquirer';
import { dbClient } from './database';

const db = dbClient();

if (!db) {
  throw 'db not configured'
}


const tableName = {
  type: 'input',
  name: 'name',
  message: 'Table name?'
}

const prompts = [tableName]

inquirer.prompt(prompts).then(async answers => {
  try {
    if (!answers?.name) {
      console.log('no table name found');
      return;
    }

    proceed(answers.name);

  } catch (error) {
    console.error(error);
  }
});

const proceedPrompt = [{
  type: 'list',
  name: 'confirm',
  message: 'Proceed with deletion?',
  choices: ['No', 'Yes'],
}];

const proceed = async (name: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count, error: fetchError } = await db.from(name).select('*', { count: 'exact', head: true }).filter('time', 'lte', sevenDaysAgo.toISOString());

  if (fetchError) {
    console.log('error');
    console.log(fetchError);
    return;
  }

  console.log(`${count} records older than 1 week.`);

  inquirer.prompt(proceedPrompt).then(async (answers) => {
    if (answers?.confirm !== 'Yes') return;

    console.log('Deleting...');

    let total = 0;

    while (true) {
      const { count, error } = await db.from(name).delete({ count: 'exact' }).filter('time', 'lte', sevenDaysAgo.toISOString()).order('id', { ascending: true }).limit(10000);
      if (error) console.log(error);
      if (!count || error) {
        console.log(`Deleted ${total} records from table: ${name}`);
        return;
      }
      total += count || 0;
      console.log(total);
    }

  })
}
