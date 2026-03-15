# Contribuer a FlowState

Merci de votre interet pour FlowState ! Ce guide vous explique comment contribuer au projet.

## Prerequis

- Un **navigateur moderne** (Chrome, Firefox, Edge, Safari - derniere version)
- **Git** installe sur votre machine
- **Docker** (optionnel, pour tester le deploiement containerise)
- Un serveur HTTP local (XAMPP, Live Server, `python -m http.server`, etc.)

## Installation locale

1. **Forkez** le repository sur GitHub
2. **Clonez** votre fork :
   ```bash
   git clone https://github.com/votre-username/productivity-hub.git
   cd productivity-hub
   ```
3. **Lancez** un serveur local :
   - **XAMPP** : copiez le dossier dans `htdocs/` et ouvrez `http://localhost/productivity-hub/`
   - **Docker** : `docker-compose up -d` puis ouvrez `http://localhost:3333`
   - **Python** : `python -m http.server 8080` puis ouvrez `http://localhost:8080`
4. **Creez** une branche pour votre contribution :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

## Guidelines de code

### JavaScript
- **Vanilla JS uniquement** — pas de framework (React, Vue, Angular, etc.)
- **ES Modules** (`import`/`export`) pour l'organisation du code
- **Nommage** : `camelCase` pour les variables et fonctions, `PascalCase` pour les classes
- Utilisez `const` par defaut, `let` si necessaire, jamais `var`
- Commentez les fonctions complexes avec JSDoc
- Pas de dependances externes — tout est fait maison

### CSS
- **Convention BEM-ish** : `.block__element--modifier`
- **Custom Properties** (variables CSS) pour les couleurs et espacements
- Utilisez les unites relatives (`rem`, `em`, `%`, `vh`, `vw`) plutot que `px`
- **Mobile-first** : ecrivez d'abord pour mobile, puis ajoutez les media queries
- Gardez les animations performantes (`transform`, `opacity`)

### HTML
- HTML5 semantique (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Attributs `aria-*` pour l'accessibilite
- Pas de styles inline

### General
- Indentation : **2 espaces**
- Pas de `console.log` en production (utilisez un systeme de debug conditionnel)
- Testez sur Chrome, Firefox et Safari avant de soumettre

## Pull Requests

### Processus

1. Assurez-vous que votre branche est a jour avec `main` :
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Verifiez que tout fonctionne correctement dans votre navigateur
3. Redigez un message de commit clair et descriptif :
   ```
   feat: ajouter le mode sombre automatique

   - Detection des preferences systeme via prefers-color-scheme
   - Transition animee entre les themes
   - Sauvegarde du choix dans localStorage
   ```
4. Poussez votre branche et ouvrez une Pull Request
5. Decrivez vos changements dans la PR :
   - **Quoi** : description des modifications
   - **Pourquoi** : motivation et contexte
   - **Comment** : approche technique
   - **Captures d'ecran** : si modifications visuelles

### Convention de commits

Utilisez les prefixes suivants :
- `feat:` — nouvelle fonctionnalite
- `fix:` — correction de bug
- `style:` — changements CSS/visuels
- `refactor:` — refactorisation de code
- `docs:` — documentation
- `perf:` — amelioration de performance
- `a11y:` — amelioration d'accessibilite

## Signaler un bug

Ouvrez une **Issue** avec les informations suivantes :

```
### Description du bug
[Description claire et concise du probleme]

### Etapes pour reproduire
1. Aller sur '...'
2. Cliquer sur '...'
3. Faire defiler jusqu'a '...'
4. Observer l'erreur

### Comportement attendu
[Ce qui devrait se passer]

### Comportement observe
[Ce qui se passe reellement]

### Captures d'ecran
[Si applicable, ajoutez des captures d'ecran]

### Environnement
- Navigateur : [ex. Chrome 120]
- OS : [ex. Windows 11]
- Resolution : [ex. 1920x1080]
```

## Proposer une fonctionnalite

Ouvrez une **Issue** avec le label `enhancement` :

```
### Description de la fonctionnalite
[Description claire de ce que vous proposez]

### Motivation
[Pourquoi cette fonctionnalite serait utile ?]

### Solution proposee
[Comment vous envisagez l'implementation]

### Alternatives considerees
[Autres approches possibles]

### Maquettes / Wireframes
[Si applicable, ajoutez des visuels]
```

## Structure du projet

Avant de contribuer, familiarisez-vous avec la structure :

```
productivity-hub/
├── index.html          # Point d'entree principal
├── css/                # Styles (glassmorphism, animations)
├── js/                 # Modules ES (timer, tasks, notes, xp...)
├── assets/             # Images, sons, icones
└── docker-compose.yml  # Configuration Docker
```

## Code de conduite

- Soyez respectueux et bienveillant
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour le projet
- Montrez de l'empathie envers les autres contributeurs

---

Merci de contribuer a FlowState !
