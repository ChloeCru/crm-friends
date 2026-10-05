# crm-friends

Petite app iPhone pour ne pas perdre le contact avec ses amis. Expo + TypeScript, données locales (SQLite).

Brief et décisions de périmètre : [docs/brief.md](docs/brief.md).

## Lancer

```bash
npm install
npx expo start      # puis scanner le QR code avec l'app Expo Go sur l'iPhone
```

En développement, une base vide est remplie avec des amis d'exemple (`src/db/seed.ts`).

## Vérifier

```bash
npm run typecheck
npx expo lint
npm test
```
