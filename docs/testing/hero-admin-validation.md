# Validation rapide — formulaire de contenu Hero

1. Démarrer le Builder avec la commande npm run dev -w builder, puis ouvrir /admin-preview dans le navigateur sur le même port. Le titre « Formulaire de contenu Hero » apparaît.
2. Modifier le titre et le texte, puis cliquer sur **Appliquer à l'aperçu**. Le rendu React à droite doit afficher le nouveau contenu.
3. Renseigner /details comme lien et « En savoir plus » comme libellé du bouton, puis appliquer. Le bouton doit apparaître dans l'aperçu sans quitter la page lorsqu'on l'active.
4. Vider le titre et tenter d'appliquer. Le formulaire doit afficher une erreur et l'aperçu doit garder le dernier contenu appliqué.
5. Remettre un titre, puis saisir javascript:alert(1) comme lien. L'application doit être refusée.
6. Renseigner /details comme lien et vider le libellé. L'application doit être refusée.
7. Vider le lien et le libellé, puis appliquer. L'action facultative disparaît de l'aperçu.
8. Cliquer sur **Retour au Builder**. Le canvas habituel doit réapparaître.

Cette page teste le composant du futur CMS en mémoire. Elle ne sauvegarde pas encore les modifications dans un projet exporté.
