# Buildotron

> Buildotron est un Builder visuel destiné aux développeurs permettant de créer des sites professionnels par Drag & Drop, puis de générer un véritable projet React autonome avec son propre CMS intégré.

## Objectif

Créer rapidement des sites réutilisables sans dépendre de Webflow, Framer ou Squarespace.

Le premier projet développé avec Buildotron est **BIOGRIND**, qui sert de projet pilote.

## Fonctionnalités visées

- Drag & Drop de sections
- Blueprints (templates de départ)
- Bibliothèque de composants réutilisables
- Export React
- CMS embarqué
- SQLite
- README généré automatiquement
- Validation avant export

## Philosophie

Le Builder est réservé aux développeurs.

Les projets exportés sont ensuite modifiables dans VS Code et disposent d'un CMS permettant au client de gérer uniquement le contenu.

## Inspirations techniques


Buildotron s'inspire de plusieurs projets open source pour certaines décisions d'architecture, tout en conservant une philosophie différente.

Parmi les références étudiées :

OpenPage (éditeur React modulaire)

Puck (éditeur basé sur des composants React)

Plasmic (Code Components)

L'objectif est de réutiliser des idées éprouvées sans reproduire ces produits.

## Avancement

Le détail des objectifs et critères de validation se trouve dans [la roadmap](docs/03-Roadmap.md).

| Jalon | État | Étapes accomplies |
| --- | --- | --- |
| 1 — Socle | En cours | Monorepo, React, Vite, TypeScript et ESLint opérationnels. Prettier et CI restent à vérifier ou configurer. |
| 1.5 — Audit | En cours | Trame d'audit OpenPage créée ; analyse technique à compléter. |
| 2 — Canvas | Validé dans le navigateur | Ajout, sélection, déplacement, duplication, suppression, slots et override explicite ; déplacement par glisser-déposer, boutons et flèches. |
| 3 — JSON canonique | Validé dans le navigateur | Format versionné, propriétés éditables, téléchargement d'un fichier JSON, réouverture et validation des données. |
| 3.5 — Design System | Implémenté | Couleurs, typographies, espacements, rayons et ombres centralisés dans le package partagé et utilisés par le Builder. |
| 4 — Primitives | Implémenté | Button, Text, Image et Card disponibles dans le package partagé ; Button et Text utilisés dans le Builder. |
| 5 — Sections | En cours | Aperçus et rendus React de Hero, Features, Gallery, FAQ, CTA et Footer reliés au registre des plugins. Libellé et lien CTA configurables et validés dans le navigateur ; listes, images et formulaires CMS restent à créer. |
| 6 et suivants | À faire | Blueprints, générateur React, CMS puis BIOGRIND. |

## Essayer le Builder

```bash
npm install
npm run dev -w builder
```

Le projet d'exemple est [projects/product-landing.json](projects/product-landing.json). Dans le Builder, **Ouvrir JSON** charge ce fichier. **Enregistrer JSON** déclenche un seul téléchargement : choisir le dossier `projects/` dans le navigateur, ou y déplacer ensuite le fichier téléchargé.

React et React DOM sont fixés à la même version dans le monorepo. Si Vite tournait avant une mise à jour des dépendances, l'arrêter puis le relancer avec `npm run dev -w builder -- --force` pour reconstruire son cache. `npm ls react react-dom --all` permet de contrôler les versions installées.

Le [parcours de validation du canvas et du JSON](docs/testing/canvas-json-validation.md) détaille les contrôles à effectuer dans le navigateur. Vérifications automatisées : `npm run lint -w builder`, `npm run build -w builder` et `node --test --experimental-strip-types --test-isolation=none` (Node.js 24).

Le parcours de validation manuelle des étapes 1 à 8 a été confirmé. L'enregistrement utilise un téléchargement unique, vérifié par réouverture du JSON ; les flèches ↑ et ↓ déplacent une section focalisée dans son slot.

Le [parcours de validation du CTA](docs/testing/cta-validation.md) a été confirmé dans le navigateur : modification du libellé et du lien, sauvegarde, réouverture et refus d'un lien dangereux.

### Suivi des étapes

- Jalon 1 — en cours : socle fonctionnel ; Prettier et CI restent à traiter.
- Jalon 1.5 — en cours : trame d'audit créée ; analyse technique restante.
- Jalon 2 — OK : Canvas et interactions validés dans le navigateur.
- Jalon 3 — OK : projet JSON enregistré et rouvert avec succès.
- Jalon 3.5 — implémenté : tokens du Design System centralisés.
- Jalon 4 — implémenté : quatre Primitives disponibles.
- Jalon 5 — en cours : six plugins de Section intégrés ; sous-étape CTA validée dans le navigateur.
