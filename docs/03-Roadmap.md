## Milestone 1

Durée estimée : 3 jours.

Initialiser le monorepo.
Installer React.
Configurer Vite.
Configurer TypeScript.
Configurer ESLint.
Configurer Prettier.
CI GitHub.

Livrable:

- Buildotron démarre.

## Milestone 1.5 — Audit technique

Durée estimée : 4 heures maximum.

Objectif :

Étudier des projets open source proches de Buildotron afin d'éviter de réinventer des solutions déjà éprouvées.

### À produire

- docs/research/openpage-audit.md

### À analyser

- Structure du dépôt
- Canvas
- JSON Canonique
- Design System
- Registry des blocs

Règle :

Aucune copie de code.
Seules les décisions d'architecture peuvent être réutilisées.

## Milestone 2 — Canvas

Objectif : rendre la page Product Landing actuellement affichée réellement manipulable par le développeur.

### Comportement attendu

- Sélectionner une section sur le canvas et afficher sa sélection dans l'Inspector.
- Ajouter une section depuis la Library, la déplacer, la dupliquer et la supprimer.
- Réordonner les sections par glisser-déposer ; prévoir aussi une commande accessible au clavier pour les déplacer.
- Utiliser les slots Header, Hero, Content, Conversion et Footer. Par défaut, chaque type de section ne peut être placé que dans les slots autorisés par le Blueprint.
- Proposer au développeur un override explicite pour placer une section dans un autre slot. L'interface doit distinguer ce placement exceptionnel d'un placement conforme aux règles par défaut.
- Conserver une identification unique de chaque instance de section, notamment après duplication. La structure affichée doit provenir de l'état du projet, sans liste de sections codée en dur dans le canvas.

### Critères de validation

- Ajout, sélection, déplacement, duplication et suppression modifient immédiatement le canvas et l'Inspector de manière cohérente.
- Un déplacement interdit par les règles du Blueprint est refusé clairement tant que l'override n'est pas activé ; avec override, le placement est possible et reste signalé.
- Les commandes essentielles sont utilisables sans souris.
- Aucune action Preview ou Export ne laisse croire qu'un export fonctionnel existe déjà.

Livrable : premier Builder interactif, sur un seul Blueprint et avec des sections de prévisualisation. Le modèle de projet minimal est introduit ici pour porter l'état ; sa persistance est traitée au jalon 3.

## Milestone 3 — JSON

Objectif : faire du JSON canonique la source de vérité du projet de conception, conformément à l'architecture.

### Modèle et validation

- Définir une version du format, l'identité du projet, le Blueprint, le thème, les slots et les instances de sections ordonnées avec identifiants et propriétés.
- Représenter explicitement les placements réalisés avec override, afin de pouvoir les retrouver à la réouverture et les contrôler avant l'export.
- Valider à la lecture les types de sections, les identifiants, les slots, les propriétés et la version du format ; afficher des erreurs compréhensibles sans perdre l'état courant.
- Faire lire et modifier ce modèle unique par le canvas et l'Inspector.

### Sauvegarde et réouverture

- Permettre d'enregistrer un projet Builder et de rouvrir le même projet sans perdre l'ordre, les propriétés ou les overrides.
- Sauvegarder le projet Builder dans un fichier JSON du dépôt et pouvoir le rouvrir dans l'interface. Ce mécanisme est distinct de la génération du site React.

### Critères de validation

- Un aller-retour sauvegarde → réouverture reproduit le même projet.
- Un JSON invalide est refusé avec une explication utile et ne remplace pas le projet ouvert.
- Deux instances du même type de section restent indépendantes.

Livrable : projet de conception sauvegardable et rouvrable dans le Builder.

## Milestone 3.5 — Design System

Créer :

- couleurs
- spacing
- radius
- typographies
- ombres

Livrable :

Le Builder utilise déjà les Design Tokens.

## Milestone 4 — Primitives

Créer:

-Button

-Text

-Image

-Card

Ces éléments deviennent la base de tous les composants.

## Milestone 5 — Sections

Créer Hero, Features, Gallery, FAQ, CTA et Footer comme plugins réutilisables composés de Primitives.

Première tranche réalisée : chaque plugin déclare un manifeste, un schéma des champs `title` et `body`, un rendu React et un aperçu Builder. Les six aperçus sont chargés par un registre commun. Le Builder peut toujours sélectionner, déplacer et éditer ces Sections depuis le JSON canonique. Le CTA dispose aussi d'un libellé et d'un lien configurables, avec validation du lien et lecture des anciens JSON. Le parcours de validation du CTA a été confirmé dans le navigateur ; le jalon 5 reste en cours.

Les éléments de Features sont maintenant éditables, validés dans le JSON et rendus en cartes. Leur parcours manuel a été confirmé dans le navigateur. La validation du JSON refuse maintenant les titres et textes vides des sections ; ce correctif reste à revérifier manuellement avec `docs/testing/features-validation.md`.

Reste à produire avant de considérer ce jalon terminé : les images de Gallery, les questions de FAQ, les formulaires CMS, les images de prévisualisation et les validations d'export propres aux plugins. Les placeholders actuels ne constituent pas un site BIOGRIND livrable.

## Milestone 6 — Blueprints

Créer:

-Product Landing

-Coming Soon

-Portfolio

## Milestone 7 — Code Generator

Créer:

-Handlebars

-Starter React

-README

Premier export.

Pour le premier essai, générer le projet React dans un dossier dédié du dépôt afin de pouvoir examiner les fichiers et exécuter son build avant la livraison en ZIP.

## Milestone 8 — Core CMS

Créer:

-SQLite

-Auth

-Médias

-Produits

-SEO

Premier projet autonome.

## Milestone 9 — BIOGRIND

Construire entièrement BIOGRIND.

Chaque manque enrichit Buildotron.
