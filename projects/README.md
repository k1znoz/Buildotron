# Projets Builder

Les fichiers JSON de ce dossier sont des projets de conception Buildotron.

Dans le Builder, utilisez **Ouvrir JSON** pour charger un fichier. **Enregistrer JSON** déclenche un seul téléchargement. Choisissez ce dossier dans la fenêtre de téléchargement du navigateur, ou déplacez-y ensuite le fichier téléchargé. Vérifiez qu'il n'est pas vide avant de le rouvrir.

Les projets React générés localement sont placés dans `projects/generated/`. Ce dossier est ignoré par Git : les sources JSON restent les fichiers de conception suivis dans le dépôt.

Exemple :

```bash
npm run generate -- projects/product-landing.json projects/generated/product-landing
```
