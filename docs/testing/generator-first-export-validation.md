# Validation rapide — premier export React

1. Depuis la racine du dépôt, exécuter `npm run generate -- projects/product-landing.json projects/generated/product-landing`.
2. Vérifier que la commande annonce dix-neuf fichiers générés et ouvrir `projects/generated/product-landing`.
3. Vérifier la présence de `package.json`, `README.md`, `index.html`, `tsconfig.json`, `vite.config.ts` et du dossier `src`.
4. Dans le dossier généré, exécuter `npm install`, puis `npm run build`. Le build doit réussir.
5. Toujours dans ce dossier, exécuter `npm run dev`, ouvrir l'adresse indiquée par Vite et vérifier que le Hero, Features et CTA du JSON apparaissent dans leur ordre.
6. Vérifier que le projet généré peut démarrer sans dépendre des sources du Builder.

Cette première tranche utilise le JSON enregistré dans `projects/`. L'export depuis l'interface, le rendu complet des sept plugins, les contrôles automatiques et la création du ZIP seront ajoutés dans les tranches suivantes du jalon 7.

Le démarrage autonome a été confirmé en copiant le projet hors du dépôt Buildotron, puis en y exécutant une nouvelle installation et le serveur Vite.
