# Validation du paquet projet Buildotron

1. Démarrer le Builder et ouvrir `projects/biogrind.json` avec **Ouvrir projet**.
2. Sélectionner Gallery, puis choisir une image locale JPEG, PNG, WebP ou GIF de moins de 5 Mo.
3. Vérifier que l'image apparaît immédiatement sur le Canvas et que sa source commence par `/assets/` dans l'Inspector.
4. Cliquer sur **Enregistrer projet**. Un fichier `biogrind.buildotron.zip` doit être téléchargé.
5. Ouvrir l'archive : elle doit contenir `project.json` et le fichier image dans `assets/`. Le JSON doit seulement référencer `/assets/...` et ne doit contenir aucune longue chaîne Base64.
6. Actualiser le Builder, cliquer sur **Ouvrir projet** et sélectionner le ZIP. Le projet et l'image doivent réapparaître.
7. Cliquer sur **Exporter React**, extraire le ZIP obtenu et vérifier que l'image existe sous `public/assets/`.
8. Installer puis construire le projet React. L'image doit apparaître dans la Gallery du site généré.
9. Vérifier qu'un ancien fichier `.json` sans média local reste ouvrable.
