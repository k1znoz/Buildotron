# Validation rapide — contenu CMS séparé

1. Générer `projects/generator-validation.json`, puis ouvrir `projects/generated/generator-validation`.
2. Vérifier que `src/structure.json` contient l'ordre, les identifiants, les types, les slots et les overrides, sans propriété `properties`.
3. Vérifier que `src/cms/content.json` contient les mêmes identifiants et types avec les textes, listes, liens et images, sans slot ni override.
4. Dans `src/cms/content.json`, remplacer le titre du Hero par `Titre modifié par le CMS`, puis démarrer le site avec `npm run dev`. Le nouveau titre doit apparaître sans changement de structure.
5. Remplacer temporairement le `sectionType` de ce Hero par `Footer`, puis recharger la page. Le site doit refuser cette incohérence et afficher une erreur dans la console.
6. Restaurer `sectionType` à `Hero`, puis exécuter `npm run build`, `npm run lint` et `npm test`. Les trois commandes doivent réussir.

Cette tranche sépare les données ensuite stockées dans SQLite. Elle ne fournit pas encore l'interface CMS.
