# Plugin SDK

Le Plugin SDK doit permettre d'ajouter une section locale à Buildotron avec un dossier autonome et un minimum de raccords manuels.

## Structure officielle

```text
MonPlugin.plugin/
├── editor/       aperçu et champs propres au Builder
├── admin/        validation et formulaire du CMS
├── react/        rendu du site généré
├── manifest.json
├── schema.json
├── preview.svg
├── tests/
└── README.md
```

## Contrat actuel

Le manifeste fournit l'identité et le placement du plugin :

```json
{
  "id": "hero",
  "name": "Hero",
  "category": "Hero",
  "version": "1.0.0",
  "supports": ["react"],
  "defaultSlot": "hero",
  "defaults": {
    "title": "A clear starting point for your product.",
    "body": "A structural preview of the selected Blueprint."
  }
}
```

Le schéma décrit les propriétés éditables :

```json
{
  "fields": [
    { "name": "title", "label": "Titre", "type": "text", "required": true },
    { "name": "body", "label": "Texte", "type": "textarea", "required": true }
  ]
}
```

Les types communs sont exposés par `@buildotron/plugin-sdk`. Les champs reconnus actuellement sont `text`, `textarea`, `url` et `list`. L'Inspector génère directement les trois premiers ; les listes utilisent encore leurs éditeurs spécialisés.

Une liste structurée précise `itemLabel`, `addLabel`, `minItems`, `maxItems`, `itemFields` et `defaultItem`. Toutes les listes utilisent le même composant d'Inspector. Un sous-champ peut déclarer `asset: image` pour proposer la sélection d'un fichier JPEG, PNG, WebP ou GIF en plus de la saisie d'une URL.

L'Inspector transmet toutes les modifications de listes par les mêmes opérations génériques. Ajouter une nouvelle famille de liste ne demande donc plus de callback React supplémentaire dans l'application.

`defaults` contient une valeur initiale pour chaque champ du schéma, sans champ supplémentaire. Ces données sont utilisées par le Builder lorsqu'un développeur ajoute la section depuis la Library.

## Catalogue

```bash
npm run plugins:sync
npm run plugins:check
```

`plugins:sync` parcourt les dossiers `plugins/*.plugin`, valide les fichiers obligatoires et produit `plugins/src/generatedCatalog.ts`. La Library utilise ce catalogue pour afficher le nom, le slot et la vignette de chaque plugin. Le fichier généré ne doit pas être modifié à la main.

`plugins:check` vérifie que le catalogue versionné correspond aux dossiers présents. Cette commande est destinée aux tests locaux et à la CI.

## Parcours cible

```bash
npm run create:plugin -- Testimonials
```

Cette commande devra créer la structure complète, synchroniser le catalogue et ajouter un test de départ. Elle sera ajoutée après le raccordement du catalogue à la création des sections, à l'Inspector, au générateur et au CMS.

## Checklist d'un plugin

- manifeste valide ;
- schéma valide ;
- vignette SVG ;
- aperçu Builder ;
- rendu React autonome ;
- formulaire et validation CMS ;
- contrôles avant export ;
- tests du plugin et de son export.

## Capacités futures

Le manifeste pourra déclarer des métadonnées SEO :

```json
{
  "seo": {
    "headingLevel": "h1",
    "schema": "Product"
  }
}
```

Elles permettront au générateur de choisir les balises HTML, de produire le JSON-LD et d'alimenter le rapport SEO.
