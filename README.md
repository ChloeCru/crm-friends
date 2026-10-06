# crm-friends

Une petite app iPhone pour ne pas perdre le contact avec ses amis : on voit qui relancer, on note quand on a pris des nouvelles, et chaque ami a un avatar personnalisable.

Le suivi des contacts est le cœur de l'app. L'avatar est le bonus qui donne envie de l'ouvrir.

## Ce que fait l'app

- **Galerie** : tous les amis, avec en haut ceux « à relancer » (du plus ancien au plus récent) et une recherche.
- **Fiche d'un ami** : dernier contact, rythme voulu (toutes les 1 à 8 semaines), historique, notes libres. Un bouton « J'ai pris des nouvelles » enregistre le contact du jour par appel, message, café ou autre.
- **Éditeur d'avatar** : coiffure, visage, tenue, barbe, avec aperçu en direct et tirage au hasard.
- **Rappels** : la liste des amis à relancer.

Un ami est « à relancer » quand il n'a aucun contact enregistré, ou quand le dernier date de plus longtemps que son rythme. Cette valeur est calculée à l'affichage, jamais stockée.

Tout reste sur le téléphone : pas de compte, pas de serveur, pas de synchronisation.

## Stack

- **Expo SDK 57** (React Native, Expo Router) + **TypeScript**
- **SQLite** local via `expo-sqlite`
- **DiceBear** (style Toon Head) pour les avatars : seuls les réglages sont stockés, l'image est générée à l'affichage

## Lancer

```bash
npm install
npx expo start      # puis scanner le QR code avec l'app Expo Go sur l'iPhone
```

En développement, une base vide est remplie avec des amis d'exemple (`src/db/seed.ts`).

## Organisation

- `src/app/` : écrans (Expo Router) — galerie, rappels, réglages (onglets), fiche, éditeur d'avatar, modification.
- `src/domain/` : types et valeurs calculées (dernier contact, « à relancer », libellés), testés sans React Native.
- `src/db/` : schéma SQLite, requêtes, amis d'exemple.
- `src/avatar/` : options DiceBear Toon Head et rendu SVG.
- `src/ui/`, `src/components/` : thème « stickers » et composants.

## Vérifier

```bash
npm run typecheck
npx expo lint
npm test
```

## Périmètre

Le brief d'origine et les décisions de périmètre sont dans [docs/brief.md](docs/brief.md). Hors périmètre pour cette première version : notifications, comptes et synchronisation, import des contacts du téléphone.

## Licence

Code sous licence [MIT](LICENSE).

Avatars : Toon Head par Johan Melin, via [DiceBear](https://www.dicebear.com/) (CC BY 4.0).
