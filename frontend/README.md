# Frontend — ReactJS

Single-page application built with React 18, served by Nginx in production.

## Files

```
frontend/
├── src/
│   ├── App.js                    # Root component
│   ├── App.css                   # Global dark theme styles
│   ├── index.js                  # React DOM entry point
│   ├── components/
│   │   ├── TodoForm.js           # Create / edit form
│   │   ├── TodoItem.js           # Individual task card
│   │   └── FilterBar.js         # Status/priority filters + stats
│   ├── pages/
│   │   └── TodoPage.js          # Main page, state management
│   └── services/
│       └── todoService.js       # API calls (fetch wrapper)
├── package.json
├── Dockerfile                   # Multi-stage: build → nginx:alpine
└── nginx.conf                   # SPA fallback + /api proxy
```

## Run locally

```bash
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
# → http://localhost:3000
```

## Build for production

```bash
npm run build   # outputs to build/
```

## Docker

```bash
docker build \
  --build-arg REACT_APP_API_URL=/api \
  -t todo-frontend .

docker run -p 3000:80 todo-frontend
```

## Environment variables

| Variable             | Default                    | Description         |
|----------------------|----------------------------|---------------------|
| REACT_APP_API_URL    | http://localhost:5000/api  | Backend API base URL|

In Docker/K8s the Nginx proxy rewrites `/api/*` → `backend:5000`, so set `REACT_APP_API_URL=/api` at build time.
