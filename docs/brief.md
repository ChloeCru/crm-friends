# Brief — CRM d'amis (première version)

Maquettes : trois écrans (Galerie, Fiche, Éditeur), au format 390 × 844.

## Le produit en une phrase

Une petite app mobile pour ne pas perdre le contact avec ses amis : on voit qui relancer, on note quand on a pris des nouvelles, et chaque ami a un avatar personnalisable.

Priorité : le suivi des contacts est le cœur. L'avatar est le bonus qui donne envie d'ouvrir l'app.

## Contraintes (adaptées le 2026-10-05)

- **App mobile native**, iPhone d'abord : Expo (React Native, Expo Router) + TypeScript. Publication App Store envisagée plus tard (gratuite).
- **Données stockées sur le téléphone** (SQLite via `expo-sqlite`) : pas de serveur, pas de Supabase, pas de Vercel.
- Une seule utilisatrice : pas de comptes, pas de partage, pas de synchronisation.
- Tests pendant le développement : Expo Go sur l'iPhone.
- Reproduire les maquettes fidèlement. Ne pas inventer d'écrans ni de fonctions en plus. En cas d'écart entre maquette et brief, le brief l'emporte.

## Style visuel

Esprit « album de stickers » : contours épais, ombre dure décalée vers le bas, couleurs franches.

| Rôle | Valeur |
|---|---|
| Fond de l'app | `#FAF6EC` (blanc crème) |
| Encre (texte, contours) | `#17203A` |
| Texte secondaire | `#4A556F` |
| Accent (boutons, sélection) | `#2F4BE0` |
| Cartes | `#FFFFFF` |
| Fond « à relancer » | `#FFE1C7`, texte `#8A3F00` |
| Fonds de vignettes (en rotation) | `#DDE4FF`, `#FFF0B8`, `#D5F0E0`, `#FFD9E6` |
| Séparateurs | `#DCD5C3` |

- Contour des cartes et boutons : 2 px `#17203A`.
- Ombre : décalée de 4 px vers le bas (grandes cartes, boutons) ou 3 px (vignettes), sans flou.
- Arrondis : 24 px (grands panneaux), 16 à 20 px (cartes, boutons), 999 px (pastilles).
- Polices : **Bricolage Grotesque** 800 pour les titres, **Figtree** 400 à 700 pour le reste.
- Zones touchables : 44 px minimum.
- Icônes : SVG au trait, épaisseur 2,2 à 2,8. Pas d'emoji.

## Les avatars : DiceBear, style Toon Head

Ne pas dessiner d'avatars : `@dicebear/core` + `@dicebear/styles` (`toon-head`). On stocke uniquement les réglages de chaque ami, jamais l'image.

| Réglage | Valeurs |
|---|---|
| `hairVariant` | `bun`, `sideComed`, `spiky`, `undercut` |
| `rearHairVariant` | `longStraight`, `longWavy`, `neckHigh`, `shoulderHigh` |
| `rearHairProbability` | `0` (aucun) ou `100` |
| `beardVariant` | `chin`, `chinMoustache`, `fullBeard`, `longBeard`, `moustacheTwirl` |
| `beardProbability` | `0` (aucune) ou `100` |
| `eyesVariant` | `bow`, `happy`, `humble`, `wide`, `wink` |
| `eyebrowsVariant` | `angry`, `happy`, `neutral`, `raised`, `sad` |
| `mouthVariant` | `agape`, `angry`, `laugh`, `sad`, `smile` |
| `clothesVariant` | `dress`, `openJacket`, `shirt`, `tShirt`, `turtleNeck` |
| `hairColor` | `2c1b18`, `d6b370`, `724133`, `a55728`, `b58143` |
| `skinColor` | `f1c3a5`, `c68e7a`, `b98e6a`, `a36b4f`, `5c3829` |
| `clothesColor` | `151613`, `0b3286`, `545454`, `147f3c`, `f97316`, `ec4899`, `731ac3`, `b11f1f`, `e8e9e6`, `eab308` |

Noms vérifiés contre `toon-head.json` (v10.6). La probabilité par défaut de la barbe et des cheveux arrière est de 50 % : toujours la fixer à `0` ou `100`.

Licence CC BY 4.0. Crédit dans les réglages : « Avatars : Toon Head par Johan Melin, via DiceBear (CC BY 4.0) ».

