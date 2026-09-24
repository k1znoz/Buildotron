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

L'ordre, les slots et les overrides proviennent toujours du projet généré et ne sont jamais lus depuis le document CMS. Les prochaines tranches utiliseront ce contrat pour la persistance SQLite et l'interface client.
