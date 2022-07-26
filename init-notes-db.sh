#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE TABLE IF NOT EXISTS Notes (note_id serial PRIMARY KEY,title VARCHAR (50),body VARCHAR (500),created_on VARCHAR (100) NOT NULL,last_modified  VARCHAR (100) NOT NULL);
EOSQL