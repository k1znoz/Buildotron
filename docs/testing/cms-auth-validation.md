# Validation rapide — authentification du CMS

1. Dans le projet généré, définir `$env:CMS_PASSWORD = "mot-de-passe-test-123"`, puis exécuter `npm start`.
2. Dans un second terminal, charger le contenu avec `$content = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/content"`.
3. Tenter un PUT sans session. PowerShell doit signaler une réponse 401 avec « Authentification requise ».
4. Ouvrir une session avec :

```powershell
$body = @{ password = "mot-de-passe-test-123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/auth/login" -Method Post -ContentType "application/json" -Body $body -SessionVariable cmsSession
```

5. Modifier `$content.sections[0].content.title`, puis enregistrer avec :

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/content" -Method Put -ContentType "application/json" -WebSession $cmsSession -Body ($content | ConvertTo-Json -Depth 20)
```

6. Le PUT doit réussir. Un nouveau GET doit retrouver le titre modifié.
7. Arrêter puis relancer le serveur et réutiliser `$cmsSession` pour un PUT. L'ancienne session doit être refusée avec une réponse 401.
8. Redémarrer sans définir `CMS_PASSWORD`, ou avec moins de 12 caractères. Le serveur doit refuser de démarrer avec une explication.

Cette authentification protège uniquement l'API locale actuelle. Une politique de déploiement, le renouvellement du secret et la limitation des tentatives seront définis avant l'exposition réseau.
