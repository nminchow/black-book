import type { BaseTranslation } from '../i18n-types'

const ru = {
  nativeName: 'Русский',
  commands: {
    about: {
      name: 'about',
      description: 'получить общую информацию о боте',
      options: {}
    },
    codex: {
      name: 'codex',
      description: 'найти запись из "Кодекса силы" по названию аспекта',
      options: {
        codexEntryNameOption: {
          name: 'name',
          description: 'название аспекта',
        }
      },
      errors: {
        notFound: 'данный аспект не найден в "Кодексе силы"',
      }
    },
    config: {
      name: 'config',
      description: 'редактирование и просмотр текущих настроек',
      options: {
        locale: {
          name: 'locale',
          description: 'изменить язык бота'
        }
      },
    },
    events: {
      name: 'events',
      description: 'настройка уведомлений об Адских натисках, Мировых боссах и Событиях легиона',
      options: {
        helltide: {
          name: 'helltide',
          description: `получать уведомления о предстоящем Адском натиске (по умолчанию "Вкл")`,
        },
        worldBoss: {
          name: 'world-boss',
          description: `получать уведомления о предстоящем Мировом боссе (по умолчанию «Вкл»)`,
        },
        zoneEvent: {
          name: 'zone-event',
          description: `получать уведомления о предстоящем Событии легиона (по умолчанию «Откл»)`,
        },
        helltideRole: {
          name: 'helltide-role',
          description: 'установить пользователя или роль для получения уведомлений о предстоящем Адском натиске',
        },
        worldBossRole: {
          name: 'world-boss-role',
          description: 'установить пользователя или роль для получения уведомлений о предстоящем Мировом боссе',
        },
        zoneEventRole: {
          name: 'zone-event-role',
          description: 'установить пользователя или роль для получения уведомлений о предстоящем Событии легиона',
        },
        allEventRole: {
          name: 'all-event-role',
          description: 'установить пользователя или роль для получения уведомлений обо всех событиях',
        },
        images: {
          name: 'show-images',
          description: 'показывать изображения в уведомлениях',
        },
        deleteMessages: {
          name: 'delete-expired-events',
          description: 'удалять уведомления о событиях после окончания события',
        },
      },
      errors: {
        permissions: `В настоящее время у бота нет разрешений «Отправлять сообщения» и «Просмотр сообщений» для этого канала, поэтому уведомления не могут быть отправлены. Как только разрешения будут включены, повторите эту команду!`,
      },
      messages: {
        success: 'Уведомления о Событиях будут публиковаться на этом канале! Используйте '/{unsub}', чтобы остановить публикацию событий здесь. Используйте команду '/{events}' еще раз, чтобы изменить настройки.',
      }
    },
    helltide: {
      name: 'hell-tide',
      description: 'показать карту и информацию об Адском натиске',
      options: {}
    },
    help: {
      name: 'help',
      description: 'показать список доступных команд',
      options: {}
    },
    invite: {
      name: 'invite',
      description: `получить инвайт-ссылку бота для добавления его на другие серверы`,
      options: {}
    },
    nightmareLevel: {
      name: 'nightmare-level',
      description: 'рассчитать оптимальный уровень кошмарного подземелья для вашего персонажа',
      options: {
        level: {
          name: 'level',
          description: 'уровень вашего персонажа'
        },
        worldTier: {
          name: 'world-tier',
          description: `ваш уровень мира (по умолчанию 4)`
        },
      }
    },
    nightmareTier: {
      name: 'nightmare-tiers',
      description: 'отобразить список эффективности кошмарных подземелий',
      options: {}
    },
    paragon: {
      name: 'paragon',
      description: 'найти запись Совершенствования по названию',
      options: {
        entryName: {
          name: 'name',
          description: 'название совершенствования',
        }
      },
      errors: {
        notFound: 'запись кодекса не найдена!',
      },
    },
    panel: {
      name: 'panel',
      description: 'создать панель, которая показывает время мировых событий',
      options: {},
    },
    season: {
      name: 'season',
      description: 'получить информацию о предстоящем/текущем сезоне',
      options: {},
    },
    skill: {
      name: 'skill',
      description: 'найти навык по названию',
      options: {
        skillName: {
          name: 'name',
          description: 'Название навыка'
        }
      },
      errors: {
        notFound: 'умение не найдено!',
      },
    },
    unsub: {
      name: 'unsub',
      description: 'отписаться от уведомлений Адского натиска и Мировых боссов',
      options: {}
    },
    xpCurve: {
      name: 'xp-curve',
      description: 'показать информацию об опыте и графики прокачки',
      options: {}
    }
  },
  views: {
    events: {
      hellide: {
        title: 'Адский натиск обрушился в {location}!',
        updatePending: ' (изображение будет обновляться)',
        updateDone: ' (изображение обновлено)',
        noImage: ' (изображение недоступно - вероятно, это связано с перебоями в работе службы, и вскоре это должно решиться.)',
        chestsRespawnLabel: 'Респавн сундуков:',
        startLabel: 'Начало:',
        endLabel: 'Конец:',
        locationUrl: 'местоположения сундуков в {location}'
      },
      worldBoss: {
        title: '{name} появляется в {location}!',
        spawnLabel: 'Появляется:'
      },
      zoneEvent: {
        title: 'Собирающиеся полчища собираются в {location}!',
        startLabel: 'Начало:'
      },
      utility: {
        zoneAndTerritory: '{territory}, {zone}'
      }
    }
  },
  gameData: {
    worldBosses: {
      avarice: 'Златолюбец проклятый золотом',
      theWanderingDeath: 'Бродячая смерть ожившая смерть',
      ashava: 'Ашава Чумная',
    },
    map: {
      sanctuary: 'Санктуарий',
      territories: {
        dilapidatedAqueducts: 'Обветшавшие акведуки',
        hauntedWreckage: 'Зловещие обломки',
        templeOfRot: 'Храм гнили',
        norgoiVigil: 'Дозор Норгои',
        korDragan: 'Кор Драган',
        saraanCaldera: 'Сараанский кратер',
        crusadersMonument: `Монумент крестоносцев`,
        caenAdar: 'Каэн Адар',
        fieldsOfDesecration: 'Поруганные поля',
        searedBasin: 'Испарившееся озеро',
        theCrucible: 'Тигель',
	carrowcrestRuins: 'Руины Карроукреста',
	alcarnus: 'Алькарн',
      },
      zones: {
        kehjistan: 'Кеджистан',
        hawezar: 'Хавезар',
        scosglen: 'Скосглен',
        fracturedPeaks: 'Packoлoтыe Вepшины',
        drySteppes: 'Cyхиe Cтeпи',
      }
    }
  }
} satisfies BaseTranslation

export default ru
