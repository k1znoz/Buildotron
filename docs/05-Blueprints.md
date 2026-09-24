Les définitions exécutables sont centralisées dans `blueprints/index.ts`. Chaque Blueprint déclare un identifiant, un nom, un thème, ses slots, sa liste initiale de sections et les contenus propres à sa recette.

Blueprints disponibles :

- Product Landing : Hero, Features, CTA ;
- Coming Soon : Hero, CTA, Footer ;
- Portfolio : Navbar, Hero, Gallery, Footer.

Le changement de Blueprint dans le Builder remplace les sections du projet tout en conservant son nom et son identifiant. Le JSON canonique conserve l'identifiant du Blueprint choisi.

Chaque instanciation clone les contenus imbriqués du Blueprint. La recette reste donc immuable lorsque le développeur modifie des textes, des liens ou des listes dans le Builder.

---

Les Slots.

Slot Sections

Hero Hero

Content Gallery

Footer Footer

---

## SEO par Blueprint

Chaque Blueprint embarque une stratégie SEO par défaut.

Exemple Product Landing :

- Hero → H1
- Features → H2
- Gallery → images optimisées
- FAQ → FAQ Schema
- Product → Product Schema
