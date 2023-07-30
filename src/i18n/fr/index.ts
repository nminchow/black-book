import type { BaseTranslation } from '../i18n-types'

const fr = {
  nativeName: 'Français',
  commands: {
    about: {
      name: 'aperçu',
      description: 'obtenir des informations générales sur le bot',
      options: {}
    },
    codex: {
      name: 'codex',
      description: 'trouver une entrée de codex par son nom',
      options: {
        codexEntryNameOption: {
          name: 'nom',
          description: `nom de l'entrée de codex`,
        }
      },
      errors: {
        notFound: 'entrée de codex non trouvée',
      }
    },
    config: {
      name: 'configurer',
      description: 'modifier et voir votre configuration actuelle',
      options: {
        locale: {
          name: 'locale',
          description: 'définit la locale pour le bot sur ce serveur'
        }
      },
    },
    events: {
      name: 'événements',
      description: `recevoir des mises à jour sur les marées d'enfer et les boss du monde`,
      options: {
        helltide: {
          name: 'vague-infernale',
          description: `recevoir des alertes sur les prochaines vagues infernales (valeur par défaut est 'vrai')`,
        },
        worldBoss: {
          name: 'world-boss',
          description: `recevoir des alertes sur les prochains world boss  (valeur par défaut est 'vrai')`,
        },
        zoneEvent: {
          name: 'événement-de-zone',
          description: `recevoir des alertes sur les prochains événements de zone (valeur par défaut est 'vrai')`,
        },
        helltideRole: {
          name: 'rôle-de-vague-infernale',
          description: 'définit utilasateur ou rôle pour être alerté sur les prochaines vagues infernales',
        },
        worldBossRole: {
          name: 'rôle-de-world-boss',
          description: 'définit utilasateur ou rôle pour être alerté sur les prochains boss mondial ',
        },
        zoneEventRole: {
          name: 'rôle-de-événement-zone',
          description: 'définit utilasateur ou rôle pour être alerté sur les prochains événements de zone',
        },
        allEventRole: {
          name: 'rôle-de-tous-les-événements',
          description: 'définit utilasateur ou rôle pour être alerté sur tous les événements',
        },
        images: {
          name: 'images',
          description: 'montrer des images dans les alertes',
        },
        deleteMessages: {
          name: 'efacer-événements-expirés',
          description: 'efacer notifications de événements de le canal depuis de que le événement est terminé',
        },
      },
      errors: {
        permissions: `Le bot actualment n'a pas les permissions de "Envoyer Messages" et "Voir Messages" pour ce canal, donc il ne peut pas envoyer des alertes. Aprés leur autorisation, reexécuter cette commande!`,
      },
      messages: {
        success: 'Les événements seront publiés dans ce canal! Utiliser `/{unsub}` pour arrêter les publications de événements ici. Utiliser la commande `/{events}` de nouveau pour changer votre configuration.',
      }
    },
    helltide: {
      name: 'hell-tide',
      description: 'montrer la carte et des informations sur les vagues infernales',
      options: {}
    },
    help: {
      name: 'aide',
      description: 'montrer une liste des commandes disponibles',
      options: {}
    },
    invite: {
      name: 'inviter',
      description: `obtenir le lien d'invitation du bot et ajoute-le a autres serveurs`,
      options: {}
    },
    nightmareLevel: {
      name: 'nightmare-level',
      description: 'calculer le niveau optimal pour les donjons du cauchemar pour votre personnage',
      options: {
        level: {
          name: 'niveau',
          description: 'le niveau de votre personnage'
        },
        worldTier: {
          name: 'niveau-de-monde',
          description: `votre niveau de monde (par défaut c'est 4)`
        },
      }
    },
    nightmareTier: {
      name: 'niveaux-cauchemar',
      description: `montrer une liste de niveaux d'efficacité de donjons du cauchemar`,
      options: {}
    },
    paragon: {
      name: 'parangon',
      description: 'trouver une entrée de parangon par son nom',
      options: {
        entryName: {
          name: 'nom',
          description: `nom de l'entrée paragon`,
        }
      },
      errors: {
        notFound: 'entrée de codex non trouvée!',
      },
    },
    panel: {
      name: 'panneau',
      description: 'créer un panneau qui montre le programme des événements mondiaux',
      options: {},
    },
    season: {
      name: 'saison',
      description: 'obtenir des informations sobre la saison prochaine/actuelle',
      options: {},
    },
    skill: {
      name: 'compétence',
      description: 'trouver une compétence par son nom',
      options: {
        skillName: {
          name: 'nom',
          description: 'nom de la compétence'
        }
      },
      errors: {
        notFound: 'compétence non trouvée!',
      },
    },
    unsub: {
      name: 'désabonner',
      description: `annuler l'abonnement a les nouvelles de vagues infernales et boss mondial`,
      options: {
				channelId: {
					name: 'canal',
					description: 'canal ID'
				}
			}
    },
    xpCurve: {
      name: 'courbe-xp',
      description: 'montrer des informations sur xp et la courbe de nivellement',
      options: {}
    }
  },
  views: {
    events: {
      hellide: {
        title: 'La Vague Infernale déferle sur {location}!',
        updatePending: ` (l'image sera actualisée) `,
        updateDone: ' (image actualisée)',
        noImage: ` (image non disponible - il s'agit probablement d'une panne de service et devrait bientôt être resolu)`,
        chestsRespawnLabel: 'Les coffres réapparaissent:',
        startLabel: 'Début:',
        endLabel: 'Fin:',
        locationUrl: 'Lieux de les coffres en {location}'
      },
      worldBoss: {
        title: `{name} s'agit dans {location}!`,
        spawnLabel: 'Spawn:'
      },
      zoneEvent: {
        title: 'La mobilisation des légions démarre en {location}!',
        startLabel: 'Début:'
      },
      utility: {
        zoneAndTerritory: '{territory}, {zone}'
      }
    }
  },
  gameData: {
    worldBosses: {
      avarice: 'Avarice',
      theWanderingDeath: 'Mort Vagabonde',
      ashava: 'Ashava',
    },
    map: {
      sanctuary: 'Sanctuaire',
      territories: {
        dilapidatedAqueducts: 'Aqueducs Délabrés',
        hauntedWreckage: 'Épave Hantée',
        templeOfRot: 'Temple de la Putréfaction',
        norgoiVigil: 'Veillée de Norgoi',
        korDragan: 'Kor Dragan',
        saraanCaldera: 'Caldera de Saraan',
        crusadersMonument: `Monument des Croisés`,
        caenAdar: 'Caen Adar',
        fieldsOfDesecration: 'Silons de la Profanation',
        searedBasin: 'Bassin Calciné',
        theCrucible: 'Le Creuset',
				carrowcrestRuins: 'Ruines de la Crête-du-Flambeur',
				alcarnus: 'Alcarnus',
      },
      zones: {
        kehjistan: 'Kehjistan',
        hawezar: 'Hawezar',
        scosglen: 'Scosglen',
        fracturedPeaks: 'Pics Brisés',
        drySteppes: 'Steppes Arides',
      }
    }
  }
} satisfies BaseTranslation

export default fr
