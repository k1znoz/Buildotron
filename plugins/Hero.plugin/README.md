# Hero

Premier plugin Section de Buildotron. Son `schema.json` décrit les champs déjà présents dans le projet canonique. `react/Hero.tsx` est le rendu réutilisable ; `editor/HeroPreview.tsx` l'affiche dans le Builder.

Le formulaire de contenu `admin/HeroAdminForm.tsx` est prêt pour le futur CMS. Il valide le titre, le texte et l'action facultative avant d'appliquer les modifications. Le Builder expose un aperçu isolé sur /admin-preview pour le tester ; la persistance du CMS viendra avec le Core CMS. Une vignette SVG est disponible dans la Library.
