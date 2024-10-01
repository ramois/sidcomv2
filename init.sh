#!/bin/sh

# Inicializa la base de datos si no está ya inicializada
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    initdb -D "$PGDATA" --username=$POSTGRES_USER --pwfile=<(echo $POSTGRES_PASSWORD)
fi

# Inicia el servidor PostgreSQL
exec postgres -D "$PGDATA"