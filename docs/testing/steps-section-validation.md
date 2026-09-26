# Validation de la section Steps

1. Démarrer le Builder et ajouter **Steps** depuis la Library.
2. Vérifier que la section apparaît dans le slot Content avec trois étapes numérotées.
3. Modifier le titre, le texte et les trois étapes dans l'Inspector ; le Canvas doit se mettre à jour immédiatement.
4. Ajouter une étape, en supprimer une et vérifier que la numérotation reste continue.
5. Enregistrer le projet, le rouvrir et vérifier que l'ordre et les textes sont conservés.
6. Vider le titre ou le texte d'une étape et vérifier que le contrôle des sections bloque l'export.
7. Corriger l'étape, exporter le projet React puis exécuter son build, son lint et ses tests.
8. Sur le site généré, vérifier que les étapes sont rendues dans l'ordre sous forme de liste numérotée.
9. Dans `/admin`, modifier le titre, le texte et les étapes existantes, puis enregistrer.
10. Actualiser le site public et vérifier les modifications sans changement du nombre ni de l'ordre des étapes.
