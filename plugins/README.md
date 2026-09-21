# Plugins Sections

Les plugins Hero, Features, Gallery, FAQ, CTA et Footer possèdent chacun un manifeste, un schéma des champs `title` et `body`, un composant React et un aperçu Builder. Le registre dans `src/index.ts` associe les types de sections à leurs aperçus.

Cette première version affiche la structure avec du contenu de remplacement. Gallery n'embarque pas encore d'images et Features n'a pas encore de liste éditable. Le CTA possède un libellé et un lien éditables ; son bouton reste désactivé tant qu'aucun lien n'est configuré. Dans le Builder, cliquer sur son aperçu ne navigue pas. Les formulaires CMS, les images de prévisualisation et les validations d'export restent à réaliser.
