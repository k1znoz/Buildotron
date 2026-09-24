# Validation rapide — pipeline d'export vérifié

1. Depuis la racine de Buildotron, supprimer un éventuel ancien fichier `exports/generator-validation.zip`.
2. Exécuter `npm run export:verified -- projects/generator-validation.json exports/generator-validation.zip`.
3. Vérifier que la commande exécute successivement l'installation, le build, le lint et le test du projet généré.
4. La dernière ligne doit annoncer `Verified export created` et le fichier `exports/generator-validation.zip` doit exister.
5. Extraire ce ZIP et vérifier qu'il contient les douze fichiers du projet React, sans `node_modules` ni `dist`.
6. Copier `projects/generator-validation.json` vers `projects/generator-invalid.json`, remplacer le lien CTA `#contact` par `data:text/html,test`, puis lancer `npm run export:verified -- projects/generator-invalid.json exports/generator-invalid.zip`.
7. La commande doit échouer avant l'installation et `exports/generator-invalid.zip` ne doit pas être créé.
8. Supprimer `projects/generator-invalid.json` après le test.

L'archive téléchargée directement par le Builder reste l'export rapide côté navigateur. Cette commande locale est l'export vérifié qui applique tout le pipeline imposé par l'architecture.
