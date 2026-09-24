# Validation rapide — formulaire de contenu CTA

1. Démarrer le Builder avec npm run dev -w builder, puis ouvrir /admin-preview?section=cta sur le port affiché par Vite. La page indique « Formulaire de contenu CTA ».
2. Modifier le titre, le texte, le libellé et le lien, puis cliquer sur **Appliquer à l'aperçu**. Le rendu CTA à droite doit suivre les modifications.
3. Activer le lien du CTA dans l'aperçu à la souris puis au clavier : la page de test doit rester ouverte.
4. Vider le lien du bouton et tenter d'appliquer. Une erreur doit demander le lien ; l'aperçu garde le dernier contenu appliqué.
5. Renseigner /contact comme lien puis vider le libellé. L'application doit être refusée.
6. Renseigner un libellé puis saisir javascript:alert(1) comme lien. L'application doit être refusée.
7. Vider le titre ou le texte. L'application doit être refusée.
8. Ouvrir l'aperçu Hero avec le lien **Hero**. Le formulaire Hero doit garder son action facultative : lien et libellé vides peuvent y être appliqués.
9. Revenir à CTA avec le lien **CTA**. Le titre et le texte saisis ainsi que le dernier aperçu appliqué doivent être conservés. Faire aussi un aller-retour avec les boutons Précédent et Suivant du navigateur.

Cette page teste les formulaires en mémoire pendant la navigation entre Hero et CTA. Un rechargement de la page efface ces modifications. Elle ne sauvegarde pas de projet et ne constitue pas encore le CMS exporté.
