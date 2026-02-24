# GitHub User Search

Application React permettant de rechercher des utilisateurs GitHub via l'API GitHub et de gérer une liste de résultats avec des fonctionnalités de sélection, duplication et suppression.

## 📋 Sommaire

- [Algorithme FizzBuzz](#fizzbuzz)
- [Architecture du projet](#architecture-du-projet)
- [Fonctionnalités](#fonctionnalites)
- [Tests unitaires](#tests-unitaires)
- [Commandes essentielles](#commandes-essentielles)
- [Technologies utilisées](#technologies-utilisees)
- [Notes](#notes)

## 🧮 Algorithme FizzBuzz {#fizzbuzz}

L’algorithme **FizzBuzz** est implémenté en TypeScript dans `src/algorithm` et suit une approche fonctionnelle, simple et extensible.

- Génère la séquence de `1` à `N` avec les règles classiques :
  - multiple de 3 → `"Fizz"`
  - multiple de 5 → `"Buzz"`
  - multiple de 3 et 5 → `"FizzBuzz"`
  - sinon le nombre sous forme de chaîne
- Entrée strictement contrôlée : `N` doit être un entier positif (`>= 1`), sinon une erreur est levée.
- Les tests unitaires associés couvrent les cas limites (0, valeurs négatives, décimales, grande valeur de N) ainsi que des règles personnalisées, afin de garantir un comportement fiable et maintenable.

## 🏗️ Architecture du projet {#architecture-du-projet}

Le projet suit une architecture basée sur le **Atomic Design Pattern** et une séparation claire des responsabilités.

### Structure des dossiers

```
src/
├── components/          # Composants React organisés par niveau Atomic Design
│   ├── atoms/          # Composants atomiques (éléments de base)
│   │   ├── GenericButton/
│   │   ├── PageTitle/
│   │   ├── SearchInput/
│   │   ├── StatusMessage/
│   │   └── ToggleSwitch/
│   ├── molecules/      # Composants moléculaires (combinaisons d'atomes)
│   │   ├── SelectAllComponent/
│   │   └── UserCard/
│   ├── organisms/      # Composants organismes (combinaisons de molécules)
│   │   └── SelectionBar/
│   └── pages/          # Pages complètes
│       └── UserSearchPage/
├── hooks/              # Hooks React personnalisés
│   ├── useGithubUserSearch.ts
│   ├── useSelectableUsers.ts
│   └── tests/         # Tests des hooks
├── services/           # Services et types pour l'API GitHub
│   ├── githubApi.ts   # Types et interfaces pour l'API GitHub
│   └── githubService.ts   # Service d'accès HTTP à l'API GitHub
├── constants/          # Constantes d'affichage et messages
│   └── messages.ts
├── assets/            # Ressources statiques (images, etc.)
├── App.tsx            # Composant racine
├── main.tsx           # Point d'entrée de l'application
└── setupTests.ts     # Configuration des tests
```

### Architecture des composants

#### **Atoms** (Composants atomiques)

- **GenericButton** : Bouton générique pouvant être un `<button>` ou un `<a>` selon le contexte
- **PageTitle** : Titre de page avec gestion conditionnelle de l'affichage
- **SearchInput** : Champ de recherche avec gestion des événements
- **StatusMessage** : Composant d'affichage des messages de statut (chargement et erreur) avec affichage conditionnel selon les props fournies
- **ToggleSwitch** : Interrupteur toggle personnalisé

#### **Molecules** (Composants moléculaires)

- **SelectAllComponent** : Composant de sélection multiple avec checkbox et compteur
- **UserCard** : Carte d'affichage d'un utilisateur GitHub avec avatar, informations et bouton de profil

#### **Organisms** (Composants organismes)

- **SelectionBar** : Barre d'outils pour la gestion de sélection (édition, duplication, suppression)

#### **Pages** (Pages complètes)

- **UserSearchPage** : Page principale qui orchestre tous les composants et hooks

### Architecture des hooks

#### **useGithubUserSearch**

Hook personnalisé pour la recherche d'utilisateurs GitHub :

- Gestion du debounce (400ms par défaut)
- Gestion des erreurs (rate limit, validation, réseau, etc.)
- Gestion de l'état de chargement (`loading`)
- Gestion des états dérivés : liste vide (`isEmpty`), dépassement de quota (`isRateLimited`, `rateLimitResetAt`)
- Annulation des requêtes en cours lors d'un changement de query (via `AbortController`)
- Délégation de l'appel HTTP au service `githubService` + normalisation des messages via `ERROR_MESSAGES`

#### **useSelectableUsers**

Hook personnalisé pour la gestion de la sélection d'utilisateurs :

- Gestion de la liste d'utilisateurs affichés
- Sélection/désélection individuelle et globale
- Mode édition
- Duplication et suppression des utilisateurs sélectionnés

### Services

#### **githubApi.ts**

Définit les types TypeScript pour l'API GitHub :

- `GithubUser` : Structure d'un utilisateur GitHub
- `GithubUserSearchResponse` : Structure de la réponse de recherche
- `GithubUserSearchErrorType` : Types d'erreurs possibles

#### **githubService.ts**

Service dédié aux appels HTTP vers l'API GitHub :

- Encapsule `fetch` pour la route `/search/users`
- Centralise la gestion des statuts HTTP (200, 403, 422, 5xx, erreurs réseau)
- Retourne un objet typé (`GithubServiceResponse`) avec soit `data`, soit `error`
- Expose la méthode : `searchUsers(query: string, signal?: AbortSignal)`

### Constantes

#### **messages.ts**

- `ERROR_MESSAGES` : messages d'erreur standardisés pour le réseau, les validations, le rate limit et les erreurs serveur
- `UI_MESSAGES` : messages d'affichage (chargement, aucun résultat, aide sur la longueur minimale de la query)

## ✨ Fonctionnalités

### Recherche d'utilisateurs GitHub

- Recherche en temps réel avec debounce (400ms)
- Affichage des résultats avec avatar, ID et login
- Gestion des erreurs (rate limit, validation, réseau)
- Affichage des messages d'erreur appropriés
- Indicateur de chargement pendant les requêtes
- Message d'état quand aucun résultat n'est trouvé pour une query (`Aucun utilisateur trouvé pour "..."`)

### Gestion de sélection

- **Mode édition** : Activation/désactivation via un toggle switch
- **Sélection individuelle** : Clic sur une checkbox pour sélectionner un utilisateur
- **Sélection globale** : Checkbox "Select All" pour sélectionner tous les utilisateurs
- **Compteur** : Affichage du nombre d'éléments sélectionnés

### Actions sur les utilisateurs sélectionnés

- **Duplication** : Dupliquer les utilisateurs sélectionnés avec de nouveaux IDs
- **Suppression** : Supprimer les utilisateurs sélectionnés de la liste affichée
- **Voir le profil** : Lien vers le profil GitHub de chaque utilisateur

### Gestion des erreurs

- **Rate Limit** : Détection et message d'erreur avec conservation de l'état
- **Validation** : Gestion des erreurs de validation de l'API GitHub (422)
- **Réseau** : Gestion des erreurs réseau avec messages appropriés
- **Erreurs serveur** : Gestion des erreurs serveur (500, etc.)

## 🧪 Tests unitaires

Les tests sont organisés par composant et hook, utilisant **Vitest** et **React Testing Library**.

### Tests des Hooks

#### **useGithubUserSearch.test.ts**

Tests couvrant :

- ✅ État initial correct
- ✅ Reset si query trop courte (< 2 caractères)
- ✅ Succès API après debounce (400ms)
- ✅ Gestion du rate limit (403) avec header `x-ratelimit-reset`
- ✅ Gestion des erreurs de validation (422)
- ✅ Gestion des erreurs serveur (500)
- ✅ Gestion des erreurs réseau (reject avec `Error` et avec valeur non-`Error`)
- ✅ Résultat vide (items=[])
- ✅ Persistance du rate limit après query courte
- ✅ Options personnalisées (minQueryLength, debounceMs)
- ✅ Cas où la requête est annulée via `AbortController` après l'appel service
- ✅ Cas où `githubService` lève une exception et mise à jour cohérente du state

#### **useSelectableUsers.test.ts**

Tests couvrant :

- ✅ Initialisation avec `sourceUsers` et reset de `selectedIds`
- ✅ Mise à jour de `displayedUsers` et reset de `selectedIds` quand `sourceUsers` change
- ✅ `toggleSelect` : ajout puis retrait d'un ID
- ✅ `isAllSelected` : true quand tous les utilisateurs sont sélectionnés
- ✅ `toggleSelectAll` : sélectionne tous puis désélectionne tous
- ✅ `deleteSelected` : supprime uniquement les utilisateurs sélectionnés et clear `selectedIds`
- ✅ `duplicateSelected` : duplique les utilisateurs sélectionnés avec de nouveaux IDs
- ✅ `toggleEditMode` : inverse `isEditMode`
- ✅ Cas limites : duplication sans sélection, suppression sans sélection, duplication avec liste vide

### Tests des Composants Atoms

#### **SearchInput.test.tsx**

Tests couvrant :

- ✅ Rendu d'un input de type text dans un conteneur avec la bonne classe
- ✅ Affichage de la valeur de `query`
- ✅ Mise à jour de la valeur affichée quand la prop `query` change
- ✅ Remontée de la nouvelle valeur via `handleChange`
- ✅ Affichage du placeholder
- ✅ Gestion d'une valeur de query très longue

#### **GenericButton.test.tsx**

Tests couvrant :

- ✅ Rendu d'un `<button>` avec les classes adéquates quand `href` n'est pas fourni
- ✅ Rendu d'un lien avec `role=button` quand `href` est fourni
- ✅ Concaténation correcte des classes avec `className`
- ✅ Utilisation de `aria-label` fourni en priorité
- ✅ Utilisation d'un `aria-label` par défaut pour `viewprofile` et `actionbutton`
- ✅ Application de `target` et `rel` par défaut sur le lien
- ✅ Surcharge de `target` et `rel` sur le lien
- ✅ Appel de `onClick` au clic
- ✅ Désactivation du bouton quand `disabled` vaut true
- ✅ Propagation des props supplémentaires

#### **PageTitle.test.tsx**

Tests couvrant :

- ✅ Affichage du titre quand une string non vide est fournie
- ✅ Entourage du titre dans un conteneur avec la classe `title-container`
- ✅ Pas d'affichage si `title` est une string vide
- ✅ Affichage du texte du titre tel quel (y compris espaces et caractères spéciaux)
- ✅ Gestion d'un titre très long
- ✅ Mise à jour du DOM si la prop `title` change
- ✅ Pas de wrapper inutile autour du conteneur

#### **ToggleSwitch.test.tsx**

Tests couvrant :

- ✅ Rendu d'un checkbox contrôlé dans un label avec la bonne classe
- ✅ État coché quand `isOn` vaut true
- ✅ État décoché quand `isOn` vaut false
- ✅ Mise à jour de l'état quand la prop `isOn` change
- ✅ Appel de `onChange` avec true quand on coche le switch
- ✅ Appel de `onChange` avec false quand on décoche le switch
- ✅ Appel de `onChange` avec la valeur checked calculée par le navigateur

#### **StatusMessage.test.tsx**

Tests couvrant :

- ✅ Affichage du message de chargement quand `loading` est true
- ✅ Pas d'affichage du message de chargement quand `loading` est false ou undefined
- ✅ Affichage du message d'erreur quand `errorMessage` est fourni
- ✅ Pas d'affichage du message d'erreur quand `errorMessage` est null ou undefined
- ✅ Affichage simultané des deux messages si `loading` et `errorMessage` sont présents
- ✅ Gestion d'un message d'erreur vide sans planter (ne rend rien car falsy)
- ✅ Gestion d'un message d'erreur très long sans planter
- ✅ Mise à jour du message d'erreur quand la prop change
- ✅ Mise à jour du message de chargement quand la prop change

### Tests des Composants Molecules

#### **UserCard.test.tsx**

Tests couvrant :

- ✅ Rendu du conteneur principal avec classe `user-card-container`
- ✅ Affichage conditionnel du checkbox selon `isEditMode`
- ✅ État checked/unchecked du checkbox selon la prop `checked`
- ✅ Appel de `onToggle` au clic sur le checkbox
- ✅ Affichage de l'image avatar avec `src=user.avatar_url`
- ✅ Affichage de `user.id` et `user.login` dans le conteneur texte
- ✅ Affichage de `GenericButton` viewprofile avec `href=user.html_url`
- ✅ Cas limites : gestion de `user.id` ou `user.login` undefined

#### **SelectAllComponent.test.tsx**

Tests couvrant :

- ✅ Rendu du label avec classe `label-container`
- ✅ Ajout de la classe `hidden` quand `isEditMode=false`
- ✅ Rendu d'un input checkbox avec classe `select-all-checkbox`
- ✅ État checked/unchecked selon `isAllSelected`
- ✅ Appel de `toggleSelectAll` au clic sur checkbox
- ✅ Affichage du bon texte interpolé avec `selectedIdsLength`
- ✅ Cas limites : texte correct avec 0 éléments, 1 élément (singulier), grand nombre (100)

### Tests des Services et Constantes

#### **githubService.test.ts**

Tests couvrant :

- ✅ Succès API (200) avec données typées
- ✅ Encodage correct de la query dans l'URL
- ✅ Gestion du rate limit (403) avec et sans header `x-ratelimit-reset`
- ✅ Gestion des erreurs de validation (422) avec et sans message custom
- ✅ Gestion des erreurs serveur génériques (5xx)
- ✅ Gestion des erreurs réseau (reject) avec `Error` ou valeur non-`Error`
- ✅ Propagation du `AbortSignal` vers `fetch`

#### **messages.test.ts**

Tests couvrant :

- ✅ Valeurs des messages d'erreur (`ERROR_MESSAGES`)
- ✅ Fonction `SERVER(status)` pour différents codes HTTP
- ✅ Messages UI (`LOADING`, `NO_RESULTS(query)`, `EMPTY_QUERY`)

### Tests des Composants Organisms

#### **SelectionBar.test.tsx**

Tests couvrant :

- ✅ Rendu du conteneur principal avec la classe `selection-bar-container`
- ✅ Affichage du label avec le bon nombre d'éléments selon `isEditMode`
- ✅ Affichage du label sans `hidden` et avec checkbox `select-all` quand `isEditMode=true`
- ✅ Appel de `toggleSelectAll` au changement de la checkbox `select-all`
- ✅ Affichage du `switch-container` avec `ToggleSwitch`
- ✅ Affichage de l'image `editIcon` et du texte "Edit mode"
- ✅ Appel de `handleEditMode` au toggle du switch
- ✅ Masquage des boutons (`buttons-container hidden`) quand `isEditMode=false`
- ✅ Affichage des boutons `GenericButton` avec icônes copy et delete quand `isEditMode=true`
- ✅ Appel de `duplicateSelected` au clic du bouton copy
- ✅ Appel de `onDeleteSelected` au clic du bouton delete
- ✅ Cas limites : 0 éléments sélectionnés, grand nombre d'éléments (100)

## 🚀 Commandes essentielles

### Installation des dépendances

```bash
npm install
```

### Développement

```bash
npm run dev
```

Lance le serveur de développement Vite sur `http://localhost:5173` (ou le port disponible).

### Build de production

```bash
npm run build
```

Compile TypeScript et génère les fichiers de production dans le dossier `dist/`.

### Prévisualisation du build

```bash
npm run preview
```

Prévisualise le build de production localement.

### Tests

#### Lancer tous les tests

```bash
npm test
```

Lance tous les tests avec Vitest en mode watch.

#### Lancer les tests en mode watch

```bash
npm run test:watch
```

Lance les tests en mode watch (re-exécution automatique lors des changements).

#### Lancer les tests avec interface UI

```bash
npm run test:ui
```

Ouvre l'interface graphique de Vitest pour visualiser et exécuter les tests.

### Coverage (Couverture de code)

```bash
npm run coverage
```

Génère un rapport de couverture de code dans le dossier `coverage/`. Le rapport HTML est disponible dans `coverage/index.html`.

### Linting

```bash
npm run lint
```

Vérifie le code avec ESLint selon la configuration du projet.

---

## 📦 Technologies utilisées

- **React 19.2.0** : Bibliothèque UI
- **TypeScript 5.9.3** : Typage statique
- **Vite 7.3.1** : Build tool et serveur de développement
- **Vitest 4.0.18** : Framework de tests
- **React Testing Library 16.3.2** : Utilitaires de test pour React
- **ESLint 9.39.1** : Linter pour la qualité du code

## 📝 Notes

- L'application utilise l'API GitHub publique sans authentification, ce qui peut entraîner des limitations de rate limit.
- Les requêtes sont automatiquement annulées lors d'un changement de query pour éviter les requêtes obsolètes.
- Le debounce de 400ms peut être personnalisé via les options du hook `useGithubUserSearch`.
- La base de tests couvre **pratiquement 100%** du code applicatif (≈99% de statements, 100% de fonctions) grâce à Vitest + reporting V8.
