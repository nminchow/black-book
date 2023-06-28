import type { BaseTranslation } from '../i18n-types'

const en = {
	commands: {
		about: {
			name: 'about',
			description: 'get general info about the bot',
			options: {}
		},
		codex: {
			name: 'codex',
			description: 'find a codex entry by name',
			options: {
				codexEntryNameOption: {
					name: 'name',
					description: 'codex entry name',
				}
			},
			errors: {
				notFound: 'codex entry not found',
			}
		}
	}
} satisfies BaseTranslation

export default en
