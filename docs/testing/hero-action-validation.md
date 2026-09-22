# Validation rapide — action Hero

1. Ouvrir `projects/product-landing.json` dans le Builder et sélectionner Hero. Aucun bouton d'action ne doit s'afficher tant que son lien est vide.
2. Saisir `Découvrir` comme libellé et `/details` comme lien. Le bouton doit apparaître dans le Canvas.
3. Cliquer sur le bouton dans le Canvas : le Builder ne doit pas quitter la page. Vérifier aussi son accès au clavier.
4. Enregistrer le JSON, le rouvrir et vérifier que le libellé et le lien sont conservés.
5. Remplacer le lien par `javascript:alert(1)` ou vider le libellé tout en gardant le lien : la sauvegarde doit être refusée.

Les anciens projets JSON sans action Hero restent ouvrables. Le lien peut être une URL `http(s)`, un chemin commençant par `/` ou une ancre `#...`.
