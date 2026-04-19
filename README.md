# API Bibliothèque - NestJS + MongoDB

## Installation
1. Cloner le dépôt
2. `npm install`
3. Créer un fichier `.env` (voir `.env.example`)
4. Démarrer MongoDB localement (ou utiliser MongoDB Atlas)
5. `npm run start:dev`

## Endpoints
Base URL: `http://localhost:3000/api/v1`

Documentation Swagger: `http://localhost:3000/api/documentation`

## Seeders (données initiales)
Vous pouvez exécuter un script manuel ou utiliser des migrations. Exemple :
```javascript
// dans un script seed.ts
// Crée 3 auteurs, 5 livres, 2 emprunts