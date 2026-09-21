# Validation manuelle — Canvas et projet JSON

Cette vérification couvre l'interface du Builder. Les tests automatisés couvrent déjà les règles de slots, la duplication, le réordonnancement et la validation du format JSON.

## Démarrer

À la racine du dépôt :

```powershell
npm install
npm run dev -w builder
```

Ouvrir dans le navigateur l'adresse affichée par Vite. Garder le terminal ouvert pendant l'essai.

## Parcours à vérifier

1. Cliquer sur **Ouvrir JSON** et choisir `projects/product-landing.json`. Le nom **Product Landing** et les sections **Hero**, **Features** et **CTA** doivent apparaître dans leurs slots respectifs.
2. Sélectionner **Features** sur le canvas. Dans l'Inspector, changer le titre en **Avantage 1** et le texte. Le canvas doit se mettre à jour immédiatement.
3. Ajouter **FAQ** depuis la Library. Elle doit apparaître dans **Content**. La dupliquer, modifier le titre de la copie en **FAQ 2**, puis vérifier que le titre de l'original reste inchangé.
4. Sélectionner la copie et utiliser **Monter** puis **Descendre**. L'ordre des sections de **Content** doit changer. Refaire le déplacement par glisser-déposer dans les deux sens, en déposant la section sur celle avec laquelle échanger sa place.
5. Essayer de glisser **Hero** vers **Content** sans override. Le déplacement doit être refusé et un message doit l'expliquer. Sélectionner **Hero**, cocher **Autoriser le placement libre**, puis choisir **Content** dans la liste des slots. La section doit s'y trouver avec la mention **override**. Décocher l'option : la section doit revenir dans **Hero**. Réactiver ensuite l'override et replacer **Hero** dans **Content** pour vérifier sa persistance à l'étape suivante.
6. Modifier le nom du projet, puis cliquer sur **Enregistrer JSON**. Une seule fenêtre de téléchargement du navigateur doit apparaître. Choisir `projects/canvas-validation.json` dans le dépôt en remplaçant l'ancien fichier vide ; si le navigateur télécharge automatiquement dans un autre dossier, déplacer ce fichier dans `projects/`. Vérifier qu'il n'est pas vide, actualiser la page, ouvrir ce nouveau JSON et vérifier que le nom, les textes, l'ordre et les placements sont conservés.
7. Ouvrir `tests/fixtures/unsupported-version.json`. Un message doit refuser la version du format ; le projet déjà ouvert doit rester visible et inchangé.
8. Refaire la sélection et les actions **Monter**, **Descendre**, **Dupliquer** et **Supprimer** au clavier avec Tab, Entrée et Espace. Sur une section du canvas qui a le focus, utiliser ↑ et ↓ pour la déplacer dans son slot. Activer et désactiver **Autoriser le placement libre** avec Entrée puis avec Espace. Le focus doit rester visible.

Le bouton **Export React** est désactivé jusqu'au jalon Code Generator.

## Vérifications automatisées

```powershell
node --test --experimental-strip-types --test-isolation=none
npm run lint -w builder
npm run build -w builder
```

Si une étape échoue, noter le numéro, l'action effectuée, le résultat affiché et le navigateur utilisé.
