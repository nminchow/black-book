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
		},
		config: {
			name: 'config',
			description: 'view your current configuration',
			options: {},
		},
		events: {
			name: 'events',
			description: 'get updates on helltides and world bosses',
			options: {
				helltide: {
					name: 'helltide',
					description: `receive alerts on upcoming helltides (defaults to 'true')`,
				},
				worldBoss: {
					name: 'world-boss',
					description: `receive alerts on upcoming world bosses (defaults to 'true')`,
				},
				zoneEvent: {
					name: 'zone-event',
					description: `receive alerts on upcoming zone events (defaults to 'false')`,
				},
				helltideRole: {
					name: 'helltide-role',
					description: 'set user or role to be alerted on upcoming helltides',
				},
				worldBossRole: {
					name: 'world-boss-role',
					description: 'set user or role to be alerted on upcoming world bosses',
				},
				zoneEventRole: {
					name: 'zone-event-role',
					description: 'set user or role to be alerted on upcoming zone events',
				},
				allEventRole: {
					name: 'all-event-role',
					description: 'set user or role to be alerted on all events',
				},
				images: {
					name: 'show-images',
					description: 'show images in alerts',
				},
				deleteMessages: {
					name: 'delete-expired-events',
					description: 'delete event notifications from the channel after the event has ended',
				},
			},
			errors: {
				permissions: `The bot doesn't currently have the "Send Messages" and "View Messages" permission for this channel, so alerts can't be sent. Once permissions are enabled, rerun this command!`,
			},
			messages: {
				success: 'events will be posted in this channel! Use `/{unsub}` to stop event posts here. Use the `/{events}` command again to change your configuration.',
			}
		},
		helltide: {
			name: 'hell-tide',
			description: 'display map and info about hell tides',
			options: {}
		},
		help: {
			name: 'help',
			description: 'show a list of availble commands',
			options: {}
		},
		invite: {
			name: 'invite',
			description: `get the bot's invite link and add it to other servers`,
			options: {}
		},
		nightmareLevel: {
			name: 'nightmare-level',
			description: 'calculate the optimal nightmare dungeon level for your character',
			options: {
				level: {
					name: 'level',
					description: 'your character level'
				},
				worldTier: {
					name: 'world-tier',
					description: `your world tier (defaults to 4)`
				},
			}
		},
		nightmareTier: {
			name: 'nightmare-tiers',
			description: 'display an efficiency tierlist of nightmare dungeons',
			options: {}
		},
		paragon: {
			name: 'paragon',
			description: 'find a paragon entry by name',
			options: {
				entryName: {
					name: 'name',
					description: 'paragon entry name',
				}
			},
			errors: {
				notFound: 'codex entry not found!',
			},
		},
		skill: {
			name: 'skill',
			description: 'find a skill by name',
			options: {
				skillName: {
					name: 'name',
					description: 'skill name'
				}
			},
			errors: {
				notFound: 'skill not found!',
			},
		},
		unsub: {
			name: 'unsub',
			description: 'unsubscribe from helltide and world boss updates',
			options: {}
		},
		xpCurve: {
			name: 'xp-curve',
			description: 'show info about xp and the leveling curve',
			options: {}
		}
	}
} satisfies BaseTranslation

export default en
