# Validation rapide — formulaire de contenu FAQ

1. Démarrer le Builder avec npm run dev -w builder, puis ouvrir /admin-preview?section=faq sur le port affiché par Vite. La page indique « Formulaire de contenu FAQ ».
2. Modifier le titre et le texte de la section, puis une question et sa réponse. Cliquer sur **Appliquer à l'aperçu** : le rendu React doit suivre les modifications.
3. Ouvrir la question dans l'aperçu à la souris puis au clavier. La réponse mise à jour doit apparaître.
4. Vider une réponse et tenter d'appliquer. Une erreur doit apparaître ; le dernier aperçu appliqué doit rester affiché.
5. Corriger la réponse, puis vider une question. L'application doit encore être refusée.
6. Corriger les champs et appliquer, puis passer à Gallery et revenir à FAQ. Le brouillon et le dernier aperçu appliqué doivent être conservés, y compris avec Précédent et Suivant du navigateur.
7. Vérifier que le formulaire édite les questions présentes sans ajouter ou supprimer de blocs.

Cette page garde les modifications uniquement en mémoire pendant la navigation. Un rechargement les efface ; la persistance du CMS viendra plus tard.
