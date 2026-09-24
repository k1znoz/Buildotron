# Validation du catalogue Produits

## Préparation

Régénérer et démarrer le projet de validation :

```powershell
npm run generate -- projects/generator-validation.json projects/generated/generator-validation
cd projects/generated/generator-validation
npm run build
$env:CMS_PASSWORD = "mot-de-passe-test-123"
npm start
```

Ouvrir `http://127.0.0.1:3000/admin` et se connecter.

## Parcours

1. Descendre jusqu'à **Produits**. Le formulaire **Nouveau produit** doit être visible.
2. Créer un produit nommé `Produit test`, avec une description, `1299` centimes, la devise `EUR`, une image vide et l'état non publié.
3. Vérifier que le produit apparaît dans la liste et que le message `Produit créé.` est affiché.
4. Modifier son nom et son prix, cliquer sur **Enregistrer le produit**, puis recharger `/admin`. Les nouvelles valeurs doivent être conservées.
5. Ouvrir `http://127.0.0.1:3000/api/products`, y compris depuis le navigateur connecté. Le produit non publié ne doit jamais apparaître sur cette route publique.
6. Cocher **Publié**, enregistrer le produit, puis recharger l'API publique. Le produit doit maintenant apparaître.
7. Essayer une devise différente de trois lettres majuscules ou un prix négatif. L'enregistrement doit être refusé.
8. Cliquer sur **Supprimer**, annuler la confirmation et vérifier que le produit reste présent. Recommencer et confirmer : le produit doit disparaître.
9. Redémarrer le serveur et vérifier que le produit supprimé ne réapparaît pas.

## Limite actuelle

Le catalogue est administrable et exposé par l'API, mais aucune section Product ne le rend encore dans la page publique.
