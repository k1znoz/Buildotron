# Plugins Sections

Les plugins Hero, Features, Gallery, FAQ, CTA et Footer possèdent chacun un manifeste, un schéma des champs `title` et `body`, un composant React et un aperçu Builder. Le registre dans `src/index.ts` associe les types de sections à leurs aperçus.

Hero propose une action facultative, Features une liste éditable, Gallery des images avec texte alternatif, FAQ des questions ouvrables, CTA un bouton configurable et Footer des liens. Chaque plugin possède aussi une vignette SVG dans la Library. Dans le Builder, les liens des aperçus ne déclenchent pas de navigation. Les formulaires CMS et les validations d'export restent à réaliser.
