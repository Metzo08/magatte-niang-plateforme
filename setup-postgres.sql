-- ============================================
-- Script de configuration PostgreSQL
-- Plateforme Magatte Niang Expert
-- ============================================
-- 
-- INSTRUCTIONS:
-- 1. Ouvrir pgAdmin
-- 2. Se connecter au serveur PostgreSQL avec l'utilisateur "postgres"
-- 3. Cliquer droit sur "PostgreSQL 17" → "Query Tool"
-- 4. Copier-coller TOUT ce fichier
-- 5. Cliquer sur Execute (F5)
-- ============================================

-- Supprimer l'utilisateur s'il existe déjà (pour éviter les erreurs)
DROP ROLE IF EXISTS magatte_niang;

-- Créer l'utilisateur magatte_niang
CREATE USER magatte_niang WITH 
    PASSWORD 'senecarte'
    LOGIN
    CREATEDB;

-- Message de confirmation
DO $$ 
BEGIN 
    RAISE NOTICE 'Utilisateur magatte_niang créé avec succès !';
END $$;

-- Donner tous les privilèges sur la base postgres
GRANT ALL PRIVILEGES ON DATABASE postgres TO magatte_niang;

-- Se connecter à la base postgres pour donner les privilèges sur le schéma
\c postgres

-- Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO magatte_niang;

-- Donner les privilèges sur toutes les tables existantes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magatte_niang;

-- Donner les privilèges sur toutes les séquences (pour les IDs auto-incrémentés)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO magatte_niang;

-- Donner les privilèges par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON TABLES TO magatte_niang;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON SEQUENCES TO magatte_niang;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON FUNCTIONS TO magatte_niang;

-- Vérifier que l'utilisateur est bien créé
SELECT 
    usename AS "Nom d'utilisateur",
    usecreatedb AS "Peut créer des bases",
    usesuper AS "Est superutilisateur"
FROM pg_user 
WHERE usename = 'magatte_niang';

-- Message final
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Configuration terminée avec succès !';
    RAISE NOTICE '✅ Utilisateur: magatte_niang';
    RAISE NOTICE '✅ Mot de passe: senecarte';
    RAISE NOTICE '✅ Base de données: postgres';
    RAISE NOTICE '';
    RAISE NOTICE '▶ Prochaine étape: Ouvrir PowerShell et exécuter:';
    RAISE NOTICE '   cd "c:\Users\hp\Downloads\magatte_niang_plateforme"';
    RAISE NOTICE '   npx prisma db push';
    RAISE NOTICE '   npx tsx prisma/seed.ts';
    RAISE NOTICE '   npm run dev';
END $$;