# Audit technique — OpenPage

Source examinée : [dépôt OpenPage](https://github.com/buildingopen/openpage), en particulier son [organisation `src`](https://github.com/buildingopen/openpage/tree/master/src), ses dossiers [`editor`](https://github.com/buildingopen/openpage/tree/master/src/editor), [`store`](https://github.com/buildingopen/openpage/tree/master/src/store) et [`blocks`](https://github.com/buildingopen/openpage/tree/master/src/blocks). Analyse documentaire du dépôt public ; aucun code copié.

## Constats

| Sujet         | Observation                                                                                                                                 | Décision pour Buildotron                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure     | OpenPage distingue `editor`, `store` et `blocks` dans `src`.                                                                                | Conserver la séparation entre Builder, modèle de projet, Design System et plugins dans le monorepo.                                                   |
| Canvas        | L'éditeur possède un Canvas, un panneau de couches et un panneau de propriétés ; le dépôt annonce sélection, déplacement et réorganisation. | Garder un état de projet unique pour Canvas et Inspector ; conserver les règles de slots et l'override explicite propres à Buildotron.                |
| JSON          | Le README décrit une configuration JSON structurée comme source de vérité, lue par l'éditeur et le rendu.                                   | Conserver le JSON canonique versionné, validé à l'ouverture et sauvegardé dans le dépôt. Séparer ensuite ce modèle du site React généré.              |
| Design System | Le README annonce des thèmes avec couleurs, polices, rayons et espacement.                                                                  | Maintenir les tokens dans `packages/design-system` et les partager entre Builder et rendu.                                                            |
| Registre      | Le dossier `blocks` comporte un registre et des blocs rangés par type.                                                                      | Garder le registre des plugins et leurs manifestes, schémas, aperçus et rendus. Faire évoluer chaque schéma selon les données réellement nécessaires. |

Le README d'OpenPage annonce Zustand et Immer pour l'état et l'historique, ainsi que `@dnd-kit` pour le glisser-déposer. Ce sont des pistes à réévaluer si la complexité du Canvas augmente ; le Canvas actuel n'exige pas encore ces dépendances. Le README décrit également un export HTML autonome, alors que Buildotron vise un export de projet React avec CMS embarqué.

## Suite décidée

Le modèle JSON, les slots et les plugins sont déjà en place. La prochaine étape utile est de terminer les données et rendus des Sections du jalon 5, puis de vérifier leur cohérence avec les Blueprints et le générateur React. Aucun changement d'architecture n'est requis par cet audit.
