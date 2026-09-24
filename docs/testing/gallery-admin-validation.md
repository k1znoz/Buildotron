# Validation rapide — formulaire de contenu Gallery

1. Démarrer le Builder avec npm run dev -w builder, puis ouvrir /admin-preview?section=gallery sur le port affiché par Vite. La page indique « Formulaire de contenu Gallery » et montre une image de test.
2. Modifier le titre et le texte de la section, ainsi que le texte alternatif de l'image. Cliquer sur **Appliquer à l'aperçu** : le rendu React doit suivre ces modifications.
3. Remplacer la source par /gallery-validation.svg et appliquer. L'image doit rester visible.
4. Vider le texte alternatif et tenter d'appliquer. Une erreur doit apparaître et le dernier aperçu appliqué doit rester affiché.
5. Corriger le texte alternatif, puis saisir javascript:alert(1) comme source. L'application doit être refusée.
6. Vider le titre ou le texte de la section. L'application doit aussi être refusée.
7. Corriger les champs et appliquer, puis passer à Features et revenir à Gallery. Le brouillon et le dernier aperçu appliqué doivent être conservés, y compris avec Précédent et Suivant du navigateur.
8. Vérifier que le formulaire permet de remplacer les images présentes sans ajouter ou supprimer d'emplacements.

Cette page garde les modifications uniquement en mémoire pendant la navigation. Un rechargement les efface ; la persistance du CMS viendra plus tard.
