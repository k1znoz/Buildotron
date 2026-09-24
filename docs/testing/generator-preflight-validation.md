# Validation rapide — contrôle avant génération

1. Régénérer le projet de démonstration avec `npm run generate -- projects/generator-validation.json projects/generated/generator-validation`, puis lancer son serveur. Les noms techniques Navbar, Hero, Features, Gallery, FAQ, CTA et Footer ne doivent plus apparaître au-dessus des contenus.
2. Copier `projects/generator-validation.json` vers `projects/generator-invalid.json`.
3. Dans la copie, remplacer le lien du CTA `#contact` par `data:text/html,test`.
4. Exécuter `npm run generate -- projects/generator-invalid.json projects/generated/generator-invalid`.
5. La commande doit échouer avec « Export refusé » et « action CTA valide requise ».
6. Vérifier que `projects/generated/generator-invalid` n'a pas été créé.
7. Supprimer `projects/generator-invalid.json` après le test.

Le contrôle s'exécute avant toute écriture. Il couvre la version du format, l'identité du projet, la présence de sections, les sept types pris en charge et leurs contenus indispensables.
