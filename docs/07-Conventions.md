Nommage

Élément         Convention

Plugin          Hero.plugin

Primitive       Button.tsx

Blueprint       product-landing

Hook            useCanvas.ts

----------


Styles :

-pas de CSS inline inutile ;

-Design Tokens obligatoires.

Imports :

Toujours =

@buildotron/ui
@buildotron/core

Jamais de chemins relatifs interminables.

Organisation des composants

Chaque nouvelle fonctionnalité doit respecter la hiérarchie suivante :

Blueprint
    ↓
Section
    ↓
Primitive

Un composant complexe ne doit jamais réimplémenter une Primitive existante.

Exemple :

Hero utilise Button.

Pricing utilise Button.

CTA utilise Button.

Une Primitive est toujours réutilisée plutôt que dupliquée.