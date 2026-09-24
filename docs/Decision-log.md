# Decision Log

Ce document recense les décisions d'architecture figées du projet.

Une décision inscrite ici n'est remise en question qu'après une discussion explicite.

| Date    | Décision                                                  | Pourquoi                                        |
| ------- | --------------------------------------------------------- | ----------------------------------------------- |
| 2026-09 | Builder en React (V1)                                     | Pragmatique et compatible avec l'équipe.        |
| 2026-09 | Export React uniquement (V1)                              | Livrer BIOGRIND rapidement.                     |
| 2026-09 | Les projets exportés ne reviennent jamais dans le Builder | Simplifie fortement l'architecture.             |
| 2026-09 | Le CMS gère uniquement le contenu                         | Évite de recréer le Builder côté client.        |
| 2026-09 | Les assets sont ajoutés après export                      | Le Builder fournit uniquement des placeholders. |
| 2026-09 | Les composants sont Headless                              | Une seule implémentation pour plusieurs usages. |
| 2026-09 | Les Blueprints servent de point de départ                 | Accélérer la création des projets.              |
| 2026-09 | Le Code Generator utilise Handlebars                      | Génération robuste à partir de templates.       |
| 2026-09 | SQLite est retenu pour le CMS                             | Simplicité et autonomie des projets.            |
| 2026-09 | OpenAPI est ajouté après stabilisation de l'API CMS       | Éviter de maintenir un contrat encore mouvant.  |
