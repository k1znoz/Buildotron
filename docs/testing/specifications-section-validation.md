# Validation de la section Specifications

1. Démarrer le Builder et ajouter **Specifications** depuis la Library.
2. Vérifier son placement dans Content et l'affichage des trois caractéristiques initiales.
3. Modifier le titre, le texte, les libellés et les valeurs dans l'Inspector ; le Canvas doit se mettre à jour immédiatement.
4. Ajouter puis retirer une caractéristique. La dernière caractéristique ne doit pas pouvoir être supprimée.
5. Enregistrer et rouvrir le projet, puis vérifier la conservation de l'ordre et des valeurs.
6. Vider un libellé ou une valeur et vérifier que le contrôle des sections bloque l'export.
7. Corriger le contenu, exporter le projet React, puis exécuter son build, son lint et ses tests.
8. Vérifier sur le site généré que les caractéristiques utilisent une liste descriptive avec les couples libellé/valeur.
9. Dans `/admin`, modifier les caractéristiques existantes et enregistrer.
10. Actualiser le site public et vérifier les changements sans modification du nombre ou de l'ordre des lignes.
11. Vérifier que toutes les sections Content, dont Steps et Specifications, apparaissent avant CTA puis Footer, même lorsqu'elles ont été ajoutées après Footer dans le Builder.
