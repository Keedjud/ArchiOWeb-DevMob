# api

API REST du projet (Express + MongoDB), déployée sur Render. Cours ArchiOWeb.

Pour installer l'environnement et lancer l'API la première fois, voir la section « Préparer son environnement de dev » du [README principal](../README.md).

## Structure

| Chemin         | Rôle                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bin/start.js` | Point d'entrée : connexion à MongoDB puis démarrage du serveur HTTP                                                          |
| `app.js`       | Application Express (middlewares, routes, gestion des erreurs), sans connexion à la base : les tests l'importent directement |
| `config.js`    | Configuration lue depuis les variables d'environnement                                                                       |
| `models/`      | Modèles Mongoose (à venir)                                                                                                   |
| `routes/`      | Routes de l'API (à venir)                                                                                                    |
| `tests/`       | Tests automatisés (`node:test` + `supertest`)                                                                                |
| `compose.yml`  | MongoDB 8.0 en local avec Docker Compose                                                                                     |

## Variables d'environnement

Copier `.env.example` en `.env` (jamais commité). `.env.test` est utilisé par `npm test` et ne contient aucun secret.

| Variable       | Rôle                            | Valeur par défaut                  |
| -------------- | ------------------------------- | ---------------------------------- |
| `PORT`         | Port du serveur HTTP            | `3000`                             |
| `DATABASE_URL` | URL de connexion MongoDB        | `mongodb://127.0.0.1:27017/bomb`   |
| `JWT_SECRET`   | Clé de signature des jetons JWT | aucune (obligatoire en production) |

## Scripts npm

| Commande                | Rôle                                                                            |
| ----------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`           | Lance l'API en mode développement (redémarre à chaque modification, lit `.env`) |
| `npm start`             | Lance l'API (production, Render)                                                |
| `npm test`              | Lance les tests avec `.env.test`                                                |
| `npm run test:coverage` | Tests + rapport de couverture (texte et HTML dans `coverage/`)                  |
| `npm run lint`          | Vérifie le code avec ESLint                                                     |
| `npm run format`        | Formate le code avec Prettier                                                   |
| `npm run format:check`  | Vérifie le formatage sans rien modifier (utilisé par la CI)                     |

## Accéder à la base

MongoDB doit tourner (`docker compose up -d`).

- En ligne de commande : `docker compose exec mongo mongosh bomb`
- Dans VS Code : extension **MongoDB for VS Code**, connexion à `mongodb://127.0.0.1:27017`
