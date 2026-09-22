# Plugins Sections

Les plugins Navbar, Hero, Features, Gallery, FAQ, CTA et Footer possèdent chacun un manifeste, un schéma des champs `title` et `body`, un composant React et un aperçu Builder. Le registre dans `src/index.ts` associe les types de sections à leurs aperçus.

Navbar et Footer proposent des liens, Hero une action facultative, Features une liste éditable, Gallery des images avec texte alternatif, FAQ des questions ouvrables et CTA un bouton configurable. Chaque plugin possède aussi une vignette SVG dans la Library. Dans le Builder, les liens des aperçus ne déclenchent pas de navigation. Hero possède un premier formulaire de contenu pour le futur CMS, testable sur /admin-preview. Les autres formulaires et les validations d'export complètes restent à réaliser.
