import type { BaseTranslation } from '../i18n-types'

const es = {
  nativeName: 'Español',
  commands: {
    about: {
      name: 'acerca',
      description: 'obtener información general sobre el bot',
      options: {}
    },
    codex: {
      name: 'codex',
      description: 'encuentra una entrada de codex por nombre',
      options: {
        codexEntryNameOption: {
          name: 'nombre',
          description: 'nombre de la entrada de codex',
        }
      },
      errors: {
        notFound: 'entrada de codex no encontrada',
      }
    },
    config: {
      name: 'configurar',
      description: 'editar y ver su configuración actual',
      options: {
        locale: {
          name: 'locale',
          description: 'establece la configuración regional para el bot en este servidor'
        }
      },
    },
    events: {
      name: 'eventos',
      description: 'recibe actualizaciones sobre mareas infernales y jefes del mundo',
      options: {
        helltide: {
          name: 'marea-infernal',
          description: `recibir alertas sobre las próximas mareas infernales (por defecto es 'verdadero')`,
        },
        worldBoss: {
          name: 'jefe-del-mundo',
          description: `recibir alertas sobre los próximos jefes del mundo (por defecto es 'verdadero')`,
        },
        zoneEvent: {
          name: 'evento-de-zona',
          description: `recibir alertas sobre los próximos eventos de zona (por defecto es 'falso')`,
        },
        helltideRole: {
          name: 'rol-de-marea-infernal',
          description: 'establecer usuario o rol para ser alertado sobre las próximas mareas infernales',
        },
        worldBossRole: {
          name: 'rol-de-jefe-del-mundo',
          description: 'establecer usuario o rol para ser alertado sobre los próximos jefes del mundo',
        },
        zoneEventRole: {
          name: 'rol-de-evento-de-zona',
          description: 'establecer usuario o rol para ser alertado sobre los próximos eventos de zona',
        },
        allEventRole: {
          name: 'rol-de-todos-los-eventos',
          description: 'establecer usuario o rol para ser alertado sobre todos los eventos',
        },
        images: {
          name: 'mostrar-imágenes',
          description: 'mostrar imágenes en alertas',
        },
        deleteMessages: {
          name: 'eliminar-eventos-vencidos',
          description: 'eliminar notificaciones de eventos del canal después de que el evento ha terminado',
        },
      },
      errors: {
        permissions: `El bot actualmente no tiene los permisos de "Enviar Mensajes" y "Ver Mensajes" para este canal, por lo que no se pueden enviar alertas. ¡Una vez que se habiliten los permisos, vuelva a ejecutar este comando!`,
      },
      messages: {
        success: '¡los eventos se publicarán en este canal! Usa `/{unsub}` para detener las publicaciones de eventos aquí. Usa el comando `/{events}` nuevamente para cambiar tu configuración.',
      }
    },
    helltide: {
      name: 'hell-tide',
      description: 'muestra el mapa e información sobre las mareas infernales',
      options: {}
    },
    help: {
      name: 'ayuda',
      description: 'muestra una lista de comandos disponibles',
      options: {}
    },
    invite: {
      name: 'invitar',
      description: `obtén el enlace de invitación del bot y añádelo a otros servidores`,
      options: {}
    },
    nightmareLevel: {
      name: 'nightmare-level',
      description: 'calcula el nivel óptimo de mazmorra de pesadilla para tu personaje',
      options: {
        level: {
          name: 'nivel',
          description: 'el nivel de tu personaje'
        },
        worldTier: {
          name: 'world-tier',
          description: `tu nivel mundial (por defecto es 4)`
        },
      }
    },
    nightmareTier: {
      name: 'nightmare-tiers',
      description: 'muestra una lista de eficiencia de mazmorras de pesadilla',
      options: {}
    },
    paragon: {
      name: 'paragon',
      description: 'encuentra una entrada de paragon por nombre',
      options: {
        entryName: {
          name: 'nombre',
          description: 'nombre de la entrada paragon',
        }
      },
      errors: {
        notFound: '¡entrada de codex no encontrada!',
      },
    },
    panel: {
      name: 'panel',
      description: 'crear un panel que muestre los horarios de eventos mundiales',
      options: {},
    },
    season: {
      name: 'temporada',
      description: 'obtener información sobre la temporada próxima/actual',
      options: {},
    },
    skill: {
      name: 'habilidad',
      description: 'encuentra una habilidad por nombre',
      options: {
        skillName: {
          name: 'nombre',
          description: 'nombre de la habilidad'
        }
      },
      errors: {
        notFound: '¡habilidad no encontrada!',
      },
    },
    unsub: {
      name: 'unsub',
      description: 'cancela la suscripción a las actualizaciones de marea infernal y jefe mundial',
      options: {}
    },
    xpCurve: {
      name: 'xp-curve',
      description: 'muestra información sobre xp y la curva de nivelación',
      options: {}
    }
  },
  views: {
    events: {
      hellide: {
        title: '¡La Marea Infernal se levanta en {location}!',
        updatePending: ' (la imagen se actualizará)',
        updateDone: ' (imagen actualizada)',
        noImage: ' (imagen no disponible - esto probablemente se deba a una interrupción del servicio y debería resolverse pronto)',
        chestsRespawnLabel: 'Los cofres reaparecen:',
        startLabel: 'Comienza:',
        endLabel: 'Termina:',
        locationUrl: 'Ubicaciones de los cofres en {location}'
      },
      worldBoss: {
        title: '¡{name} se está agitando en {location}!',
        spawnLabel: 'Aparece:'
      },
      zoneEvent: {
        title: '¡Las Legiones Reunidas se reúnen en {location}!',
        startLabel: 'Comienza:'
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
      sanctuary: 'Santuario',
      territories: {
        dilapidatedAqueducts: 'Acueductos Dilapidados',
        hauntedWreckage: 'Restos Embrujados',
        templeOfRot: 'Templo de la Descomposición',
        norgoiVigil: 'Vigilia de Norgoi',
        korDragan: 'Kor Dragan',
        saraanCaldera: 'Caldera de Saraan',
        crusadersMonument: `Monumento de los Cruzados`,
        caenAdar: 'Caen Adar',
        fieldsOfDesecration: 'Campos de Desecración',
        searedBasin: 'Cuenca Quemada',
        theCrucible: 'El Crisol',
				carrowcrestRuins: 'Ruinas de Carrowcrest',
				alcarnus: 'Alcarnus',
      },
      zones: {
        kehjistan: 'Kehjistan',
        hawezar: 'Hawezar',
        scosglen: 'Scosglen',
        fracturedPeaks: 'Picos Fracturados',
        drySteppes: 'Estepas Secas',
      }
    }
  }
} satisfies BaseTranslation

export default es
