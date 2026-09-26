# Validation de l'intégration BIOGRIND

1. Démarrer le Builder et ouvrir `projects/biogrind-complete.buildotron.zip`.
2. Vérifier la présence, dans cet ordre, de Navbar, Hero, Features, Gallery, Product, Steps, Specifications, FAQ, CTA et Footer.
3. Vérifier que Gallery affiche l'image BIOGRIND et que sa source utilise `/assets/` sans chaîne Base64.
4. Vérifier les cinq étapes : Je collecte, Je ferme, Je broie, Je récupère et Je composte.
5. Vérifier les caractéristiques : dimensions, poids, capacité, mécanisme, séparation, matériaux et entretien.
6. Lancer le contrôle des sections ; aucun problème ne doit être signalé.
7. Enregistrer puis rouvrir le paquet et vérifier que l'image et les nouvelles sections sont conservées.
8. Exporter le projet React, l'extraire dans `projects/generated/biogrind-complete`, puis exécuter `npm install`, `npm run build`, `npm run lint` et `npm test`.
9. Démarrer le CMS et Vite dans deux terminaux. Vérifier que toutes les sections Content apparaissent avant CTA et Footer sur les ports 3000 et 5173.
10. Créer un produit publié dans `/admin` et vérifier son affichage dans Product. Modifier ensuite une étape et une caractéristique, enregistrer, puis vérifier leur mise à jour sur le site public.
