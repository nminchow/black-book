import type { BaseTranslation } from '../i18n-types'

const hk = {
	nativeName: 'Chinese, HK',
	commands: {
		about: {
			name: '關於',
			description: 'Bot 系統',
			options: {}
		},
		codex: {
			name: '資料庫',
			description: '搜尋',
			options: {
				codexEntryNameOption: {
					name: '名稱',
					description: '物品或技能名稱',
				}
			},
			errors: {
				notFound: '搵唔到呀...',
			}
		},
		config: {
			name: '設定',
			description: '查看或更改 Bot 資料',
			options: {
				locale: {
					name: '語言',
					description: '轉變語言',
				}
			},
		},
		events: {
			name: '事件',
			description: '可以接受 地獄浪潮 世界王 通知',
			options: {
				helltide: {
					name: '地獄浪潮',
					description: `地獄浪潮通知 ( 預設 : 開)`,
				},
				worldBoss: {
					name: '世界王',
					description: `世界王通知 ( 預設 : 開)`,
				},
				zoneEvent: {
					name: '區域事件',
					description: `區域事件通知 ( 預設 : 關)`,
				},
				helltideRole: {
					name: '地獄浪潮 個別通知',
					description: '設定特定用戶接受即將來臨既地獄浪潮',
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
				permissions: `The bot doesn't currently have the "Send Messages", "View Messages", and "Embed Links" permissions for this channel, so alerts can't be sent. Once permissions are enabled, rerun this command!`,
			},
			messages: {
				success: 'events will be posted in this channel! Use `/{unsub}` to stop event posts here. Use the `/{events}` command again to change your configuration.',
			}
		},
		helltide: {
			name: 'hell-tide',
			description: 'display map and info about helltides',
			options: {}
		},
		help: {
			name: 'help',
			description: 'show a list of available commands',
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
		panel:{
			name: 'panel',
			description: 'create a panel which shows world event times',
			options: {},
		},
		season: {
			name: 'season',
			description: 'get information about the upcoming or current season',
			options: {},
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
			options: {
				channelId: {
					name: 'channel',
					description: 'channel ID'
				}
			}
		},
		xpCurve: {
			name: 'xp-curve',
			description: 'show info about xp and the leveling curve',
			options: {}
		}
	},
	views: {
		events: {
			hellide: {
				title: 'The Helltide Rises in {location}!',
				updatePending: ' (image will update)',
				updateDone: ' (image updated)',
				noImage: ' (image unavailable - this is likely due to a service outage and should resolve shortly)',
				chestsRespawnLabel: 'Chests respawn:',
				startLabel: 'Start:',
				endLabel: 'End:',
				locationUrl: '{location} chest locations'
			},
			worldBoss: {
				title: '{name} is stirring in {location}!',
				spawnLabel: 'Spawns:'
			},
			zoneEvent: {
				title: 'The Gathering Legions assemble in {location}!',
				startLabel: 'Starts:'
			},
			utility: {
				zoneAndTerritory: '{territory}, {zone}'
			}
		}
	},
	gameData: {
		worldBosses: {
			avarice: '咒金者貪婪獸',
			theWanderingDeath: '漫遊死亡行者',
			ashava: '疫病者艾薩瓦',
		},
		map: {
			sanctuary: 'Sanctuary',
			territories: {
				dilapidatedAqueducts: '破敗渠道',
				hauntedWreckage: '鬧鬼殘駭',
				templeOfRot: '腐爛神殿',
				norgoiVigil: '諾戈守夜地',
				korDragan: '科卓岡',
				saraanCaldera: '薩蘭火山口',
				crusadersMonument: `聖教軍紀念碑`,
				caenAdar: '卡恩艾達',
				fieldsOfDesecration: '褻瀆之境',
				searedBasin: '焦烙盆地',
				theCrucible: '試煉之地',
				carrowcrestRuins: '卡羅奎斯廢墟',
				alcarnus: '奧卡納斯',
			},
			zones: {
				kehjistan: '卡基斯坦',
				hawezar: '哈維薩',
				scosglen: '斯科斯格倫',
				fracturedPeaks: '碎峰嶺',
				drySteppes: '大乾原',
			}
		}
	}
} satisfies BaseTranslation

export default hk
