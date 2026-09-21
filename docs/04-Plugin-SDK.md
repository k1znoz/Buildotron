Structure officielle :

MonPlugin.plugin/

editor/
admin/
react/

manifest.json
schema.json
preview.png
tests/
README.md

Checklist:

-Manifest.
-Schema.
-Preview.
-Editor.
-Admin.
-React.
-Tests.

Enfin:

La commande.

npm run create:plugin Hero

Même si elle n'existe pas encore, elle est définie.

---

## Capacités d'un plugin

Chaque plugin doit pouvoir déclarer des métadonnées complémentaires.

### Exemple

```json
{
  "seo": {
    "headingLevel": "h1",
    "schema": "Product"
  }
}
```

Ces informations permettent au générateur de produire automatiquement :

- les balises HTML adaptées ;
- le JSON-LD ;
- les vérifications du SEO Report.
