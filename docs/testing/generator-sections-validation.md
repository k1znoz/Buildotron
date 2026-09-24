# Validation rapide — sections du projet généré

1. Depuis la racine du dépôt, exécuter `npm run generate -- projects/generator-validation.json projects/generated/generator-validation`.
2. Aller dans `projects/generated/generator-validation`, puis exécuter `npm install` et `npm run dev`.
3. Ouvrir l'adresse indiquée par Vite. La page doit afficher, dans cet ordre : Navbar, Hero, Features, Gallery, FAQ, CTA et Footer.
4. Vérifier que Features affiche deux cartes : Design et Development.
5. Vérifier que Gallery affiche une image avec le texte alternatif « Abstract project placeholder » si l'image distante ne charge pas.
6. Ouvrir la question de FAQ et vérifier que sa réponse apparaît.
7. Vérifier la présence des liens Work, See the work, Contact et Legal.
8. Exécuter `npm run build`. Le build doit réussir.

Le projet généré contient son propre registre dans `src/sections.tsx` et ne charge aucun composant depuis le Builder.
