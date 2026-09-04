# Privacy System (RGPD)

## Objectif

Buildotron doit fournir une base RGPD saine par défaut.

La conformité finale dépendra toujours des services intégrés au site (paiement, analytics, formulaires, etc.), mais aucun projet généré ne doit partir avec des pratiques non conformes activées par défaut.

---

## Principe

Le respect de la vie privée est une fonctionnalité native du Core CMS.

Tous les projets exportés héritent automatiquement d'une base commune.

---

## Architecture

packages/core-cms/

privacy/

cookie-banner/
consent/
policy/

Chaque sous-module possède une responsabilité unique.

### cookie-banner

Responsable de l'affichage du bandeau cookies.

Fonctions prévues :

* première visite ;
* personnalisation ;
* refus ;
* acceptation ;
* réouverture des préférences.

### consent

Responsable de la gestion des consentements.

Catégories prévues :

* nécessaires ;
* statistiques ;
* marketing ;
* préférences.

Les consentements sont enregistrés localement.

### policy

Responsable des documents juridiques générés.

Contenu prévu :

* Politique de confidentialité.
* Politique cookies.
* Mentions légales (template).
* Contact RGPD (placeholder).

---

## Comportement par défaut

À l'export :

| Élément             | État                                            |
| ------------------- | ----------------------------------------------- |
| Analytics           | Désactivé                                       |
| Marketing           | Désactivé                                       |
| Cookies nécessaires | Activés                                         |
| Consentement        | Requis avant activation des services optionnels |

Le développeur doit activer explicitement les services supplémentaires.

---

## CMS

Le client peut modifier :

* les informations légales ;
* le responsable du traitement ;
* le contact RGPD ;
* certains textes des politiques.

Le client ne peut pas désactiver les mécanismes de consentement.

---

## Vision long terme

À terme, le module Privacy devra permettre :

* plusieurs services Analytics ;
* plusieurs plateformes marketing ;
* gestion des consentements par catégorie ;
* export des préférences utilisateur ;
* suppression des données conformément aux demandes RGPD.
