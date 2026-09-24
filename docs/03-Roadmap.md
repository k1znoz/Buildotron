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

Les éléments de Features sont maintenant éditables, validés dans le JSON et rendus en cartes. Leur parcours manuel a été confirmé dans le navigateur. La validation du JSON refuse les titres et textes vides des sections ; ce correctif a aussi été confirmé dans le navigateur avec `docs/testing/features-validation.md`.

Les images de Gallery sont maintenant configurables, validées dans le JSON et rendues avec un texte alternatif. Leur parcours a été confirmé dans le navigateur avec `docs/testing/gallery-validation.md`.

Les questions et réponses de FAQ sont maintenant configurables, validées dans le JSON et rendues sous forme de panneaux ouvrables. Leur parcours a été confirmé dans le navigateur avec `docs/testing/faq-validation.md`.

Les liens de Footer sont maintenant configurables, validés dans le JSON et rendus sans quitter le Builder en mode aperçu. Leur parcours a été confirmé dans le navigateur avec `docs/testing/footer-validation.md`.

Le Hero possède désormais une action facultative avec un libellé et un lien validés. Son parcours a été confirmé dans le navigateur avec `docs/testing/hero-action-validation.md`.

Chaque plugin possède une vignette SVG dans la Library. Leur parcours de validation manuelle a été confirmé avec `docs/testing/library-previews-validation.md`.

Un premier contrôle des sections est disponible dans le Builder. Il reprend la validation du JSON canonique et signale les blocages connus avant export : absence de section, Navbar sans lien, CTA sans lien et Gallery sans image. Le panneau suit les modifications du projet. Son parcours manuel a été confirmé avec `docs/testing/section-checks-validation.md`.

Navbar possède désormais un manifeste, un schéma, une vignette, un aperçu Builder et un rendu React. Ses liens sont éditables et validés dans le JSON canonique. Son parcours de validation manuelle a été confirmé avec `docs/testing/navbar-validation.md`.

Le formulaire de contenu Hero destiné au futur CMS permet de modifier le titre, le texte et l'action facultative, puis de les appliquer à un aperçu React isolé. Son parcours manuel a été confirmé avec `docs/testing/hero-admin-validation.md`.

Le formulaire CTA réutilise les champs communs à Hero avec sa propre règle : son lien de bouton est obligatoire. Les deux formulaires disposent d'aperçus distincts sur la page de test, qui conserve les brouillons et les contenus appliqués pendant la navigation entre Hero et CTA, uniquement en mémoire. Son parcours a été confirmé avec `docs/testing/cta-admin-validation.md`.

Le formulaire de contenu Features couvre le titre et le texte de la section ainsi que les textes des cartes existantes. Il garde le nombre de cartes fixe pour que le futur CMS ne change pas la structure de la section. L'aperçu conserve ses données pendant la navigation avec Hero et CTA. Son parcours a été confirmé avec `docs/testing/features-admin-validation.md`.

Le formulaire Gallery permet de changer la source et le texte alternatif des images existantes, avec validation des URL et des champs obligatoires. Il garde le nombre d'emplacements fixe et conserve ses données pendant la navigation entre les aperçus. Son parcours a été confirmé avec `docs/testing/gallery-admin-validation.md`.

Le formulaire FAQ permet de modifier les questions et réponses existantes. Il refuse les entrées incomplètes et conserve son brouillon pendant la navigation entre les aperçus. Son parcours a été confirmé avec `docs/testing/faq-admin-validation.md`.

Le formulaire Footer permet de modifier les textes et les liens existants. Il valide les libellés et les destinations, et garde la structure de la liste fixe. Son parcours a été confirmé avec `docs/testing/footer-admin-validation.md`.

Le formulaire Navbar réutilise la gestion sûre des liens de Footer. Une destination invalide est signalée pendant la saisie et empêche l'application du brouillon. Il complète les formulaires de contenu des sept plugins et respecte la règle selon laquelle le CMS ne modifie pas la structure. Son parcours a été confirmé avec `docs/testing/navbar-admin-validation.md`.

Le contrôle avant export délègue désormais chaque section à son validateur de plugin. Il couvre les sept types, signale aussi les listes vides de Footer, Navbar et Gallery, et conserve la validation canonique comme premier niveau. Son parcours étendu a été confirmé avec `docs/testing/section-checks-validation.md`. Le jalon 5 est validé.

## Milestone 6 — Blueprints

Créer:

-Product Landing

-Coming Soon

-Portfolio

Première tranche réalisée : un registre versionné décrit Product Landing, Coming Soon et Portfolio, leur thème, leurs slots et leurs sections initiales. Le Builder permet de changer de Blueprint, réinitialise explicitement les sections et conserve le nom et l'identifiant du projet. Le JSON canonique accepte ces trois identifiants et refuse les valeurs inconnues. Le parcours manuel dans `docs/testing/blueprint-selection-validation.md` a été confirmé dans le navigateur.

Chaque Blueprint fournit désormais des contenus de départ adaptés à son usage. Ces données sont clonées lors de l'instanciation : modifier un projet ne peut pas altérer la recette ni les prochains projets créés. Le parcours manuel est dans `docs/testing/blueprint-content-validation.md` et reste à confirmer.

