# LauFlashCards

Application desktop de flashcards avec répétition espacée (algorithme SM-2), développée avec Tauri, Rust et React.

## Stack technique

- **Frontend** : React + TypeScript + Vite
- **Backend** : Rust (via Tauri 2)
- **Base de données** : SQLite (locale, via `tauri-plugin-sql`)
- **Distribution** : GitHub Actions (build Windows + macOS automatique)

## Prérequis (environnement de développement)

### Windows

1. **Rust** — via l'installeur officiel :
```powershell
   curl.exe -o rustup-init.exe https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe
   .\rustup-init.exe
```
   Vérifier : `rustc --version` et `cargo --version`

2. **Node.js** (LTS) :
```powershell
   winget install OpenJS.NodeJS.LTS
```
   Vérifier : `node --version` et `npm --version`

3. **Microsoft C++ Build Tools** (requis pour compiler les dépendances natives Rust) :
```powershell
   winget install Microsoft.VisualStudio.2022.BuildTools --override "--wait --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```
   Vérifier via le **Visual Studio Installer** que le composant "Desktop development with C++" est bien installé.

4. **WebView2** (normalement déjà présent sur Windows 10/11 à jour) :
```powershell
   winget install Microsoft.EdgeWebView2Runtime
```

> **Important** : après chaque installation, fermer complètement le terminal (et VS Code) avant de vérifier les commandes, sinon le PATH ne sera pas à jour.

### Éditeur recommandé

**VS Code** avec les extensions :
- `rust-analyzer`
- `Tauri` (extension officielle)
- `ES7+ React/Redux/React-Native snippets`
- `Prettier`

## Installation du projet

```bash
git clone <url-du-repo>
cd LauFlashCards
npm install
```

## Lancer en développement

```bash
npm run tauri dev
```

Ouvre une fenêtre native avec hot-reload sur les changements React. Le terminal affiche aussi les logs de compilation Rust.

Pour inspecter la webview (console JS, erreurs) : clic droit dans la fenêtre de l'app → **Inspecter**.

## Base de données

- SQLite local, créé et migré automatiquement au lancement (voir `src-tauri/src/main.rs`)
- Emplacement du fichier `.db` sur Windows :
%APPDATA%<identifier-tauri.conf.json>\lauflashcards.db

- Pour l'inspecter : DBeaver, DB Browser for SQLite, ou l'extension VS Code SQLite Viewer

### Schéma

- `decks` : id, name, description, created_at
- `cards` : id, deck_id, front, back, created_at, et les colonnes SM-2 (`ease_factor`, `interval_days`, `repetitions`, `next_review_date`)

## Build local (test avant release)

```bash
npm run tauri build
```

Génère les exécutables dans `src-tauri/target/release/bundle/` :
- Windows : `.msi` / `.exe`
- macOS : `.dmg` / `.app`

## Build et distribution via GitHub Actions

Le workflow `.github/workflows/release.yml` compile automatiquement les exécutables Windows et macOS (Intel + Apple Silicon) sur les runners GitHub, sans nécessiter de Mac physique.

### Prérequis GitHub (à faire une seule fois)

Dans **Settings → Actions → General → Workflow permissions**, sélectionner **Read and write permissions** (nécessaire pour que le workflow puisse créer une release).

### Déclencher un build

```bash
git tag v0.1.0
git push origin v0.1.0
```

Tout tag commençant par `v` déclenche le workflow.

### Suivre le build

Onglet **Actions** du repo GitHub → 3 jobs (Windows, macOS Apple Silicon, macOS Intel).

### Récupérer les exécutables

Une fois les jobs terminés (~5-15 min), onglet **Releases** → une release en brouillon contient les fichiers `.msi`/`.exe` et `.dmg` en pièces jointes. Cliquer sur **Publish release** pour la rendre publique et partageable.

### Pour livrer une nouvelle version

```bash
git tag v0.2.0
git push origin v0.2.0
```

## Notes pour l'utilisateur final (macOS)

L'application n'étant pas signée par un compte développeur Apple, macOS affichera un avertissement Gatekeeper au premier lancement ("développeur non identifié"). L'utilisateur doit faire **clic droit → Ouvrir** au lieu d'un double-clic simple.

## Fonctionnalités

- Gestion de paquets (decks) de flashcards : création, suppression
- Gestion de cartes (recto/verso) au sein d'un paquet
- Mode révision avec répétition espacée (SM-2) : les cartes dues sont présentées en priorité, l'intervalle avant la prochaine révision s'ajuste selon la réponse (Encore / Difficile / Facile)
- Réinitialisation manuelle de la progression d'un paquet
- Interface avec flip 3D des cartes en mode révision

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## TO DO

**Deck Details Page** : 
   - When the deck description is too long and the window is too small, you can't see the cards anymore.
   - Add a deck review mode with a quizz.