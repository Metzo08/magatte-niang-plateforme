-- ============================================
-- SCRIPT CONFIGURATION POSTGRESQL
-- Copier TOUT ce code et l'exécuter dans pgAdmin
-- VERSION CORRIGÉE (sans sauts de ligne dans CREATE USER)
-- ============================================

-- 1. Supprimer l'utilisateur s'il existe déjà
DROP ROLE IF EXISTS magatte_niang;

-- 2. Créer l'utilisateur avec mot de passe (TOUT SUR UNE LIGNE)
CREATE USER magatte_niang WITH PASSWORD 'senecarte' LOGIN CREATEDB CREATEROLE SUPERUSER;

-- 3. Donner tous les privilèges sur la base postgres
GRANT ALL PRIVILEGES ON DATABASE postgres TO magatte_niang;

-- 4. Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO magatte_niang;

-- 5. Donner les privilèges sur toutes les tables existantes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magatte_niang;

-- 6. Donner les privilèges sur toutes les séquences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO magatte_niang;

-- 7. Donner les privilèges sur toutes les fonctions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO magatte_niang;

-- 8. Privilèges par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO magatte_niang;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO magatte_niang;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO magatte_niang;

-- 9. Vérifier que l'utilisateur est bien créé
SELECT usename AS "Utilisateur", usecreatedb AS "Peut créer DB", usesuper AS "Superuser" FROM pg_user WHERE usename = 'magatte_niang';

-- ============================================
-- RÉSULTAT ATTENDU :
-- Utilisateur : magatte_niang
-- Peut créer DB : t (true)
-- Superuser : t (true)
-- ============================================