Le parcours des contenus propres aux recettes a été confirmé dans le navigateur. Le jalon 6 est validé.

## Milestone 7 — Code Generator

Créer:

-Handlebars

-Starter React

-README

Premier export.

Pour le premier essai, générer le projet React dans un dossier dédié du dépôt afin de pouvoir examiner les fichiers et exécuter son build avant la livraison en ZIP.

Première tranche réalisée : le package `@buildotron/generator` transforme un projet JSON en Starter React à l'aide de Handlebars. La commande `npm run generate -- <source.json> <dossier>` produit le projet dans le dossier choisi. Le premier résultat a été généré dans `projects/generated/product-landing`, ses dépendances ont été installées et son build de production a réussi.

Le premier export autonome a été confirmé hors des sources du Builder. Le Starter généré possède maintenant un registre local qui rend les données des sept types de sections. Un projet dédié, `projects/generator-validation.json`, a permis de confirmer leurs rendus dans une seule page. Les noms techniques des sections, repérés pendant cette validation, ont été retirés du site généré.

La commande exécute maintenant un contrôle avant génération et refuse les versions, sections ou contenus non exportables avant d'écrire les fichiers. Le parcours manuel est dans `docs/testing/generator-preflight-validation.md` et reste à confirmer.

Le contrôle bloquant en ligne de commande a été confirmé. Le Builder propose maintenant **Exporter React** : après les mêmes contrôles de sections, il génère les fichiers, crée une archive ZIP nommée d'après le projet et la télécharge. Ce parcours a été confirmé dans le navigateur.

Le Starter généré contient maintenant ses propres configurations de build et de lint ainsi qu'un test de cohérence du contenu. Les commandes `npm run build`, `npm run lint` et `npm test` ont réussi sur le projet de validation. Le parcours manuel est dans `docs/testing/generated-quality-gates-validation.md` et reste à confirmer.

Ces portes qualité ont été confirmées. La commande `npm run export:verified -- <source.json> <sortie.zip>` exécute désormais la génération, `npm install`, le build, le lint et les tests dans un dossier temporaire. Elle écrit le ZIP seulement après leur réussite et nettoie toujours le dossier temporaire. Le parcours manuel est dans `docs/testing/verified-export-pipeline-validation.md` et reste à confirmer.

Le pipeline d'export vérifié a été confirmé. Le jalon 7 est validé.

## Milestone 8 — Core CMS

Créer:

-SQLite

-Auth

-Médias

-Produits

-SEO

Premier projet autonome.

Première tranche réalisée : le package `@buildotron/core-cms` sépare le contenu éditable de la structure du projet. Il peut extraire un document de contenu, modifier le contenu d'une section connue et le réappliquer sans changer l'ordre, les identifiants, les types, les slots ou les overrides. Il refuse les ajouts, suppressions, duplications, changements de type et contenus destinés à un autre projet. Cette règle est couverte par des tests automatisés ; l'intégration dans le projet exporté reste à réaliser.

Le contrat est maintenant intégré à chaque export. `src/structure.json` contient l'organisation immuable, tandis que `src/cms/content.json` contient uniquement le contenu éditable. Le site les réunit après avoir contrôlé l'identité du projet et de chaque section. Le build, le lint et le test autonome de cette structure séparée ont réussi. Le parcours manuel est dans `docs/testing/generated-cms-content-validation.md` et reste à confirmer.

La séparation structure/contenu a été confirmée. Chaque projet exporté embarque maintenant un stockage fondé sur `node:sqlite`. Il initialise le document CMS une seule fois, le sauvegarde dans `database/site.db` et conserve les modifications après fermeture et réouverture de la base. La base et ses fichiers temporaires sont ignorés par Git. Le parcours est dans `docs/testing/sqlite-content-store-validation.md` et reste à confirmer.

Le stockage SQLite a été confirmé. Le projet exporté contient maintenant un serveur HTTP local qui sert le build React et expose `GET /api/content` et `PUT /api/content`. Les écritures sont limitées à 1 Mo et passent par le verrouillage de l'identité et du nombre de sections avant SQLite. Le serveur écoute uniquement sur `127.0.0.1` tant que l'authentification n'est pas en place. Le parcours manuel est dans `docs/testing/cms-api-validation.md` et reste à confirmer.

L'API locale a été confirmée. L'écriture exige maintenant une session obtenue par `POST /api/auth/login`. Le secret vient uniquement de `CMS_PASSWORD`, doit contenir au moins 12 caractères et n'est jamais écrit dans le projet ou dans SQLite. Le cookie de session est `HttpOnly`, `SameSite=Strict`, limité au chemin `/api` et invalidé au redémarrage. Le parcours manuel est dans `docs/testing/cms-auth-validation.md` et reste à confirmer.

L'authentification des écritures a été confirmée. Le projet exporté fournit maintenant une première interface client sur `/admin`. Après connexion, elle permet de modifier les titres et textes des sections existantes et de les enregistrer dans SQLite. Le site public recharge ces contenus depuis l'API. L'interface ne permet ni ajout, ni suppression, ni réorganisation de section. Le parcours manuel est dans `docs/testing/cms-admin-validation.md` et reste à confirmer.

## Milestone 9 — BIOGRIND

Construire entièrement BIOGRIND.

Chaque manque enrichit Buildotron.
