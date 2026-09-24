# Validation des médias du CMS

## Préparation

Depuis la racine du dépôt :

```powershell
npm run generate -- projects/generator-validation.json projects/generated/generator-validation
cd projects/generated/generator-validation
npm run build
$env:CMS_PASSWORD = "mot-de-passe-test-123"
npm start
```

Préparer une petite image JPEG, PNG, WebP ou GIF de moins de 5 Mo.

## Parcours

1. Ouvrir `http://127.0.0.1:3000/admin` et se connecter avec `mot-de-passe-test-123`.
2. Dans la section Gallery, utiliser **Remplacer par un fichier** et sélectionner l'image préparée.
3. Vérifier que le message `Image envoyée. Enregistrez le contenu pour confirmer son utilisation.` apparaît et que **Source** contient désormais un chemin `/media/...`.
4. Modifier si nécessaire le texte alternatif, puis cliquer sur **Enregistrer**.
5. Cliquer sur **Voir le site**. La nouvelle image doit apparaître dans Gallery.
6. Vérifier qu'un fichier portant le même nom se trouve dans `projects/generated/generator-validation/media/`.
7. Redémarrer le serveur et vérifier que l'image est toujours affichée.
8. Essayer de sélectionner un fichier texte renommé avec une extension `.png`. L'envoi doit être refusé car son contenu ne possède pas la signature PNG. L'erreur doit rester affichée et le bouton **Enregistrer** doit être désactivé.
9. Sélectionner ensuite une véritable image valide. L'erreur doit disparaître et le bouton **Enregistrer** doit redevenir actif.
10. Créer simultanément plusieurs erreurs dans des sections différentes. Le panneau d'erreurs doit rester visible au-dessus de la page, afficher chaque problème avec sa section et disparaître progressivement à mesure des corrections.

## Résultat attendu

Le client remplace une image sans saisir d'URL. Le fichier et sa référence restent propres au projet exporté et survivent au redémarrage.
