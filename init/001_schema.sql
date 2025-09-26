-- conecta no DB alvo (o entrypoint cria POSTGRES_DB = farol_db)
\connect farol_db;

CREATE TABLE IF NOT EXISTS public.properties (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  property_type TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  price         NUMERIC(12,2) NOT NULL,
  rooms         INT NOT NULL,
  bathrooms     INT NOT NULL,
  garages       INT NOT NULL,
  street        TEXT,
  street_number TEXT,
  neighborhood  TEXT,
  city          TEXT,
  state         TEXT,
  country       TEXT,
  postal_code   TEXT,
  amenities     JSONB,
  photos        JSONB
);

-- índices/constraints com IF NOT EXISTS quando possível
CREATE INDEX IF NOT EXISTS idx_properties_rooms ON public.properties(rooms);
