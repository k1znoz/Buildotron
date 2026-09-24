# Validation rapide — export React depuis le Builder

1. Démarrer le Builder et ouvrir sa page principale `/`.
2. Avec Product Landing inchangé, cliquer sur **Exporter React**. Le panneau de contrôle doit indiquer qu'aucun problème n'est détecté et le navigateur doit télécharger `untitled.zip`.
3. Extraire l'archive. Elle doit contenir dix-neuf fichiers, dont `package.json`, `README.md`, `.gitignore`, `server/contentStore.mjs`, `server/index.mjs`, `src/structure.json`, `src/cms/content.json`, `src/cms/content.ts`, `src/App.tsx`, `src/sections.tsx` et les trois tests.
4. Dans le dossier extrait, exécuter `npm install`, puis `npm run build`. Le build doit réussir.
5. Revenir dans le Builder, ajouter une Gallery sans image, puis cliquer sur **Exporter React**.
6. L'export doit être refusé, le panneau doit signaler Gallery et aucun nouveau ZIP ne doit être téléchargé.
7. Ajouter une image valide et son texte alternatif, puis exporter à nouveau. Le ZIP doit être téléchargé.
8. Modifier le nom du projet en `Portfolio Démo`, exporter, puis vérifier que le fichier s'appelle `portfolio-demo.zip`.

Le ZIP est généré entièrement dans le navigateur. Il contient un projet React autonome et son JSON de contenu.
