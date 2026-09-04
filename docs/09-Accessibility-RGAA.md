# Accessibility System (RGAA)

## Objectif

Buildotron doit produire des sites accessibles par défaut.

L'objectif n'est pas de remplacer un audit RGAA, mais d'empêcher les erreurs les plus courantes dès la conception.

Le Builder guide le développeur.
Les composants embarquent les bonnes pratiques.
L'export vérifie les points critiques.

---

## Les trois niveaux d'accessibilité

### 1. Conception (Builder)

Le Builder applique automatiquement certaines règles.

* Un seul H1 par page.
* Hiérarchie des titres cohérente.
* Contraste minimal vérifié.
* Focus visible.
* Navigation clavier prise en compte.

Certaines erreurs critiques empêchent l'export.

---

### 2. Composants accessibles

Chaque Primitive doit être accessible par construction.

| Primitive | Garantie           |
| --------- | ------------------ |
| Button    | Focus clavier      |
| Input     | Label associé      |
| Modal     | Focus trap         |
| Accordion | ARIA               |
| Link      | Intitulé explicite |

Le développeur n'a pas besoin de réimplémenter ces comportements.

---

### 3. Validation avant export

Avant l'export, Buildotron vérifie notamment :

* H1 unique.
* Hiérarchie des titres.
* Images avec texte alternatif.
* Champs avec label.
* Navigation clavier.
* Contraste suffisant.

Les erreurs critiques bloquent l'export.

---

## Contrat d'un plugin

Chaque plugin doit pouvoir déclarer ses exigences d'accessibilité.

Exemple :

```json
{
  "accessibility": {
    "requiresAlt": true,
    "keyboardNavigation": true,
    "ariaRole": "button"
  }
}
```

Ces informations sont utilisées par :

* le Builder ;
* le générateur ;
* les tests ;
* le rapport de validation.

---

## Checklist obligatoire d'un plugin

Un plugin n'est considéré comme terminé que si :

* [ ] Navigation clavier validée.
* [ ] Focus visible.
* [ ] Labels présents si nécessaire.
* [ ] Alt renseigné si nécessaire.
* [ ] Attributs ARIA cohérents.
* [ ] Tests Playwright passés.

---

## Vision long terme

À terme, Buildotron devra tendre vers une compatibilité maximale avec les critères RGAA et WCAG applicables, tout en conservant une approche pragmatique : prévenir les erreurs structurelles plutôt que corriger les sites après leur création.
