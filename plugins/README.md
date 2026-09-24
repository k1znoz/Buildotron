# Plugins Sections

Les plugins Navbar, Hero, Features, Gallery, FAQ, CTA et Footer possèdent chacun un manifeste, un schéma des champs `title` et `body`, un composant React et un aperçu Builder. Le registre dans `src/index.ts` associe les types de sections à leurs aperçus.

Navbar et Footer proposent des liens, Hero une action facultative, Features une liste éditable, Gallery des images avec texte alternatif, FAQ des questions ouvrables et CTA un bouton configurable. Chaque plugin possède aussi une vignette SVG dans la Library. Dans le Builder, les liens des aperçus ne déclenchent pas de navigation. Les sept plugins possèdent des formulaires de contenu pour le futur CMS, testables sur /admin-preview. Les formulaires de liste éditent les éléments existants sans en changer le nombre. Le contrôle avant export réutilise les mêmes validateurs de contenu.
