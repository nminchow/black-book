import { Octokit } from "@octokit/rest"
import * as fs from 'fs';

console.log('pulling data')

const files = ['barbarian', 'codex-of-power', 'druid', 'necromancer', 'paragon', 'rogue', 'sorcerer', 'paragon'];

const owner = 'Lothrik';
const repo = 'diablo4-build-calc';

const auth = process.env.GITHUB_TOKEN;

if (!auth) {
  throw 'github token not found';
}

const octokit = new Octokit({ auth });

const paths = [ ...files.map(x => ({ path: `data/${x}.js`, name: x })), {path: 'parser/codex-values.js', name: 'codex-values'}, {path: 'database', name: 'database'}];

const dir = './src/data/raw';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

type Entry = {
  name: string,
}

const compareEntries = (a: Entry, b: Entry) => {
  return a.name.split('-')?.[1] > b.name.split('-')?.[1] ? -1 : 1;
};

paths.map(async ({ path, name }) => {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });
  if (Array.isArray(data)) {
    data.sort(compareEntries);
    return { sha: data[0]['sha'], name, type: 'json' };
  }
  return { sha: data['sha'], name, type: 'js' };
}).map( async (result) => {
  const { sha, name, type } = await result;
  const file_sha = sha;
  const blob = await octokit.rest.git.getBlob({
    owner,
    repo,
    file_sha,
  });
  const content = Buffer.from(blob.data.content, 'base64').toString()
  fs.writeFileSync(`${dir}/${name}.${type}`, content);
});
