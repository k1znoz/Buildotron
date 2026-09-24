# Validation rapide — stockage SQLite du CMS

1. Régénérer le projet avec `npm run generate -- projects/generator-validation.json projects/generated/generator-validation`.
2. Dans `projects/generated/generator-validation`, exécuter `npm install`, puis `npm test`.
3. Deux tests doivent réussir, dont « SQLite persists CMS content after closing and reopening the database ».
4. L'avertissement indiquant que SQLite est expérimental dans Node.js 24 est attendu à ce stade.
5. Vérifier la présence de `server/contentStore.mjs` et des règles `database/*.db` et `database/*.db-*` dans le `.gitignore` généré.
6. Vérifier dans `tests/content-store.test.mjs` que le test ferme la première connexion, rouvre le même fichier et retrouve le titre « Persisted title ».

Le test utilise un dossier temporaire puis le supprime. La base permanente `database/site.db` sera créée par le serveur CMS dans la tranche suivante.
