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

## Médias locaux implémentés

`POST /api/media` reçoit une image après authentification. Le serveur accepte JPEG, PNG, WebP et GIF jusqu'à 5 Mo, vérifie la signature du fichier et génère un nom aléatoire. Les fichiers sont servis sous `/media/` et conservés dans le dossier `media/` du projet exporté. Ce dossier doit accompagner `database/site.db` dans la stratégie de sauvegarde du site.

## Catalogue Produits implémenté

La table SQLite `cms_products` conserve un document par produit. Les routes authentifiées `/api/admin/products` permettent de lire le catalogue complet, créer, modifier et supprimer des produits. La route publique `/api/products` retourne uniquement les produits publiés. Le catalogue reste indépendant de la structure des pages ; une future section Product décidera de sa présentation.

## Réglages SEO implémentés

La table `cms_seo` conserve le titre, la description, l'URL canonique, l'image OpenGraph et l'état d'indexation. L'API publique permet au site d'appliquer les métadonnées au document. L'écriture exige une session CMS. `robots.txt` et `sitemap.xml` sont produits à partir des mêmes réglages.
