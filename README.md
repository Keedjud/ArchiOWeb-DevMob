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

## Installation et prérequis

### Éditeur

Le repo contient un fichier `.editorconfig` qui impose les mêmes réglages de base à toute l'équipe (indentation, encodage, fins de ligne). Il ne s'applique qu'aux fichiers de ce repo et ne modifie pas vos réglages personnels.

- **VS Code** : installer l'extension [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) (`EditorConfig.EditorConfig`). VS Code la propose automatiquement à l'ouverture du projet (voir `.vscode/extensions.json`).
- **WebStorm / IntelliJ** : rien à installer, EditorConfig est pris en charge nativement.

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
