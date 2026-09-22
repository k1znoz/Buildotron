# Validation rapide — Footer

1. Ouvrir `projects/product-landing.json` dans le Builder, puis ajouter Footer depuis la Library.
2. Sélectionner Footer et ajouter un lien. Saisir `Mentions légales` comme libellé et `/legal` comme chemin. Le lien doit apparaître dans le Canvas.
3. Cliquer sur ce lien dans le Canvas : le Builder ne doit pas quitter la page. Le lien doit rester accessible au clavier.
4. Ajouter un deuxième lien vers `#contact`, puis le retirer. Le Canvas doit suivre la liste.
5. Dupliquer Footer, modifier le libellé dans la copie et vérifier que l'original reste inchangé.
6. Enregistrer le JSON, le rouvrir et vérifier que les liens sont conservés.
7. Vider le libellé ou remplacer l'URL par `javascript:alert(1)` : la sauvegarde doit être refusée.

Les anciens projets JSON contenant un Footer sans liste de liens restent ouvrables avec une liste vide.
