import en from '../en';

const enGB = JSON.parse(JSON.stringify(en));

if (process.env.USE_GB_AS_LANGUAGE_TEST) {
	enGB.commands.codex.name = 'codez';
	enGB.commands.codex.description = 'Geferian æn codex ingang be naman';
	enGB.commands.codex.options.codexEntryNameOption.name = 'nama';
	enGB.commands.codex.options.codexEntryNameOption.description = 'ye ol description';
}

export default enGB
