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
					name: '地獄浪潮多人通知',
					description: '設定特定用戶接受即將來臨既地獄浪潮通知',
				},
				worldBossRole: {
					name: '世界王多人通知',
					description: '設定特定用戶接受即將來臨既世界王通知',
				},
				zoneEventRole: {
					name: '區域事件多人通知',
					description: '設定特定用戶接受即將來臨既區域事件通知',
				},
				allEventRole: {
					name: '全部事件多人通知',
					description: '設定特定用戶接受即將來臨既全部事件通知',
				},
				images: {
					name: '顯示圖片',
					description: '係通知會出圖片',
				},
				deleteMessages: {
					name: '刪除過期訊息',
					description: '當事件完結會自動刪除過期既訊息',
				},
			},
			errors: {
				permissions: `個 Bot 冇權限呀!開番權限再重新試過!`,
			},
			messages: {
				success: '事件會成功係呢個 Channel 出，打 `/{unsub}` 可以停止係呢個 Channel 出，打 `/{events}` 就可以出番',
			}
		},
		helltide: {
			name: 'hell-tide',
			description: '顯示地獄浪潮地圖',
			options: {}
		},
		help: {
			name: 'help',
			description: '唔記得指令碼專用',
			options: {}
		},
		invite: {
			name: 'invite',
			description: `可以邀請 Bot 到其他 Server`,
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
