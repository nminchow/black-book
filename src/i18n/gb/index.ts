import type { Translation } from '../i18n-types'
import en from '../en';

let gb: Translation = {
	...en as Translation,
	nativeName: 'English, UK'
}

if (process.env.USE_GB_AS_LANGUAGE_TEST) {
	const overrides = JSON.parse(JSON.stringify(gb));
	overrides.views.events.hellide.chestsRespawnLabel = 'cheztz rezpawn:'
	overrides.views.events.hellide.title = '{location} is where {name} is'
	overrides.views.events.zoneEvent.title = '{location} is where {name} is'
	overrides.views.events.worldBoss.title = '{location} is where {name} is'
	overrides.views.events.hellide.startLabel = 'Ztart:'
	overrides.commands.codex.name = 'codez';
	overrides.commands.codex.description = 'Geferian æn codex ingang be naman';
	overrides.commands.codex.options.codexEntryNameOption.name = 'nama';
	overrides.commands.codex.options.codexEntryNameOption.description = 'ye ol description';
	overrides.commands.unsub.name = 'unzub';
	overrides.commands.events.name = 'eventz';
	overrides.commands.events.messages.success = 'eventz will be posted in this channel! Use `/{unsub}` to stop event posts here. Use the `/{events}` command again to change your configuration.';
	gb = overrides;
}

export default gb
