Backend — Python Flask API
REST API serving all todo operations, backed by PostgreSQL via SQLAlchemy.

Files

```bash
backend/
├── app.py           # Flask app, routes, CORS
├── models.py        # SQLAlchemy Todo model
├── config.py        # Config from environment variables
├── requirements.txt # Python dependencies
└── Dockerfile       # Gunicorn + non-root user
```

API endpoints

```bash
MethodPathDescriptionGET/api/healthHealth checkGET/api/todosList (filterable)POST/api/todosCreateGET/api/todos/:idGet singlePUT/api/todos/:idFull updatePATCH/api/todos/:id/toggleToggle statusDELETE/api/todos/:idDelete
Query params: ?status=pending|in_progress|completed ?priority=low|medium|high
```
Run locally
```bash
bashpip install -r requirements.txt

export DB_HOST=localhost DB_PORT=5432 \
       DB_NAME=tododb DB_USER=postgres DB_PASSWORD=postgres
python app.py
# → http://localhost:5000/api/health
```

Docker
```bash
bashdocker build -t todo-backend .
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=postgres \
  todo-backend
Environment variables
VariableDefaultDescriptionDB_HOSTlocalhostPostgreSQL hostDB_PORT5432PostgreSQL portDB_NAMEtododbDatabase nameDB_USERpostgresDB usernameDB_PASSWORDpostgresDB passwordSECRET_KEYdev-keyFlask secret key
```
