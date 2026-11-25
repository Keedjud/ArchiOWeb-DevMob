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

Render déploie automatiquement la branche `main` (dossier racine `api`). La base de production est sur MongoDB Atlas ; son URL est définie dans la variable `DATABASE_URL` de Render.
