import type { BaseTranslation } from '../i18n-types'

const br = {
  nativeName: 'Português do Brasil',
  commands: {
    about: {
      name: 'sobre',
      description: 'obter informações gerais sobre o bot',
      options: {}
    },
    codex: {
      name: 'códice',
      description: 'encontre uma entrada de códice pelo nome',
      options: {
        codexEntryNameOption: {
          name: 'nome',
          description: 'nome da entrada do códice',
        }
      },
      errors: {
        notFound: 'entrada do códice não encontrada',
      }
    },
    config: {
      name: 'configurar',
      description: 'editar e visualizar sua configuração atual',
      options: {
        locale: {
          name: 'local',
          description: 'defina o local para o bot neste servidor'
        }
      },
    },
    events: {
      name: 'eventos',
      description: 'receba atualizações sobre marés infernais e chefes do mundo',
      options: {
        helltide: {
          name: 'maré-infernal',
          description: `receba alertas sobre próximas marés infernais (padrão para 'verdadeiro')`,
        },
        worldBoss: {
          name: 'chefe-do-mundo',
          description: `receba alertas sobre próximos chefes do mundo (padrão para 'verdadeiro')`,
        },
        zoneEvent: {
          name: 'evento-zona',
          description: `receba alertas sobre próximos eventos de zona (padrão para 'falso')`,
        },
        helltideRole: {
          name: 'papel-maré-infernal',
          description: 'defina usuário ou papel para ser alertado sobre as próximas marés infernais',
        },
        worldBossRole: {
          name: 'papel-chefe-do-mundo',
          description: 'defina usuário ou papel para ser alertado sobre os próximos chefes do mundo',
        },
        zoneEventRole: {
          name: 'papel-evento-zona',
          description: 'defina usuário ou papel para ser alertado sobre os próximos eventos de zona',
        },
        allEventRole: {
          name: 'papel-todos-eventos',
          description: 'defina usuário ou papel para ser alertado sobre todos os eventos',
        },
        images: {
          name: 'mostrar-imagens',
          description: 'mostrar imagens nos alertas',
        },
        deleteMessages: {
          name: 'excluir-eventos-expirados',
          description: 'excluir notificações de eventos do canal após o término do evento',
        },
      },
      errors: {
        permissions: `O bot atualmente não possui permissão de "Enviar Mensagens" e "Ver Mensagens" para este canal, por isso os alertas não podem ser enviados. Assim que as permissões forem habilitadas, execute este comando novamente!`,
      },
      messages: {
        success: 'os eventos serão postados neste canal! Use `/{unsub}` para parar as postagens de eventos aqui. Use o comando `/{events}` novamente para alterar sua configuração.',
      }
    },
    helltide: {
      name: 'hell-tide',
      description: 'exibir mapa e informações sobre as marés do inferno',
      options: {}
    },
    help: {
      name: 'ajuda',
      description: 'mostrar uma lista de comandos disponíveis',
      options: {}
    },
    invite: {
      name: 'convite',
      description: `obtenha o link de convite do bot e adicione-o a outros servidores`,
      options: {}
    },
    nightmareLevel: {
      name: 'nível-pesadelo',
      description: 'calcule o nível ideal de masmorra de pesadelo para o seu personagem',
      options: {
        level: {
          name: 'nível',
          description: 'o nível do seu personagem'
        },
        worldTier: {
          name: 'camada-mundial',
          description: `a sua camada mundial (padrão é 4)`
        },
      }
    },
    nightmareTier: {
      name: 'camadas-pesadelo',
      description: 'exibir uma lista de eficiência das masmorras de pesadelo',
      options: {}
    },
    paragon: {
      name: 'paragon',
      description: 'encontre uma entrada paragon pelo nome',
      options: {
        entryName: {
          name: 'nome',
          description: 'o nome da entrada paragon',
        }
      },
      errors: {
        notFound: 'entrada do codex não encontrada!',
      },
    },
    season: {
      name: 'temporada',
      description: 'obter informações sobre a temporada futura/atual',
      options: {},
    },
    skill: {
      name: 'habilidade',
      description: 'encontre uma habilidade pelo nome',
      options: {
        skillName: {
          name: 'nome',
          description: 'o nome da habilidade'
        }
      },
      errors: {
        notFound: 'habilidade não encontrada!',
      },
    },
    unsub: {
      name: 'cancelar-inscrição',
      description: 'cancelar a inscrição nas atualizações de maré do inferno e chefe do mundo',
      options: {}
    },
    xpCurve: {
      name: 'curva-xp',
      description: 'mostrar informações sobre xp e a curva de nivelamento',
      options: {}
    }
  },
  views: {
    events: {
      hellide: {
        title: 'A Maré do Inferno Surge em {location}!',
        updatePending: ' (imagem será atualizada)',
        updateDone: ' (imagem atualizada)',
        noImage: ' (imagem indisponível - provavelmente devido a uma interrupção do serviço que deve ser resolvida em breve)',
        chestsRespawnLabel: 'Baús reaparecem:',
        startLabel: 'Início:',
        endLabel: 'Fim:',
        locationUrl: 'Localizações do baú {location}'
      },
      worldBoss: {
        title: '{name} está se agitando em {location}!',
        spawnLabel: 'Aparece:'
      },
      zoneEvent: {
        title: 'As Legiões de Reunião se reúnem em {location}!',
        startLabel: 'Começa:'
      },
      utility: {
        zoneAndTerritory: '{territory}, {zone}'
      }
    }
  },
  gameData: {
    worldBosses: {
      avarice: 'Avarice',
      theWanderingDeath: 'The Wandering Death',
      ashava: 'Ashava',
    },
    map: {
      sanctuary: 'Sanctuary',
      territories: {
        dilapidatedAqueducts: 'Aquedutos Dilapidados',
        hauntedWreckage: 'Destroços Assombrados',
        templeOfRot: 'Templo da Decomposição',
        norgoiVigil: 'Vigília Norgoi',
        korDragan: 'Kor Dragan',
        saraanCaldera: 'Caldeira Saraan',
        crusadersMonument: `Monumento dos Cruzados`,
        caenAdar: 'Caen Adar',
        fieldsOfDesecration: 'Campos de Desecração',
        searedBasin: 'Bacia Chamuscada',
        theCrucible: 'El Crisol',
				carrowcrestRuins: 'Ruinas de Carrowcrest',
				alcarnus: 'Alcarnus',
      },
      zones: {
        kehjistan: 'Kehjistan',
        hawezar: 'Hawezar',
        scosglen: 'Scosglen',
        fracturedPeaks: 'Picos Fraturados',
        drySteppes: 'Estepes Secas',
      }
    }
  }
} satisfies BaseTranslation

export default br
