# Buildotron — Architecture

Ce document décrit l'architecture technique de Buildotron.

Son objectif est de définir les responsabilités de chaque couche du projet et de servir de référence pendant le développement.

Le cahier des charges décrit les fonctionnalités attendues.
Ce document décrit comment elles sont organisées.

---

# Principes fondamentaux

L'architecture repose sur quatre principes.

1. Le Builder est un outil réservé aux développeurs.
2. Le JSON Canonique est la seule source de vérité.
3. Les projets exportés ne reviennent jamais dans le Builder.
4. Chaque composant doit être réutilisable.

---

# Vue d'ensemble

Le flux principal est le suivant.

```
Builder
    │
    ▼
JSON Canonique
    │
    ▼
Code Generator
    │
    ▼
Projet React autonome
    │
    ▼
CMS embarqué
```

Chaque couche possède une responsabilité unique.

---

# Les couches du système

## 1. Builder

Le Builder est l'application utilisée par les développeurs.

Il permet de :

- choisir un Blueprint ;
- ajouter des Sections ;
- déplacer les Sections ;
- modifier le thème ;
- préparer l'export.

Le Builder ne gère jamais les projets après leur export.

---

## 2. JSON Canonique

Le JSON Canonique représente l'état complet d'un projet.

Il ne contient jamais de code.

Exemple.

```json
{
  "blueprint": "product-landing",
  "theme": "minimal",
  "sections": [
    "hero",
    "features",
    "gallery",
    "faq",
    "cta"
  ]
}
```

Toutes les autres couches travaillent à partir de cette représentation.

---

## 3. Code Generator

Le Code Generator transforme le JSON en projet React complet.

Il assemble :

- le Starter React ;
- les composants ;
- le Core CMS ;
- la configuration du projet ;
- la documentation générée.

Le générateur utilise des templates Handlebars.

Il ne produit jamais du code arbitraire.

---

## 4. Projet exporté

Le résultat final est un projet React autonome.

Le développeur peut ensuite :

- ouvrir le projet dans VS Code ;
- modifier librement le code ;
- ajouter les vrais assets ;
- déployer le site.

Le projet exporté ne revient jamais dans Buildotron.

---

## 5. Core CMS

Chaque projet exporté embarque automatiquement un CMS.

Le CMS permet uniquement de modifier le contenu.

Le client peut :

- modifier les textes ;
- changer les images ;
- gérer les produits ;
- modifier le SEO.

Le client ne peut jamais modifier la structure des pages.

---

# Hiérarchie du contenu

Buildotron repose sur trois niveaux.

```
Blueprint
    ↓
Section
    ↓
Primitive
```

Cette hiérarchie doit être respectée par tous les nouveaux composants.

---

## Blueprints

Un Blueprint est une recette de départ.

Il définit :

- la structure du site ;
- les Slots ;
- le thème ;
- les placeholders.

Exemples.

- Product Landing
- Artisan Portfolio
- Service Business
- Coming Soon

---

## Sections

Une Section représente un bloc de page.

Exemples.

- Hero
- Gallery
- FAQ
- Features
- CTA
- Footer

Une Section est composée de plusieurs Primitives.

---

## Primitives

Les Primitives sont les éléments UI fondamentaux.

Exemples.

- Button
- Text
- Image
- Card
- Input

Une Primitive ne doit jamais être dupliquée.

Toutes les Sections doivent la réutiliser.

---

# Les Slots

Les Blueprints utilisent des emplacements contrôlés.

```
Header

Hero

Content

Conversion

Footer
```

Chaque Slot accepte uniquement certains types de Sections.

| Slot | Sections autorisées |
|------|----------------------|
| Header | Navbar |
| Hero | Hero |
| Content | Gallery, Features, FAQ |
| Conversion | CTA |
| Footer | Footer |

Cette règle garantit une structure cohérente.

---

# Architecture des plugins

Chaque Section est un plugin.

Structure officielle.

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

Le plugin possède trois représentations.

- aperçu Builder ;
- formulaire CMS ;
- rendu React.

Une seule logique est maintenue.

---

# Architecture des packages

Le monorepo est organisé de la manière suivante.

```
buildotron/

apps/
    builder/

packages/
    design-system/
    plugin-sdk/
    generator/
    core-cms/

plugins/
blueprints/
starters/
tests/
docs/
```

Chaque dossier possède une responsabilité claire.

---

## apps/

Contient les applications exécutables.

Aujourd'hui.

- Builder.

---

## packages/

Contient le code partagé.

### design-system

- Design Tokens ;
- couleurs ;
- spacing ;
- radius ;
- typographies.

### plugin-sdk

Outils permettant de créer de nouveaux plugins.

### generator

Transforme le JSON en projet React.

### core-cms

CMS embarqué partagé par tous les projets.

---

## plugins/

Contient tous les plugins officiels.

Chaque nouveau composant doit être ajouté ici.

---

## blueprints/

Contient les Blueprints officiels.

Ils servent de point de départ aux nouveaux projets.

---

## starters/

Contient les projets modèles.

V1.

- React.

---

# Flux d'un nouveau projet

Le cycle complet est le suivant.

```
Choisir un Blueprint
        │
        ▼
Instanciation
        │
        ▼
Réorganisation des Sections
        │
        ▼
Export
        │
        ▼
Projet React autonome
        │
        ▼
Remplissage des contenus
        │
        ▼
Livraison au client
```

Cette séparation est volontaire.

Le Builder intervient uniquement pendant la conception.

---

# Flux d'un export

Avant qu'un projet soit exporté, Buildotron exécute plusieurs étapes.

```
JSON
    │
    ▼
Templates Handlebars
    │
    ▼
Génération
    │
    ▼
Build
    │
    ▼
Tests
    │
    ▼
ZIP
```

Un export n'est jamais produit si une étape critique échoue.

---

# Le rôle du Design System

Le Design System est utilisé dès le Builder.

Toutes les interfaces utilisent les mêmes Design Tokens.

Exemple.

```ts
spacing.md
radius.md
color.primary
```

Aucune valeur ne doit être hardcodée dans les composants.

---

# SEO dans l'architecture

Le SEO fait partie intégrante du système.

Il repose sur quatre niveaux.

- Blueprints
- Sections
- CMS
- Export

Chaque composant peut déclarer des métadonnées SEO.

Exemple.

- Hero → H1
- FAQ → FAQ Schema
- Product → Product Schema

Le générateur produit automatiquement les balises correspondantes.

---

# Évolutions prévues

Certaines évolutions sont volontairement reportées.

- Export Svelte
- Export Astro
- Undo / Redo
- Marketplace privée de plugins
- Déploiement Git automatisé

Ces évolutions devront respecter les principes définis dans ce document.

---

# Règles d'architecture

Avant d'ajouter une nouvelle fonctionnalité, vérifier qu'elle respecte les règles suivantes.

- Un Blueprint décrit une structure.
- Une Section compose une page.
- Une Primitive est toujours réutilisée.
- Le JSON reste la seule source de vérité.
- Le CMS ne modifie jamais la structure.
- Les projets exportés ne reviennent jamais dans le Builder.
- Aucun composant ne contourne le Design System.