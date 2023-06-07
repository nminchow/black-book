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

const paths = [ ...files.map(x => ({ path: `data/${x}.js`, name: x })), {path: 'parser/codex-values.js', name: 'codex-values'}];

const dir = './src/data/raw';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

paths.map(async ({ path, name }) => {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });
  if (Array.isArray(data)) {
    throw 'unexpected resopnse type';
  }
  return { sha: data['sha'], name };
}).map( async (result) => {
  const { sha, name } = await result;
  const file_sha = sha;
  const blob = await octokit.rest.git.getBlob({
    owner,
    repo,
    file_sha,
  });
  const content = Buffer.from(blob.data.content, 'base64').toString()
  fs.writeFileSync(`${dir}/${name}.js`, content);
});
