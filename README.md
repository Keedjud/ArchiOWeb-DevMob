# BOMB

Application mobile de « bombes » géolocalisées, développée dans le cadre des cours **ArchiOWeb** (API REST) et **DevMob** (application mobile temps réel) à la HEIG-VD.

## Concept

- Un joueur pose une **bombe géolocalisée** contenant un message, visant tous ses ennemis ou un groupe d'ennemis.
- Les bombes sont **invisibles** pour les cibles. Quand un ennemi visé passe physiquement dans la zone (~20 m), il reçoit une notification ; la bombe explose (avec animation) à l'ouverture de l'app. Une bombe n'explose **qu'une seule fois**.
- On ajoute un **ennemi uniquement en face à face** : les deux joueurs appuient en même temps sur « Ajouter un ennemi » et le serveur les associe en temps réel. La relation est mutuelle.
- Un **groupe d'ennemis** se crée avec au moins 3 personnes présentes ensemble ; les ajouts suivants se font aussi en face à face.
- L'amorçage des bombes, la limite de bombes par jour et le désamorçage sont encore en discussion.

## Structure du repo

| Dossier              | Contenu                               | Technologies              |
| -------------------- | ------------------------------------- | ------------------------- |
| `api/`               | API REST, déployée sur Render         | Node.js, Express, MongoDB |
| `app/`               | Application mobile                    | Vue, Capacitor            |
| `docs/`              | UML, modèle de données, doc de l'API  |                           |
| `.github/workflows/` | Intégration continue (GitHub Actions) |                           |
| `compose.yml`        | MongoDB local pour le développement   | Docker Compose            |

## Préparer son environnement de dev

On développe tous **dans WSL 2 (Ubuntu)**, pour avoir le même environnement que la CI et le serveur. Chaque étape commence par une **vérification** : si c'est déjà bon, passer à l'étape suivante.

### 1. WSL 2 et Ubuntu

Vérifier, dans un **PowerShell Windows** :

```powershell
wsl -l -v
```

Il faut une distribution **Ubuntu** (22.04 ou 24.04) avec `VERSION` à **2**.

- Si `VERSION` vaut 1 : `wsl --set-version <nom-de-la-distribution> 2`
- S'il n'y a pas d'Ubuntu : `wsl --install -d Ubuntu-24.04`

Toutes les commandes suivantes se tapent **dans le terminal Ubuntu**. On peut y vérifier sa version avec `lsb_release -d`.

Le code se met dans le Linux (`~/dev`), **jamais sous `/mnt/c/...`** (très lent).

### 2. Git et GitHub CLI

Vérifier :

```bash
git --version
gh auth status
```

Sinon :

```bash
sudo apt update && sudo apt install -y git gh
gh auth login
git config --global user.name "Prénom Nom"
git config --global user.email "adresse@exemple.ch"
```

### 3. Node.js 26

Vérifier (doit afficher `v26.x`) :

```bash
node -v
```

Sinon, installer [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), puis **fermer et rouvrir le terminal** :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
```

Une fois le repo cloné (étape 5), depuis son dossier :

```bash
nvm install
nvm alias default 26
```

`nvm install` lit la version dans le fichier `.nvmrc`. Si vous utilisez déjà un autre outil (fnm, mise, volta…), installez simplement Node 26 avec.

### 4. Docker (en ligne de commande dans WSL)

Docker sert à lancer MongoDB en local. Vérifier :

```bash
docker --version
docker compose version
```

Si Docker Desktop est déjà installé avec l'intégration WSL activée, il n'y a rien à faire. Sinon, installer **Docker Engine** dans Ubuntu (pas besoin de Docker Desktop), en suivant la [doc officielle](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) :

```bash
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Docker a besoin de **systemd** pour démarrer tout seul : `cat /etc/wsl.conf` doit contenir :

```ini
[boot]
systemd=true
```

Sinon, l'ajouter (`sudo nano /etc/wsl.conf`). Puis redémarrer WSL, dans PowerShell : `wsl --shutdown`, et rouvrir le terminal Ubuntu. Tester :

```bash
docker run --rm hello-world
```

### 5. Cloner le repo

```bash
mkdir -p ~/dev
gh repo clone Keedjud/ArchiOWeb-DevMob ~/dev/ArchiOWeb-DevMob
cd ~/dev/ArchiOWeb-DevMob
```

### 6. Lancer MongoDB

À la racine du repo :

```bash
docker compose up -d
docker compose exec mongo mongosh --quiet --eval 'db.runCommand({ping:1})'
```

La deuxième commande doit afficher `{ ok: 1 }`. Pour arrêter MongoDB (les données sont conservées) : `docker compose stop`.

### 7. VS Code

- Installer [VS Code](https://code.visualstudio.com/) côté Windows, avec l'extension **WSL** (`ms-vscode-remote.remote-wsl`).
- Dans le terminal Ubuntu, depuis le repo : `code .`
  (si `code` n'est pas trouvé : ouvrir VS Code → **Connect to WSL** → **Open Folder**).
- Accepter les **extensions recommandées** proposées à l'ouverture (voir `.vscode/extensions.json`).

Le repo contient un fichier `.editorconfig` qui impose les mêmes réglages de base à toute l'équipe (indentation, encodage, fins de ligne). Il ne s'applique qu'aux fichiers de ce repo et ne modifie pas vos réglages personnels. Il est pris en charge par l'extension [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) (recommandée) et nativement par WebStorm / IntelliJ.

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
