# Validation rapide — Gallery

1. Démarrer le Builder, ouvrir `projects/product-landing.json`, puis ajouter Gallery depuis la Library.
2. Sélectionner Gallery : l'aperçu invite à ajouter une image. Cliquer sur **Ajouter une image**.
3. Saisir `/gallery-validation.svg` dans **URL ou chemin** et `Motif de validation` dans **Texte alternatif**. L'image doit apparaître dans le Canvas.
4. Ajouter une seconde image, puis la retirer. Vérifier que le nombre d'images affichées suit la liste.
5. Dupliquer Gallery, modifier le texte alternatif dans la copie et vérifier que l'original garde son texte.
6. Enregistrer le projet JSON, le rouvrir et vérifier que l'image et son texte alternatif sont conservés.
7. Remplacer l'URL par `javascript:alert(1)` ou vider le texte alternatif : la sauvegarde doit être refusée. Rétablir une URL sûre et un texte alternatif non vide avant d'enregistrer.

Les anciens projets restent ouvrables ; leurs sections Gallery ont une liste d'images vide. Les URLs `http(s)` et les chemins commençant par `/` sont acceptés. Un chemin local doit pointer vers un fichier disponible dans le dossier public de l'application.
