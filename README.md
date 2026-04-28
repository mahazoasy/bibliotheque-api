# API Bibliothèque - NestJS + MongoDB (avec OpenAI & Stripe)

## Installation
1. Cloner le dépôt
2. `npm install`
3. Créer un fichier `.env` à partir de `.env.example` (voir ci-dessous)
4. Démarrer MongoDB localement (ou utiliser MongoDB Atlas)
5. Démarrer le serveur : `npm run start:dev`

## Configuration requise (nouvelles variables)
Ajoutez ces lignes à votre fichier `.env` :

```env
# OpenAI (ou alternative gratuite via Google AI Studio)
OPENAI_API_KEY=AIza... # ou sk-...
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_MODEL=gemini-2.0-flash

# Stripe (mode test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (récupéré après création du webhook)