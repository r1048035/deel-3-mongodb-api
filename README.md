# Chat API (MongoDB)

Basic JSON API voor live chat, met JSend responses en MongoDB.

## Setup

1. Kopieer `.env.example` naar `.env`
2. Vul je MongoDB Atlas connection string in bij `MONGODB_URI`
3. Installeer dependencies en start:

```bash
npm install
npm run dev
```

API draait op `http://localhost:3000`

## Routes

| Method | Route | Beschrijving |
|--------|-------|--------------|
| GET | `/api/v1/messages` | Alle berichten |
| GET | `/api/v1/messages/:id` | Eén bericht op id |
| POST | `/api/v1/messages` | Nieuw bericht |
| PUT | `/api/v1/messages/:id` | Bericht updaten |
| DELETE | `/api/v1/messages/:id` | Bericht verwijderen |
| GET | `/api/v1/messages?user=username` | Berichten van één user |

### POST body (Postman)

```json
{
  "message": {
    "user": "Pikachu",
    "text": "nodejs isn't hard, or is it?"
  }
}
```

## Deploy (Render / Vercel)

1. Zet `MONGODB_URI` als environment variable
2. Start command: `npm start`
3. Test op: https://f4rdq2.csb.app/