## Modèle de données

**friend** : `id` (uuid), `name` (obligatoire), `label` (ex. « Amie de fac · Lyon »), `rhythm_days` (défaut 21), `avatar` (JSON des réglages DiceBear), `notes`, `channels` (JSON : canaux habituels avec cet ami, vide = les quatre), `created_at`.

**contact** : `id` (uuid), `friend_id` (suppression en cascade), `date` (AAAA-MM-JJ), `channel` (`appel`, `message`, `cafe`, `autre`), `created_at`.

Valeurs calculées, jamais stockées :
- dernier contact = date du contact le plus récent de l'ami ;
- jours écoulés = aujourd'hui moins dernier contact ;
- « à relancer » = jours écoulés supérieurs à `rhythm_days`, ou aucun contact enregistré.

## Les trois écrans

### 1. Galerie (accueil)

- Titre « Mes amis », bouton de recherche, sous-titre « N personnes · N à relancer ».
- Recherche : fond opaque par-dessus la galerie, champ en haut, résultats affichés sous le champ (pas de nouvel écran).
- Bloc « À relancer » : panneau orangé, grille de 3 colonnes d'avatars ronds, prénom, « il y a N jours ». Du plus ancien au plus récent. Masqué s'il est vide.
- Bloc « Tout va bien » : grille de 3 colonnes, vignette colorée avec avatar, prénom, délai (« hier », « il y a N jours »). Du plus récent au plus ancien.
- Bouton flottant « + » : demande le prénom, puis ouvre l'éditeur d'avatar.
- Barre du bas : Amis, Rappels, Réglages. Rappels affiche la même liste « à relancer ».
- Toucher un ami ouvre sa fiche.

### 2. Fiche d'un ami

- Retour vers la galerie. Bouton « ⋯ » : modifier les détails (prénom, libellé, canaux habituels) et supprimer l'ami (avec confirmation).
- Grand panneau avec l'avatar (fond orangé si à relancer, sinon couleur de vignette de l'ami), pastille « À relancer » si c'est le cas, bouton « Son look » vers l'éditeur.
- Prénom et libellé.
- Carte à deux colonnes : dernier contact, rythme voulu. Affiché « toutes les N semaines » si multiple de 7, sinon « tous les N jours ». Modifiable par un choix : 1, 2, 3, 4, 6 ou 8 semaines.
- Bouton principal « J'ai pris des nouvelles » : panneau du bas avec les canaux habituels de l'ami (les quatre si aucun n'est renseigné) ; un toucher crée le contact daté d'aujourd'hui. Un seul canal habituel : enregistrement direct.
- Liste « Derniers contacts » : canal et date, les plus récents en premier.
- Zone « Notes » : texte libre, enregistré automatiquement.

### 3. Éditeur d'avatar

- Aperçu en grand, mis à jour en direct.
- Onglets : Coiffure, Visage, Tenue, Barbe.
  - Coiffure : coupe, longueur derrière (ou aucune), couleur des cheveux.
  - Visage : yeux, sourcils, bouche, couleur de peau.
  - Tenue : vêtement et sa couleur.
  - Barbe : aucune ou une des variantes.
- Chaque option de forme est une vignette qui montre l'avatar actuel avec cette option ; l'option choisie a un contour épais de la couleur d'accent.
- Couleurs : pastilles rondes ; la choisie a un anneau d'accent et une coche.
- « Au hasard » tire de nouveaux réglages. « Enregistrer » sauvegarde et revient à la fiche.

## Ordre de construction

1. Base de données et quelques amis d'exemple (développement uniquement).
2. Composant `Avatar` (réglages en entrée, SVG en sortie), testé seul.
3. Galerie, en lecture seule.
4. Fiche, avec « J'ai pris des nouvelles » et les notes.
5. Éditeur d'avatar.
6. Ajout, modification et suppression d'un ami.
7. Réglages (crédit des avatars) et finitions.

Livrer et faire valider chaque étape avant de passer à la suivante.

## Hors périmètre pour cette version

- Notifications et rappels envoyés sur le téléphone.
- Comptes, connexion, partage, synchronisation.
- Import des contacts du téléphone.
- Personnage en pied, taille du personnage, éditeur d'avatars maison.
