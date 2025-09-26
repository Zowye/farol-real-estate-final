\connect farol_db;

-- 020_seed_more.sql
-- Insere 6 imóveis reais, evitando duplicatas por (name, street, street_number)

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Apartamento Bela Vista 2 Dorms',
  'Apto arejado próximo à Av. Paulista.',
  'apartment','rent', 3200, 2, 1, 1,
  'Rua Maestro Cardim','500','Bela Vista','São Paulo','SP','BR','01323-000',
  '["elevator","balcony","concierge"]'::jsonb,
  '["https://picsum.photos/seed/apt1/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Apartamento Bela Vista 2 Dorms' AND p.street='Rua Maestro Cardim' AND p.street_number='500'
);

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Casa Jardim das Américas 3 Suítes',
  'Casa ampla com quintal e espaço gourmet.',
  'house','sale', 1250000, 3, 3, 2,
  'Rua Prof. João Doetzer','1200','Jd. das Américas','Curitiba','PR','BR','81520-000',
  '["backyard","bbq","suite"]'::jsonb,
  '["https://picsum.photos/seed/casa1/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Casa Jardim das Américas 3 Suítes' AND p.street='Rua Prof. João Doetzer' AND p.street_number='1200'
);

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Studio Copacabana Próx. Praia',
  'Studio mobiliado a 2 quadras da praia.',
  'apartment','rent', 2800, 1, 1, 0,
  'Rua Santa Clara','50','Copacabana','Rio de Janeiro','RJ','BR','22041-012',
  '["furnished","24h-security","elevator"]'::jsonb,
  '["https://picsum.photos/seed/studio1/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Studio Copacabana Próx. Praia' AND p.street='Rua Santa Clara' AND p.street_number='50'
);

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Cobertura Vila Madalena 3 Dorms',
  'Cobertura com vista, terraço e churrasqueira.',
  'apartment','sale', 2350000, 3, 3, 2,
  'Rua Wisard','200','Vila Madalena','São Paulo','SP','BR','05434-000',
  '["terrace","bbq","view"]'::jsonb,
  '["https://picsum.photos/seed/cobertura1/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Cobertura Vila Madalena 3 Dorms' AND p.street='Rua Wisard' AND p.street_number='200'
);

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Loft Centro BH Reformado',
  'Loft com pé-direito alto, reformado.',
  'apartment','sale', 480000, 1, 1, 1,
  'Rua da Bahia','900','Centro','Belo Horizonte','MG','BR','30160-011',
  '["renovated","high-ceiling","garage"]'::jsonb,
  '["https://picsum.photos/seed/loft1/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Loft Centro BH Reformado' AND p.street='Rua da Bahia' AND p.street_number='900'
);

INSERT INTO public.properties
  (name, description, property_type, contract_type, price, rooms, bathrooms, garages,
   street, street_number, neighborhood, city, state, country, postal_code, amenities, photos)
SELECT
  'Casa Alphaville 4 Suítes',
  'Casa em condomínio com lazer completo.',
  'house','sale', 3200000, 4, 5, 3,
  'Alameda Tucunaré','300','Alphaville','Santana de Parnaíba','SP','BR','06541-060',
  '["condo","pool","security"]'::jsonb,
  '["https://picsum.photos/seed/casa2/800/600"]'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.properties p
  WHERE p.name='Casa Alphaville 4 Suítes' AND p.street='Alameda Tucunaré' AND p.street_number='300'
);
