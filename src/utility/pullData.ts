import { Octokit } from "@octokit/rest"
import * as fs from 'fs';

const files = ['barbarian', 'codex-of-power', 'druid', 'necromancer', 'paragon', 'rogue', 'sorcerer'];

const owner = 'Lothrik';
const repo = 'diablo4-build-calc';

const auth = process.env.GITHUB_TOKEN;

if (!auth) {
  throw 'github token not found';
}

const octokit = new Octokit({ auth });

files.map(async (file) => {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: `data/${file}.js`,
  });
  if (Array.isArray(data)) {
    throw 'unexpected resopnse type';
  }
  return { sha: data['sha'], file };
}).map( async (result) => {
  const { sha, file } = await result;
  const file_sha = sha;
  const blob = await octokit.rest.git.getBlob({
    owner,
    repo,
    file_sha,
  });
  const content = Buffer.from(blob.data.content, 'base64').toString()
  fs.writeFileSync(`./src/data/raw/${file}.js`, content);
});
