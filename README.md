# BOMB

Application mobile de « bombes » géolocalisées, développée dans le cadre des cours **ArchiOWeb** (API REST) et **DevMob** (application mobile temps réel) à la HEIG-VD.

## Concept

- Un joueur pose une **bombe géolocalisée** contenant un message, visant tous ses ennemis ou un groupe d'ennemis.
- Les bombes sont **invisibles** pour les cibles. Quand un ennemi visé passe physiquement dans la zone (~20 m), il reçoit une notification ; la bombe explose (avec animation) à l'ouverture de l'app. Une bombe n'explose **qu'une seule fois**.
- On ajoute un **ennemi uniquement en face à face** : les deux joueurs appuient en même temps sur « Ajouter un ennemi » et le serveur les associe en temps réel. La relation est mutuelle.
- Un **groupe d'ennemis** se crée avec au moins 3 personnes présentes ensemble ; les ajouts suivants se font aussi en face à face.
- L'amorçage des bombes, la limite de bombes par jour et le désamorçage sont encore en discussion.

## Structure du repo

| Dossier | Contenu | Technologies |
|---|---|---|
| `api/` | API REST, déployée sur Render | Node.js, Express, MongoDB |
| `app/` | Application mobile | Vue, Capacitor |
| `docs/` | UML, modèle de données, doc de l'API | |
| `.github/workflows/` | Intégration continue (GitHub Actions) | |

## Préparer son environnement de dev

Toute l'équipe est sous Windows : on développe **dans WSL 2 (Ubuntu)**, pour avoir le même environnement Linux que la CI et Render. Les étapes ci-dessous sont à faire une seule fois.

### 1. WSL 2 et Ubuntu 24.04

Dans un PowerShell Windows :

```powershell
wsl --install -d Ubuntu-24.04
```

Redémarrer si demandé, puis créer l'utilisateur Ubuntu. Ensuite, **travailler dans le système de fichiers Linux** (par exemple `~/dev`) et pas sous `/mnt/c/...` : c'est beaucoup plus rapide et ça évite les problèmes de fins de ligne et de droits.

```bash
mkdir -p ~/dev
```

### 2. Git et GitHub CLI

```bash
sudo apt update && sudo apt install -y git gh
git config --global user.name "Prénom Nom"
git config --global user.email "adresse@exemple.ch"
gh auth login
```

### 3. Node.js 26 (via nvm)

Installer [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) avec la commande officielle (voir le lien pour la dernière version), puis relancer le terminal :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Une fois le repo cloné (étape 6), installer la version de Node indiquée dans `.nvmrc` :

```bash
nvm install
nvm use
node -v
```

