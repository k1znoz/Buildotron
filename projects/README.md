# Projets Builder

Les paquets `.buildotron.zip` sont les projets de conception complets. Ils contiennent `project.json` et les médias locaux dans `assets/`. Les fichiers JSON présents dans ce dossier restent utiles pour l'inspection, les tests et les commandes sans média.

Dans le Builder, utilisez **Ouvrir projet** pour charger un JSON historique ou un paquet ZIP. **Enregistrer projet** télécharge le paquet complet. Déplacez ensuite le fichier téléchargé dans ce dossier et vérifiez qu'il n'est pas vide avant de le rouvrir.

Les projets React générés localement sont placés dans `projects/generated/`. Ce dossier est ignoré par Git : les paquets Builder restent les sources de conception conservées dans le dépôt.

Exemple :

```bash
npm run generate -- projects/product-landing.json projects/generated/product-landing
```
