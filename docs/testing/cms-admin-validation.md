# Validation de l'interface CMS générée

## Préparation

Depuis la racine du dépôt :

```powershell
npm run generate -- projects/generator-validation.json projects/generated/generator-validation
cd projects/generated/generator-validation
npm run build
$env:CMS_PASSWORD = "mot-de-passe-test-123"
npm start
```

Conserver ce terminal ouvert pendant le parcours.

## Parcours

1. Ouvrir `http://127.0.0.1:3000/admin`. L'écran **Gestion du contenu** doit afficher une demande de mot de passe.
2. Essayer un mauvais mot de passe. La connexion doit être refusée et aucun formulaire d'édition ne doit apparaître.
3. Utiliser `mot-de-passe-test-123`. Les sections existantes doivent apparaître avec leurs champs **Titre** et **Texte**.
4. Vérifier qu'aucune commande ne permet d'ajouter, supprimer, dupliquer ou déplacer une section.
5. Vider un titre puis essayer d'enregistrer. L'enregistrement doit être refusé.
6. Modifier le titre et le texte de Hero avec des valeurs non vides, puis cliquer sur **Enregistrer**. Le message `Contenu enregistré.` doit apparaître.
7. Cliquer sur **Voir le site**. Le site public doit afficher les nouvelles valeurs sans nouveau build.
8. Arrêter le serveur avec `Ctrl+C`, relancer `npm start`, puis rouvrir le site. Les valeurs modifiées doivent toujours être présentes.

## Résultat attendu

Le client peut entretenir le contenu textuel existant depuis le projet autonome. La structure issue du Builder reste verrouillée.