[fnm](https://github.com/Schniz/fnm) ou [mise](https://mise.jdx.dev/) conviennent aussi : ils lisent le même fichier `.nvmrc`.

### 4. Docker

MongoDB tourne en local dans un conteneur Docker. Deux options :

- **Docker Desktop** pour Windows, avec l'intégration WSL activée (*Settings → Resources → WSL integration → Ubuntu-24.04*).
- **Docker Engine directement dans WSL** : suivre la [doc officielle pour Ubuntu](https://docs.docker.com/engine/install/ubuntu/), puis autoriser son utilisateur et relancer WSL (`wsl --shutdown` dans PowerShell) :

  ```bash
  sudo usermod -aG docker $USER
  ```

Vérifier :

```bash
docker run --rm hello-world
docker compose version
```

### 5. VS Code

- Installer [VS Code](https://code.visualstudio.com/) côté Windows et l'extension **WSL** (`ms-vscode-remote.remote-wsl`).
- Ouvrir le projet via **« Connect to WSL »** (icône en bas à gauche), puis *File → Open Folder* sur `~/dev/ArchiOWeb-DevMob`, ou taper `code .` dans le dossier depuis le terminal WSL.
- Accepter les **extensions recommandées** proposées à l'ouverture (voir `.vscode/extensions.json`) : EditorConfig, ESLint, Prettier, MongoDB.
- Le fichier `.editorconfig` impose les mêmes réglages de base à toute l'équipe (indentation, encodage, fins de ligne). Il ne s'applique qu'aux fichiers de ce repo. Sur WebStorm / IntelliJ, EditorConfig est pris en charge nativement.
- `.vscode/settings.json` active le formatage automatique avec Prettier à l'enregistrement.

Astuce : si `code .` ne fonctionne pas dans WSL, vérifier que `appendWindowsPath` n'est pas à `false` dans `/etc/wsl.conf`, ou ajouter le dossier `bin` de VS Code à son `PATH`.

### 6. Cloner le repo

```bash
gh repo clone Keedjud/ArchiOWeb-DevMob ~/dev/ArchiOWeb-DevMob
cd ~/dev/ArchiOWeb-DevMob
nvm install
```

### 7. Lancer l'API

```bash
cd api
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000> : la réponse doit être `{"name":"BOMB API","status":"ok"}`. Le serveur redémarre tout seul à chaque modification. `docker compose stop` arrête MongoDB (les données sont conservées).

### 8. Lancer les tests

Depuis `api/` :

```bash
npm test
npm run test:coverage
```

Le rapport de couverture HTML est généré dans `api/coverage/`.

### Dépannage

- **Port 27017 déjà utilisé** : un autre MongoDB tourne déjà (service local ou autre conteneur). L'arrêter, ou voir ce qui l'occupe avec `docker ps` / `sudo ss -ltnp | grep 27017`.
- **`permission denied` en lançant `docker`** : l'utilisateur n'est pas dans le groupe `docker`. Faire `sudo usermod -aG docker $USER`, puis `wsl --shutdown` dans PowerShell et rouvrir le terminal.
- **`node: command not found`** ou mauvaise version : relancer le terminal, puis `nvm use` dans le repo.

## Workflow d'équipe

### Branches

- `main` : version déployée. On n'y pousse jamais directement.
- `develop` : branche d'intégration, où l'on teste l'ensemble.
- `feature/<description>` : une nouvelle fonctionnalité (ex. `feature/pose-bombe`).
- `fix/<description>` : la correction d'un bug (ex. `fix/notif-double`).

Les branches `feature/` et `fix/` partent toujours de `develop` :

```bash
git switch develop
git pull
git switch -c feature/ma-fonctionnalite
```

### Pull requests

1. **Mettre sa branche à jour avant d'ouvrir la PR** en y fusionnant la branche cible (`develop`), puis résoudre les éventuels conflits localement :

   ```bash
   git switch develop
   git pull
   git switch feature/ma-fonctionnalite
   git merge develop
   ```

2. Pousser sa branche puis ouvrir une PR **vers `develop`**, liée à une issue (`Closes #numéro`).
3. Au moins **1 approbation** d'un autre membre est nécessaire pour fusionner.
4. **Une PR qui a des conflits n'est pas reviewée.** C'est à l'auteur de la PR de les résoudre (en refaisant l'étape 1), puis de redemander une review.
5. Pour une mise en production, ouvrir une PR **`develop` → `main`** : elle demande 1 approbation et que le check CI `build` passe.
6. Supprimer la branche une fois fusionnée.

Les règles sont imposées par les rulesets GitHub de `main` et `develop` (pas de suppression, pas de force-push, merge uniquement par PR).

### Messages de commit

Courts, au présent, préfixés par le type de changement :

- `feat: pose d'une bombe géolocalisée`
- `fix: notification envoyée deux fois`
- `docs: ajout du diagramme UML`
- `chore: configuration de la CI`

## Backlog et bugs

Les tâches et les bugs sont suivis dans les **issues GitHub** de ce repo, organisées sur un tableau GitHub Projects (À faire / En cours / Terminé). Une PR qui résout une issue la référence avec `Closes #numéro` pour la fermer automatiquement.
