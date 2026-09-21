# Buildotron — Cahier des Charges

Version : 2.0 (Architecture figée)

## Présentation

Buildotron est une application locale accessible depuis un navigateur permettant de concevoir des sites web par glisser-déposer de composants prédéfinis.

Le Builder est réservé aux développeurs. Une fois le projet exporté, il devient un projet React classique, modifiable dans VS Code et doté d'un CMS intégré permettant au client de gérer uniquement le contenu.

Le premier projet réalisé avec Buildotron sera **BIOGRIND**, qui servira de projet pilote pour enrichir la bibliothèque de composants.

---

## Vision

- Produire des sites professionnels rapidement.
- Construire une bibliothèque de composants réutilisables.
- Générer des projets autonomes sans dépendance à un CMS externe.

---

## Philosophie

### Le Builder

- Choisir un Blueprint.
- Réorganiser les sections.
- Modifier le thème.
- Exporter un projet React.

### Le CMS

- Modifier les textes.
- Remplacer les images.
- Gérer les produits.
- Modifier le SEO.

Le CMS ne peut jamais modifier la structure des pages.

---

## Architecture

Builder

↓

JSON Canonique

↓

Code Generator

↓

Starter React

↓

Projet autonome

Le JSON est la seule source de vérité.

---

## Stack V1

| Élément     | Choix        |
| ----------- | ------------ |
| UI          | React        |
| Build       | Vite         |
| Langage     | TypeScript   |
| Drag & Drop | dnd-kit      |
| État        | Zustand      |
| Routing     | React Router |

Le support Svelte et Astro est prévu pour plus tard.

---

# Blueprints

Les Blueprints sont des recettes de départ.

Exemples :

- Product Landing
- Artisan Portfolio
- Service Business
- Coming Soon

Exemple :

```json
{
  "blueprint": "product-landing",
  "theme": "minimal",
  "sections": ["hero", "features", "gallery", "faq", "cta"]
}
```

---

# Slots

Les Blueprints utilisent des emplacements contrôlés.

| Slot       | Sections autorisées    |
| ---------- | ---------------------- |
| Hero       | Hero                   |
| Content    | Gallery, Features, FAQ |
| Conversion | CTA                    |
| Footer     | Footer                 |

---

# Hiérarchie

Blueprint

↓

Sections

↓

Primitives

### Primitives

- Button
- Text
- Image
- Input
- Card

### Sections

- Hero
- Gallery
- FAQ
- CTA
- Footer
- Navbar
- Features

---

# Plugins Headless

Chaque section est un plugin.

```
Hero.plugin/

editor/
admin/
react/

manifest.json
schema.json
preview.png
tests/
README.md
```

Chaque plugin possède :

- aperçu Builder
- formulaire CMS
- rendu React

---

# Manifest

```json
{
  "id": "hero",
  "name": "Hero",
  "category": "Hero",
  "version": "1.0.0",
  "supports": ["react"]
}
```

---

# Schema

```json
{
  "fields": [
    { "name": "title", "type": "text" },
    { "name": "subtitle", "type": "textarea" }
  ]
}
```

---

# Plugin SDK

Commande prévue :

```bash
npm run create:plugin BeforeAfter
```

Elle génère automatiquement :

- manifest
- schema
- preview
- editor
- admin
- react
- tests
- README

---

# Bibliothèque V1

| Catégorie  | Composants       |
| ---------- | ---------------- |
| Hero       | Hero             |
| Navigation | Navbar           |
| Content    | Features         |
| Media      | Gallery          |
| Product    | Product Features |
| Social     | Testimonials     |
| Conversion | CTA              |
| Footer     | Footer           |
| FAQ        | FAQ              |

---

# Design System

Centraliser :

- couleurs
- typographies
- espacements
- rayons
- ombres
- animations

Aucun style ne doit être hardcodé.

---

# Core CMS

Chaque projet exporté embarque automatiquement un CMS.

Structure :

```
packages/core-cms/

auth/
media/
pages/
products/
settings/
```

---

# Fonctionnalités du CMS

Le client peut :

- modifier les textes
- changer les images
- gérer les produits
- modifier le SEO
- changer le logo
- modifier le favicon

Il ne peut jamais modifier l'organisation des sections.

---

# Stockage

SQLite est retenu.

```
database/site.db
```

Les assets sont ajoutés après export.

---

# Code Generator

Le générateur assemble :

- Starter React
- composants
- Core CMS
- README

Le moteur de templates retenu est **Handlebars**.

---

# Pipeline d'export

1. Génération.
2. `npm install`
3. `npm run build`
4. Lint.
5. Tests.
6. ZIP.

Aucun export n'est produit si une étape échoue.

---

# Tests

Chaque Starter doit réussir :

- installation
- build
- lint

Chaque composant doit être :

- responsive
- accessible
- testé

Playwright assurera les tests visuels.

---

# Structure du dépôt

```
buildotron/

apps/
    builder/

packages/
    core-cms/
    generator/
    plugin-sdk/
    design-system/

plugins/

blueprints/

starters/

tests/

docs/
```

---

# Roadmap

## Phase 0

- Monorepo
- React
- Vite
- TypeScript
- CI
- ESLint

## Phase 1

Canvas Drag & Drop.

## Phase 2

JSON Canonique.

## Phase 3

Primitives.

## Phase 4

Sections.

## Phase 5

Blueprints.

## Phase 6

Code Generator.

## Phase 7

Core CMS.

## Phase 8

Validation.

## Phase 9

Construction complète de BIOGRIND.

---

# Règles GitHub Copilot

- Le Builder gère uniquement la conception.
- Le CMS gère uniquement le contenu.
- Le JSON Canonique est la seule source de vérité.
- Les composants sont Headless.
- Les Blueprints décrivent les structures.
- Les Primitives composent les Sections.
- Toujours partir d'un Starter.
- Aucun export sans validation.
- Les projets exportés ne reviennent jamais dans le Builder.

---

# Définition de réussite

Un développeur doit pouvoir :

- choisir un Blueprint ;
- réorganiser librement les sections ;
- exporter un projet React compilable ;
- ouvrir le projet dans VS Code ;
- ajouter les vrais assets ;
- laisser ensuite le client gérer uniquement le contenu via le CMS intégré.

---

# Vision long terme

Évolutions prévues :

- Export Svelte.
- Export Astro.
- Nouveaux Blueprints.
- Bibliothèque de centaines de composants.
- Marketplace privée de composants.
- Déploiement Git automatisé.

Le principe directeur reste inchangé :

> Chaque heure investie dans un composant, une Primitive ou un Blueprint doit rendre les prochains sites plus rapides à produire.
