# Validation rapide — formulaire de contenu Features

1. Démarrer le Builder avec npm run dev -w builder, puis ouvrir /admin-preview?section=features sur le port affiché par Vite. La page indique « Formulaire de contenu Features ».
2. Modifier le titre et le texte de la section, ainsi que le titre et le texte de la première carte. Cliquer sur **Appliquer à l'aperçu** : le rendu React doit suivre ces quatre modifications.
3. Vider le texte d'une carte et tenter d'appliquer. Une erreur doit apparaître ; l'aperçu garde le dernier contenu appliqué.
4. Corriger le texte, puis vider le titre de la section. L'application doit encore être refusée.
5. Renseigner tous les champs et appliquer. L'erreur disparaît et l'aperçu se met à jour.
6. Passer à CTA, puis revenir à Features. Le brouillon et le dernier aperçu appliqué doivent être conservés. Faire aussi un aller-retour avec Précédent et Suivant du navigateur.
7. Vérifier que le formulaire permet d'éditer les cartes présentes sans ajouter, supprimer ou déplacer les sections de la page.

Cette page garde les modifications uniquement en mémoire pendant la navigation. Un rechargement efface ces modifications ; la persistance du CMS viendra plus tard.
