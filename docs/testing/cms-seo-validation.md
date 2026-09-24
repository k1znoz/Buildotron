# Validation des réglages SEO du CMS

## Préparation

Régénérer, construire et démarrer le projet de validation, puis ouvrir `/admin` et se connecter.

## Parcours

1. Descendre jusqu'à la section **SEO**.
2. Saisir `Titre SEO de validation`, une description, `https://example.com/` comme URL canonique et `https://example.com/share.jpg` comme image OpenGraph.
3. Laisser **Autoriser l’indexation** activé et cliquer sur **Enregistrer le SEO**.
4. Ouvrir précisément `http://127.0.0.1:3000/`, puis l'onglet **Éléments** des outils de développement. Ne pas inspecter le Builder Vite et ne pas utiliser **Afficher le code source**, car les balises sont appliquées après le chargement JavaScript. Dans `<head>`, vérifier le titre, la description, la balise canonique, les balises OpenGraph, Twitter Card et robots.
5. Ouvrir `http://127.0.0.1:3000/robots.txt`. Le contenu attendu est `User-agent: *`, `Allow: /` et la référence `Sitemap: https://example.com/sitemap.xml`. Les autres métadonnées SEO ne figurent pas dans ce fichier.
6. Ouvrir `http://127.0.0.1:3000/sitemap.xml`. Le document doit contenir `https://example.com/`.
7. Désactiver l'indexation et enregistrer. Après rechargement, la balise robots doit contenir `noindex,nofollow`, `robots.txt` doit contenir `Disallow: /` et `sitemap.xml` doit répondre avec une page vide ou une erreur 404.
8. Essayer un titre vide, une description vide ou une URL canonique non absolue. L'enregistrement doit être refusé.
9. Redémarrer le serveur et vérifier que les derniers réglages sont conservés.
10. Enregistrer de nouveau le SEO et créer un produit. Chaque réussite doit afficher une notification verte au-dessus de la page, puis la faire disparaître automatiquement après environ 3,5 secondes.
