# Validation rapide — contrôle des sections

1. Démarrer le Builder, puis ouvrir le projet d'exemple avec **Ouvrir JSON**.
2. Cliquer sur **Contrôler les sections**. Un panneau apparaît sous le canvas et signale que la section CTA n'a pas de lien de bouton.
3. Sélectionner CTA et renseigner son lien avec /contact. Le message doit disparaître immédiatement et le panneau doit indiquer « Aucun problème de section détecté ». Cette indication concerne les sections ; le générateur et le CMS restent à réaliser.
4. Ajouter Gallery depuis la Library. Le panneau doit demander au moins une image. Ajouter une image, avec /gallery-validation.svg comme source et Motif comme texte alternatif : ce message doit disparaître.
5. Ajouter Navbar. Le panneau doit demander au moins un lien de navigation. Ajouter un lien valide : le message doit disparaître.
6. Ajouter Footer. Le panneau doit demander entre 1 et 12 liens. Ajouter un lien avec un libellé et une destination valide : le message doit disparaître.
7. Ajouter FAQ. Sa question par défaut est complète et ne doit produire aucune erreur. Vider sa réponse : le panneau doit reprendre l'erreur de validation du projet JSON.
8. Effacer le titre d'une section. Le panneau doit reprendre l'erreur de validation du projet JSON. Renseigner de nouveau le titre : le contrôle doit revenir à son état précédent.
9. Vérifier que **Export React** reste désactivé.

Le contrôle se met à jour pendant l'édition après son ouverture. Il utilise les mêmes validateurs de contenu que les formulaires CMS des sept plugins. Il ne produit pas encore de projet exporté.
