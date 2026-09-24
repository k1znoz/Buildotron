# Validation rapide — qualité du projet généré

1. Depuis le Builder, exporter un projet valide et extraire son ZIP dans un nouveau dossier.
2. Dans ce dossier, exécuter `npm install`.
3. Exécuter `npm run build`. TypeScript et Vite doivent terminer sans erreur.
4. Exécuter `npm run lint`. ESLint doit terminer sans erreur.
5. Exécuter `npm test`. Le test « generated content contains only supported sections » doit réussir.
6. Ouvrir le README du projet extrait et vérifier que les commandes de démarrage, build, lint et test y sont indiquées.
7. Modifier temporairement un type dans `src/content.json`, par exemple `Hero` en `Unknown`, puis relancer `npm test`. Le test doit échouer.
8. Restaurer `Hero` et relancer `npm test`. Le test doit réussir.

Ces commandes s'exécutent dans le projet extrait, sans utiliser les scripts ou les sources de Buildotron.
