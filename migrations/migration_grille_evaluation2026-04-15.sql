-- ============================================================================
-- Migration : Mise à jour de la grille d'évaluation GrillePourTous
-- Auteur    : Léandre Kanmegne - H26 
-- Code généré par Claude Sonnet 4.6 Mars 2026
-- Date      : 2026-04-15
-- 
-- Description : Met à jour les critères et sections de la grille d'évaluation
--               selon les spécifications de la cliente (document du 15 avril 2026).
--               Total : 100 points (Animation 30, Intégration 40, Visuelle 15,
--               Originalité 5, Français 10)
--
-- ATTENTION : Ce script supprime toutes les évaluations existantes.
--             À exécuter AVANT l'événement, jamais pendant.
-- ============================================================================

START TRANSACTION;

-- 1. Nettoyer les évaluations existantes (ordre FK : criteria_evaluation → evaluation)
DELETE FROM criteria_evaluation;
DELETE FROM evaluation;

-- 2. Supprimer les anciens critères
DELETE FROM criteria;

-- 3. Supprimer les anciennes sections de la grille GrillePourTous (survey_id = 1)
DELETE FROM rating_section WHERE survey_id = 1;

-- 4. Insérer les nouvelles sections selon la grille de la cliente
INSERT INTO rating_section (name, position, survey_id) VALUES
('ANIMATION', 1, 1),
('INTÉGRATION DES CONNAISSANCES', 2, 1),
('PRÉSENTATION VISUELLE', 3, 1),
('ORIGINALITÉ', 4, 1),
('FRANÇAIS', 5, 1);

-- 5. Insérer les critères avec les pondérations de la cliente
--    On utilise des sous-requêtes pour récupérer les bons rating_section.id
--    indépendamment de l'auto-increment du serveur cible.

-- ANIMATION (30 points total)
INSERT INTO criteria (rating_section_id, criteria, position, max_value, incremental_value) VALUES
((SELECT id FROM rating_section WHERE name = 'ANIMATION' AND survey_id = 1), 'Dynamisme des exposants.es', 1, 5, 1),
((SELECT id FROM rating_section WHERE name = 'ANIMATION' AND survey_id = 1), 'Compréhensibilité des exposants.es', 2, 10, 1),
((SELECT id FROM rating_section WHERE name = 'ANIMATION' AND survey_id = 1), 'Interactions favorisées avec le public et les juges', 3, 5, 1),
((SELECT id FROM rating_section WHERE name = 'ANIMATION' AND survey_id = 1), 'Utilisation de la bonne terminologie', 4, 5, 1),
((SELECT id FROM rating_section WHERE name = 'ANIMATION' AND survey_id = 1), 'Articulation, ton et débit des exposants.es', 5, 5, 1);

-- INTÉGRATION DES CONNAISSANCES (40 points total)
INSERT INTO criteria (rating_section_id, criteria, position, max_value, incremental_value) VALUES
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Connaissance approfondie du sujet', 1, 10, 1),
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Démonstration de la pertinence du sujet', 2, 5, 1),
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Équilibre entre les sections de la présentation', 3, 5, 1),
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Partage du temps entre les exposants.es', 4, 5, 1),
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Regard critique sur la démarche', 5, 10, 1),
((SELECT id FROM rating_section WHERE name = 'INTÉGRATION DES CONNAISSANCES' AND survey_id = 1), 'Capacité de répondre aux questions', 6, 5, 1);

-- PRÉSENTATION VISUELLE (15 points total)
INSERT INTO criteria (rating_section_id, criteria, position, max_value, incremental_value) VALUES
((SELECT id FROM rating_section WHERE name = 'PRÉSENTATION VISUELLE' AND survey_id = 1), 'Qualité du support visuel', 1, 10, 1),
((SELECT id FROM rating_section WHERE name = 'PRÉSENTATION VISUELLE' AND survey_id = 1), 'Utilisation de l''espace de présentation', 2, 5, 1);

-- ORIGINALITÉ (5 points total)
INSERT INTO criteria (rating_section_id, criteria, position, max_value, incremental_value) VALUES
((SELECT id FROM rating_section WHERE name = 'ORIGINALITÉ' AND survey_id = 1), 'Originalité de la démarche', 1, 5, 1);

-- FRANÇAIS (10 points total)
INSERT INTO criteria (rating_section_id, criteria, position, max_value, incremental_value) VALUES
((SELECT id FROM rating_section WHERE name = 'FRANÇAIS' AND survey_id = 1), 'Qualité du français écrit', 1, 5, 1),
((SELECT id FROM rating_section WHERE name = 'FRANÇAIS' AND survey_id = 1), 'Qualité du français oral', 2, 5, 1);

-- 6. Vérification
SELECT rs.name AS section, 
       c.position, 
       c.criteria, 
       c.max_value AS poids
FROM rating_section rs
INNER JOIN criteria c ON c.rating_section_id = rs.id
WHERE rs.survey_id = 1
ORDER BY rs.position, c.position;

SELECT SUM(c.max_value) AS total_points
FROM criteria c
INNER JOIN rating_section rs ON c.rating_section_id = rs.id
WHERE rs.survey_id = 1;

COMMIT;
