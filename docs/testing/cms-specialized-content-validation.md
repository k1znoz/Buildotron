# Validation des contenus spécialisés du CMS

## Préparation

Depuis la racine du dépôt :

```powershell
npm run generate -- projects/generator-validation.json projects/generated/generator-validation
cd projects/generated/generator-validation
npm run build
$env:CMS_PASSWORD = "mot-de-passe-test-123"
npm start
```

Ouvrir `http://127.0.0.1:3000/admin` et se connecter avec `mot-de-passe-test-123`.

## Parcours

1. Vérifier la présence des champs spécialisés : lien Navbar, action Hero, deux cartes Features, image Gallery, question FAQ, action CTA et lien Footer.
2. Modifier au moins une valeur dans chaque section, enregistrer, puis ouvrir **Voir le site**. Toutes les nouvelles valeurs doivent apparaître.
3. Revenir sur `/admin`. Les valeurs enregistrées doivent être rechargées.
4. Saisir `data:text/html,test` dans un lien ou une source d'image. L'enregistrement doit être refusé avec un message explicite.
5. Vider un titre de carte, un texte alternatif, une réponse ou un libellé de lien. L'enregistrement doit être refusé.
6. Restaurer des valeurs valides et enregistrer. Le message `Contenu enregistré.` doit apparaître.
7. Vérifier qu'il n'existe aucun bouton pour ajouter ou supprimer une carte, une image, une question ou un lien.
8. Redémarrer le serveur et vérifier que les modifications sont encore visibles sur le site public.

## Résultat attendu

Le client peut modifier tous les contenus fournis par les sept sections, tandis que le nombre d'éléments et la structure restent définis par le Builder.
