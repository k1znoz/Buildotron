# Buildotron — Vision

> Chaque heure investie dans un composant doit rendre les prochains sites plus rapides à produire.

## Pourquoi Buildotron existe

Buildotron est né d'un constat simple : créer un site web professionnel implique souvent de reconstruire les mêmes fondations à chaque projet.

Même lorsqu'une bibliothèque de composants existe, il faut encore :

* recréer la structure du projet,
* configurer l'architecture,
* mettre en place un CMS,
* organiser les dossiers,
* préparer le déploiement.

L'objectif de Buildotron est d'éliminer ce travail répétitif sans sacrifier la qualité du code généré.

## Notre philosophie

Buildotron n'est pas un constructeur de sites destiné aux clients.

C'est un outil destiné aux développeurs.

Le Builder permet de concevoir rapidement un site grâce à des composants réutilisables, puis génère un véritable projet React autonome.

Une fois exporté, ce projet devient un projet classique.

Il peut être modifié librement dans VS Code et ne revient jamais dans le Builder.

## Deux outils, deux responsabilités

### Builder (Développeur)

Le Builder sert à concevoir la structure.

Il permet :

* de choisir un Blueprint,
* d'ajouter des sections,
* de réorganiser la page,
* de configurer le thème.

### CMS (Client)

Le CMS sert uniquement à gérer le contenu.

Le client peut :

* modifier les textes,
* changer les images,
* gérer les produits,
* modifier le SEO.

Le client ne peut jamais modifier l'organisation des pages.

Cette séparation est volontaire.

Elle évite de transformer le CMS en un second Builder.

## Le cœur du projet

Le véritable actif de Buildotron n'est pas le Builder lui-même.

C'est l'écosystème qu'il construit.

Blueprints → Sections → Primitives.

Chaque nouveau composant enrichit la bibliothèque et accélère les futurs projets.

## Les règles qui ne changent pas

* Le Builder est réservé aux développeurs.
* Les projets exportés sont définitifs.
* Le JSON Canonique reste la seule source de vérité.
* Les composants sont Headless.
* Les Blueprints définissent la structure.
* Les Primitives composent les Sections.
* Aucun export sans validation complète.
* Tout projet généré par Buildotron doit être "Quality by Default" : SEO, accessibilité et confidentialité sont intégrés dès la conception, pas ajoutés après coup.


## Le premier objectif

Le premier succès de Buildotron n'est pas de devenir un produit commercial.

Le premier succès est de construire entièrement le site BIOGRIND sans écrire deux fois la même fondation.

Si BIOGRIND révèle un manque, c'est Buildotron qui doit être enrichi — jamais l'inverse.
