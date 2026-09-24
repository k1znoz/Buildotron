Architecture: Core CMS

Auth
Media
Pages
Products
Settings

---

Puis, les permissions:

Le client peut:

-modifier les textes ;

-changer les images.

Le client ne peut pas:

-déplacer les sections ;

-supprimer les sections.

---

Cette règle est figée.

---

## Contrat de contenu implémenté

Le package `@buildotron/core-cms` produit un document contenant uniquement l'identité des sections et leurs propriétés éditables.

Lors de la réapplication, il vérifie :

- l'identité du projet ;
- le nombre de sections ;
- l'identifiant et le type de chaque section ;
- l'absence d'ajout ou de duplication.

L'ordre, les slots et les overrides proviennent toujours du projet généré et ne sont jamais lus depuis le document CMS.

## Persistance SQLite implémentée

Le projet exporté contient `server/contentStore.mjs`. Ce module initialise une ligne de contenu depuis le JSON généré, puis conserve les versions sauvegardées dans `database/site.db`. Une réouverture ne remplace pas le contenu existant par les valeurs initiales.

La base stocke uniquement le document de contenu. La structure reste dans `src/structure.json`. L'interface client et l'API utiliseront ce stockage dans les tranches suivantes.

## API locale implémentée

Le serveur généré expose :

- `GET /api/content` pour lire le document courant ;
- `PUT /api/content` pour enregistrer un document complet validé.

Il sert également le build React depuis `dist` et écoute sur `127.0.0.1` par défaut.

## Authentification locale implémentée

`POST /api/auth/login` crée une session en mémoire à partir du secret `CMS_PASSWORD`. Les écritures par `PUT /api/content` exigent son cookie `HttpOnly` et `SameSite=Strict`. Les sessions sont invalidées au redémarrage du serveur. Le contenu reste lisible publiquement afin que le site puisse l'afficher.
