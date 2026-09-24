# Validation rapide — sélection des Blueprints

1. Démarrer le Builder avec `npm run dev -w builder`, puis ouvrir l'URL racine indiquée par Vite (généralement `http://localhost:5173/`). Ne pas rester sur `/admin-preview`, qui sert uniquement à tester les formulaires CMS des plugins. Dans la colonne de droite, la zone **Inspector → Page** affiche le champ **Blueprint** réglé sur **Product Landing**. Le Canvas contient Hero, Features et CTA.
2. Dans le champ Blueprint, choisir **Coming Soon**. Le Canvas doit être remplacé par Hero, CTA et Footer, et ces sections doivent apparaître dans leurs slots par défaut.
3. Vérifier que le nom du projet et son identifiant sont conservés. La barre supérieure et le Canvas doivent afficher « Coming Soon ».
4. Choisir **Portfolio**. Le Canvas doit contenir Navbar, Hero, Gallery et Footer. La barre supérieure et le Canvas doivent afficher « Portfolio ».
5. Modifier un contenu, puis revenir à **Product Landing**. Le Canvas doit être réinitialisé avec Hero, Features et CTA. L'avertissement de l'Inspector précise qu'un changement de Blueprint remplace les sections.
6. Enregistrer le projet Portfolio en JSON, le rouvrir, puis vérifier que le Blueprint et sa structure sont conservés.
7. Dans le JSON téléchargé, remplacer la valeur de blueprint par unknown et tenter de l'ouvrir. Le Builder doit refuser le fichier sans remplacer le projet courant.
8. Lancer **Contrôler les sections** sur chaque Blueprint. Les contenus encore à renseigner doivent être signalés selon les plugins présents.

Le changement de Blueprint réinitialise les sections en mémoire. Enregistrer le projet avant de changer de modèle si son contenu doit être conservé.
