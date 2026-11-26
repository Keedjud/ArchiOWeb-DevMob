# api

API REST du projet (Express + MongoDB), déployée sur Render. Cours ArchiOWeb.

## Lancer l'API en local

Depuis la racine du repo :

```bash
docker compose up -d
cd api
npm install
npm run dev
```

L'API répond sur http://localhost:3000.

## Variables d'environnement

| Variable       | Rôle                     | Par défaut                 |
| -------------- | ------------------------ | -------------------------- |
| `DATABASE_URL` | URL de connexion MongoDB | `mongodb://127.0.0.1/bomb` |
| `PORT`         | Port d'écoute du serveur | `3000`                     |

## Déploiement

L'API de production est accessible sur https://bomb-api-r1z2.onrender.com.

Render déploie automatiquement la branche `main` (dossier racine `api`). La base de production est sur MongoDB Atlas ; son URL est définie dans la variable `DATABASE_URL` de Render.

En offre gratuite, Render met le service en veille après 15 minutes sans requête : la première requête après une pause peut prendre environ une minute.

Pour développer, chacun utilise sa base MongoDB locale (`docker compose up -d`), jamais la base de production.
