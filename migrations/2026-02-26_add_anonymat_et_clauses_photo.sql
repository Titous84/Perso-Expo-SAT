-- Migration SQL pour bases DEV/PROD basées sur exposat.sql
-- Ajoute l'anonymisation des participants et les clauses de consentement photo.
-- @author Nathan Reyes

ALTER TABLE `users`
    ADD COLUMN `is_anonymous` TINYINT(1) NOT NULL DEFAULT 0 AFTER `picture_consent`,
    ADD COLUMN `photo_consent_clause` ENUM('publication', 'usage_interne', 'refus_total') NOT NULL DEFAULT 'refus_total' AFTER `is_anonymous`;

-- Optionnel: harmoniser les données existantes avec la nouvelle clause.
-- 1 = consentement existant => publication, 0 => refus_total.
UPDATE `users`
SET `photo_consent_clause` = CASE
    WHEN `picture_consent` = 1 THEN 'publication'
    ELSE 'refus_total'
END
WHERE `role_id` = 3;
