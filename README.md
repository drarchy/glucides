# Compteur de Glucides

Application web pour compter les glucides d'un repas. Installable en PWA sur mobile.

**https://drarchy.github.io/glucides/**

## Fonctionnalités

- Ajout de lignes : nom d'aliment, poids (g), % de glucides
- Calcul automatique des glucides par ligne et du total
- Total toujours visible (header sticky)
- Deux bases d'aliments : Light (~68 courants) ou Complète (~3272 CIQUAL)
- Aliments personnalisés sauvegardés en localStorage, éditables et supprimables
- Persistance des données en localStorage
- Fonctionne hors-ligne (Service Worker)
- Installable sur l'écran d'accueil (PWA)

## Stack

Vanilla HTML/CSS/JS — pas de framework, pas de build.

## Avertissement

Les valeurs de glucides fournies sont indicatives et peuvent varier selon les marques, les modes de préparation et les sources. Cette application ne se substitue pas à un avis médical ou diététique.

## Données

Base de données CIQUAL 2025 — 3272 aliments (mode Complète) ou sélection de ~68 aliments courants (mode Light).

> Anses. 2025. Table de composition nutritionnelle des aliments Ciqual 2025. https://doi.org/10.57745/RDMHWY

Données ouvertes sous [Licence Ouverte](https://www.etalab.gouv.fr/licence-ouverte-open-licence/).
