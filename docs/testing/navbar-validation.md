# Validation rapide — Navbar

1. Démarrer le Builder et ouvrir le projet d'exemple, puis ajouter Navbar depuis la Library. La section apparaît dans le slot Header avec un aperçu de navigation.
2. Dans l'Inspector, changer le titre et le texte. Le Canvas doit suivre immédiatement.
3. Ajouter deux liens : Accueil vers / et Contact vers #contact. Les deux liens apparaissent dans l'aperçu.
4. Cliquer sur ces liens et les activer au clavier : le Builder doit rester sur la même page.
5. Lancer **Contrôler les sections**. Une Navbar sans lien doit être signalée ; après ajout du premier lien, son message disparaît.
6. Dupliquer Navbar, modifier un lien dans la copie et vérifier que l'original reste inchangé.
7. Enregistrer le JSON, le rouvrir et vérifier que les liens et le placement sont conservés.
8. Remplacer une URL par javascript:alert(1) ou vider un libellé : la sauvegarde doit être refusée.

Les anciens projets JSON contenant une Navbar sans liste de liens restent ouvrables avec une liste vide.
