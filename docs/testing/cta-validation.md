# Validation rapide — CTA

1. Ouvrir `projects/product-landing.json` dans le Builder, puis sélectionner CTA.
2. Modifier **Libellé du bouton** et saisir `#contact` dans **Lien du bouton**. L'aperçu doit montrer un lien actif ; cliquer dessus ne doit pas quitter le Builder.
3. Enregistrer le JSON dans `projects/`, actualiser la page et rouvrir le fichier. Le libellé et le lien doivent être conservés.
4. Remplacer le lien par `javascript:alert(1)` puis tenter d'enregistrer. La sauvegarde doit être refusée avec un message sur le lien du CTA.
5. Vider le lien : l'aperçu doit redevenir un bouton désactivé et la sauvegarde doit fonctionner.

Les projets JSON créés avant l'ajout du lien CTA restent ouvrables ; le Builder leur attribue un libellé par défaut et un lien vide.
