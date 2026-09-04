# GitHub Copilot Instructions

Tu travailles sur Buildotron.

## Principes

* Le Builder est un outil de conception.
* Les projets exportés sont définitifs.
* Le JSON Canonique est la seule source de vérité.
* Les Blueprints définissent la structure.
* Les Sections composent les pages.
* Les Primitives composent les Sections.
* Les composants sont Headless.
* Le CMS ne modifie jamais la structure.
* Toujours partir d'un Starter.
* Aucun code libre généré.
* Toute nouvelle fonctionnalité doit préserver la réutilisabilité du système.

## Méthode de travail

Toujours travailler par sprint.

Ne jamais implémenter plusieurs fonctionnalités majeures en une seule fois.

Pour chaque demande :

1. Identifier les fichiers concernés.
2. Respecter l'architecture existante.
3. Éviter toute dépendance non validée.
4. Préférer plusieurs petits commits cohérents.