# Validation rapide — formulaire de contenu Footer

1. Démarrer le Builder avec npm run dev -w builder, puis ouvrir /admin-preview?section=footer sur le port affiché par Vite. La page indique « Formulaire de contenu Footer ».
2. Modifier le titre et le texte de la section, puis le libellé et l'adresse d'un lien. Cliquer sur **Appliquer à l'aperçu** : le rendu React doit suivre les modifications.
3. Activer chaque lien de l'aperçu à la souris puis au clavier. La page de test doit rester ouverte.
4. Vider le libellé d'un lien. Une erreur doit apparaître immédiatement, le champ doit être marqué invalide et le bouton d'application doit être désactivé. Le dernier aperçu appliqué reste affiché.
5. Corriger le libellé, puis saisir javascript:alert(1) comme adresse. La destination doit être signalée immédiatement et le bouton doit rester désactivé.
6. Vérifier qu'un chemin comme /legal et une ancre comme #contact sont acceptés.
7. Passer à FAQ puis revenir à Footer. Le brouillon et le dernier aperçu appliqué doivent être conservés, y compris avec Précédent et Suivant du navigateur.
8. Vérifier que le formulaire édite les liens présents sans ajouter ou supprimer d'éléments.

Cette page garde les modifications uniquement en mémoire pendant la navigation. Un rechargement les efface ; la persistance du CMS viendra plus tard.
