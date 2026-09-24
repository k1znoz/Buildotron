# Validation rapide — API locale du CMS

1. Régénérer le projet, puis aller dans `projects/generated/generator-validation`.
2. Exécuter `npm install`, `npm run build`, puis définir `$env:CMS_PASSWORD = "mot-de-passe-test-123"` avant `npm start`.
3. Le terminal doit annoncer `Site et CMS disponibles sur http://127.0.0.1:3000` et créer `database/site.db`.
4. Ouvrir `http://127.0.0.1:3000` et vérifier que le site React s'affiche.
5. Dans un second terminal PowerShell, exécuter `$content = Invoke-RestMethod http://127.0.0.1:3000/api/content`. Vérifier que `$content.sections.Count` correspond au nombre de sections du site.
6. Exécuter `$content.sections[0].content.title = 'Titre sauvegardé par API'`, puis `Invoke-RestMethod http://127.0.0.1:3000/api/content -Method Put -ContentType 'application/json' -Body ($content | ConvertTo-Json -Depth 20)`.
7. Relancer la commande GET et vérifier que le titre vaut `Titre sauvegardé par API`.
8. Arrêter puis relancer `npm start`, refaire le GET et vérifier que le titre est toujours conservé.
9. Supprimer temporairement une entrée de `$content.sections`, envoyer le document par PUT et vérifier que le serveur répond avec une erreur 400.

Le serveur est volontairement limité à la machine locale. L'interface d'administration et l'authentification ne sont pas encore présentes.
