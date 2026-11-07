# Compteur de Glucides

Application web pour compter les glucides d'un repas. Installable en PWA sur mobile.

**https://drarchy.github.io/glucides/**

## Fonctionnalités

### Calcul du repas

- Ajout de lignes : nom d'aliment, poids (g), % de glucides
- Calcul automatique des glucides par ligne et du total
- Total toujours visible (header sticky)
- « Nouveau repas » efface la saisie, avec confirmation

### Recherche d'aliments

Pas de base à choisir : la recherche interroge toutes les sources dans un ordre de priorité fixe
— **aliments perso**, puis la **liste simplifiée** (69 aliments courants), puis la **base complète**
(3272 aliments CIQUAL). Résultats dédoublonnés par nom, 8 au maximum.

### Aliments perso

Page dédiée (icône ⚙ du header), avec ajout, consultation, modification et suppression. Un
aliment perso peut aussi être créé depuis une ligne de repas via son bouton ★.

**Aliments en portions** — un aliment perso accepte un champ optionnel `g/pc`, le poids d'une
portion. Le remplir suffit à passer l'aliment en portions : une madeleine à 30 g/pc et 50 % se
saisit alors en nombre de madeleines plutôt qu'en grammes.

```
Aliment  [Madeleine                  ]
Nombre [2]   Gluc% [50]   = 30 g   [g|pc]
2 × 30 g = 60 g
```

Le bouton `g|pc` de la ligne permet de repasser en grammes (demi-portion, paquet pesé) en
convertissant la valeur saisie.

**Sauvegarde** — les aliments perso ne vivent que dans le `localStorage` de l'appareil : ils sont
perdus si la PWA est désinstallée ou les données du site effacées. Les boutons `Exporter` /
`Importer` de la page produisent et relisent un fichier `glucides-perso-AAAA-MM-JJ.json`, ce qui
couvre la sauvegarde et le passage à un autre téléphone. L'import est une **fusion non
destructive** : les noms déjà présents sont ignorés, rien n'est écrasé ni supprimé.

C'est volontairement le seul mécanisme de persistance hors de l'appareil : aucune donnée ne
quitte le téléphone, donc pas de serveur, pas de compte, et rien à héberger.

### Repas de référence

Quand un repas prévu n'est pas entièrement consommé, « Mémoriser comme référence » enregistre
le repas (liste + total). Un bandeau sous le header affiche alors l'écart avec la saisie en
cours, en direct :

```
  Repas 42 g
── Réf. 60 g · Δ −18 g ──── [↻] [✕]
   18 g à remplacer
```

Le delta est coloré (manque, dépassement, égalité) et la mention « N g à remplacer » indique
combien de glucides il reste à apporter avec un autre aliment. « Nouveau repas » **conserve** la
référence — c'est le geste pour recompter ce qui a réellement été mangé. `↻` recharge la liste
mémorisée dans la saisie, `✕` efface la référence. Les quatre actions destructives (nouveau
repas, mémorisation écrasant une référence, rechargement, effacement) demandent confirmation.

### Hors-ligne et mises à jour

- Persistance de la saisie, des aliments perso et de la référence en localStorage
- Fonctionne hors-ligne (Service Worker)
- Démarrage toujours immédiat depuis le cache, même en connexion faible : la revalidation se
  fait en arrière-plan avec un timeout, jamais sur le chemin critique
- Quand une nouvelle version est prête, un bandeau « Nouvelle version disponible — Recharger »
  l'applique en un tap
- Installable sur l'écran d'accueil (PWA)

## Stack

Vanilla HTML/CSS/JS — pas de framework, pas de build.

- `index.html` — toute l'application (interface, logique, styles), avec la page Aliments perso
  en vue plein écran routée sur `#perso`
- `aliments-light.js` / `aliments-full.js` — les deux bases d'aliments
- `sw.js`, `manifest.json`, icônes — la partie PWA

### Données en localStorage

| Clé | Contenu |
| --- | --- |
| `glucides-rows` | les lignes du repas en cours |
| `glucides-perso` | les aliments perso (`nom`, `pct`, `unite` optionnel) |
| `glucides-ref` | le repas de référence (`rows`, `total`) |

## Avertissement

Les valeurs de glucides fournies sont indicatives et peuvent varier selon les marques, les modes de préparation et les sources. Cette application ne se substitue pas à un avis médical ou diététique.

## Données

Base de données CIQUAL 2025 — 3272 aliments, ou la sélection de 69 aliments courants de la liste simplifiée.

> Anses. 2025. Table de composition nutritionnelle des aliments Ciqual 2025. https://doi.org/10.57745/RDMHWY

Données ouvertes sous [Licence Ouverte](https://www.etalab.gouv.fr/licence-ouverte-open-licence/).
