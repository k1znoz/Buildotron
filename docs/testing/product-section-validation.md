# Validation de la section Product

1. Démarrer le Builder, ajouter une section **Product** et vérifier qu'elle apparaît dans le slot Content.
2. Modifier son titre et son texte dans l'Inspector, puis vérifier leur mise à jour sur le Canvas.
3. Vérifier que l'aperçu explique que les produits publiés du CMS apparaîtront à cet emplacement.
4. Enregistrer le projet, le rouvrir, puis vérifier que la section et ses textes sont conservés.
5. Exporter le projet React, installer ses dépendances et exécuter son build, son lint et ses tests.
6. Démarrer le projet autonome avec `CMS_PASSWORD`, ouvrir `/admin` et créer deux produits : un brouillon et un produit publié.
7. Ouvrir le site public généré sur `http://127.0.0.1:3000/` et vérifier que la section Product affiche uniquement le produit publié, avec son nom, sa description, son prix et son image éventuelle.
8. Publier le brouillon depuis `http://127.0.0.1:3000/admin`, actualiser `http://127.0.0.1:3000/` et vérifier qu'il apparaît.
9. Dépublier le premier produit, actualiser `http://127.0.0.1:3000/` et vérifier qu'il disparaît.
10. Dépublier tous les produits et vérifier le message « Aucun produit publié pour le moment. »

Le Canvas du Builder sur `http://localhost:5174/` affiche seulement l'emplacement de la section Product. Il ne se connecte pas à la base SQLite du projet exporté : le catalogue réel se vérifie sur le serveur autonome, au port 3000.

Pour tester le site généré avec Vite sur `http://localhost:5173/`, garder également `npm start` actif dans un second terminal. La configuration Vite transmet les requêtes `/api` au CMS sur `http://127.0.0.1:3000`.
