-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 15, 2026 at 08:11 PM
-- Server version: 8.0.31
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exposat`
--

-- --------------------------------------------------------

--
-- Table structure for table `acquaintance_conflict`
--

CREATE TABLE `acquaintance_conflict` (
  `id` int NOT NULL,
  `judge_id` int DEFAULT NULL,
  `users_id` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT '1',
  `max_members` int NOT NULL,
  `survey_id` int DEFAULT NULL,
  `acronym` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `activated`, `max_members`, `survey_id`, `acronym`) VALUES
(1, 'Sciences de la vie', 1, 6, 1, 'SN-S'),
(2, 'Sciences physiques', 1, 6, 1, 'SB-P'),
(3, 'SH - Intervention Sociale', 1, 6, 1, 'SH-IS'),
(4, 'SH - Gestion durable des affaires', 1, 6, 1, 'SH-GD'),
(5, 'SH - Relations et développement international', 1, 6, 1, 'SH-RDI'),
(6, 'Tech Informatique', 1, 6, 1, 'Info'),
(7, 'Tech Soins Infirmiers', 1, 6, 1, 'Soins');

-- --------------------------------------------------------

--
-- Table structure for table `categories_judge`
--

CREATE TABLE `categories_judge` (
  `id` int NOT NULL,
  `categories_id` int NOT NULL,
  `judge_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `code_verification`
--

CREATE TABLE `code_verification` (
  `id` int NOT NULL,
  `codeVerification` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tempsAjout` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `code_verification`
--

INSERT INTO `code_verification` (`id`, `codeVerification`, `email`, `tempsAjout`) VALUES
(9, '467728e9482a', 'CODETOVALIDATE', '2026-04-02 19:00:35'),
(11, '923bbd908eb3', 'CODETOVALIDATE', '2026-04-02 19:00:35'),
(12, '4d81fdba16c0', 'CODETOVALIDATE', '2026-04-02 19:00:35'),
(13, '1819cc2327b3', 'CODETOVALIDATE', '2026-04-02 18:45:35'),
(17, '684ab4c3449a', 'CODETOVALIDATE', '2026-04-02 19:05:48'),
(19, '366df824dd3d', 'CODETOVALIDATE', '2026-04-02 19:05:48'),
(20, '2ca00c16eda4', 'CODETOVALIDATE', '2026-04-02 19:05:48'),
(21, '7782b4f9e080', 'CODETOVALIDATE', '2026-04-02 18:50:48'),
(25, 'f658af396db6', 'CODETOVALIDATE', '2026-04-02 19:22:23'),
(27, '7467b68ab1c2', 'CODETOVALIDATE', '2026-04-02 19:22:23'),
(28, '1f4fbcb9f635', 'CODETOVALIDATE', '2026-04-02 19:22:23'),
(29, '8bd6055c6dcb', 'CODETOVALIDATE', '2026-04-02 19:07:23'),
(33, 'ce04be10fc5f', 'CODETOVALIDATE', '2026-04-02 19:30:11'),
(35, '015ab8c11558', 'CODETOVALIDATE', '2026-04-02 19:30:11'),
(36, '45587f8395fc', 'CODETOVALIDATE', '2026-04-02 19:30:11'),
(37, '48bdd7538a49', 'CODETOVALIDATE', '2026-04-02 19:15:11'),
(41, 'e800f82e6374', 'CODETOVALIDATE', '2026-04-02 19:42:03'),
(43, '232310d03345', 'CODETOVALIDATE', '2026-04-02 19:42:04'),
(44, '84571b40e460', 'CODETOVALIDATE', '2026-04-02 19:42:04'),
(45, 'c5209c486168', 'CODETOVALIDATE', '2026-04-02 19:27:04'),
(49, 'f2c76047fbda', 'CODETOVALIDATE', '2026-04-02 19:49:09'),
(51, '28a6880b7024', 'CODETOVALIDATE', '2026-04-02 19:49:09'),
(52, 'fdf9a89dad9c', 'CODETOVALIDATE', '2026-04-02 19:49:09'),
(53, '34c727e127f0', 'CODETOVALIDATE', '2026-04-02 19:34:09'),
(57, '00b0903e598a', 'CODETOVALIDATE', '2026-04-02 19:52:24'),
(59, 'c9c306df80c5', 'CODETOVALIDATE', '2026-04-02 19:52:25'),
(60, '7117a8f609d5', 'CODETOVALIDATE', '2026-04-02 19:52:25'),
(61, '3b34cd502adc', 'CODETOVALIDATE', '2026-04-02 19:37:25'),
(65, '51f71670d12b', 'CODETOVALIDATE', '2026-04-02 19:56:20'),
(67, '63a982a0a2f0', 'CODETOVALIDATE', '2026-04-02 19:56:20'),
(68, 'af9d1603543b', 'CODETOVALIDATE', '2026-04-02 19:56:20'),
(69, '37db5cc2f3b6', 'CODETOVALIDATE', '2026-04-02 19:41:20'),
(73, 'd8dd16cc1a6e', 'CODETOVALIDATE', '2026-04-02 20:04:36'),
(75, 'fff5f068e20b', 'CODETOVALIDATE', '2026-04-02 20:04:36'),
(76, 'fb3b987a1514', 'CODETOVALIDATE', '2026-04-02 20:04:36'),
(77, '37532eed7ac4', 'CODETOVALIDATE', '2026-04-02 19:49:36'),
(81, '8dfa3845a35a', 'CODETOVALIDATE', '2026-04-02 20:09:18'),
(83, 'e4ac15d6e334', 'CODETOVALIDATE', '2026-04-02 20:09:18'),
(84, 'df51754b18e8', 'CODETOVALIDATE', '2026-04-02 20:09:18'),
(85, '5bd57f77a52f', 'CODETOVALIDATE', '2026-04-02 19:54:18'),
(89, '46d638579bd1', 'CODETOVALIDATE', '2026-04-02 20:15:07'),
(91, '03f9b2aac116', 'CODETOVALIDATE', '2026-04-02 20:15:07'),
(92, '9608a157552a', 'CODETOVALIDATE', '2026-04-02 20:15:07'),
(93, 'ca9e52df70fe', 'CODETOVALIDATE', '2026-04-02 20:00:07'),
(97, '836f797c9aa7', 'CODETOVALIDATE', '2026-04-02 20:17:20'),
(99, '5cc639f2ddc6', 'CODETOVALIDATE', '2026-04-02 20:17:20'),
(100, 'e2578dc89036', 'CODETOVALIDATE', '2026-04-02 20:17:20'),
(101, '08b2b8cc270c', 'CODETOVALIDATE', '2026-04-02 20:02:21'),
(105, '8407845aafa5', 'CODETOVALIDATE', '2026-04-02 20:37:30'),
(107, 'a21d7a6dfb91', 'CODETOVALIDATE', '2026-04-02 20:37:30'),
(108, '343c26f07add', 'CODETOVALIDATE', '2026-04-02 20:37:30'),
(109, '7e3a7c84fdbf', 'CODETOVALIDATE', '2026-04-02 20:22:30'),
(113, '0be00da8dd52', 'CODETOVALIDATE', '2026-04-03 22:05:23'),
(115, '50e63c527b45', 'CODETOVALIDATE', '2026-04-03 22:05:23'),
(116, 'fea969d5b1cc', 'CODETOVALIDATE', '2026-04-03 22:05:23'),
(117, 'd14fdf980005', 'CODETOVALIDATE', '2026-04-03 21:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `component_type`
--

CREATE TABLE `component_type` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_person`
--

CREATE TABLE `contact_person` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `contact_person`
--

INSERT INTO `contact_person` (`id`, `name`, `email`) VALUES
(33, 'Enseignant', 'enseignant@cegepvicto.ca'),
(34, 'testenseignant', '2201877@cegepvicto.ca'),
(51, 'sdfsdfsdafda', 'fasdfafa@cegepvicto.ca'),
(52, 'Test Test', 'test@cegepvicto.ca');

-- --------------------------------------------------------

--
-- Table structure for table `contest`
--

CREATE TABLE `contest` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `id` int NOT NULL,
  `rating_section_id` int NOT NULL,
  `criteria` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `position` int NOT NULL,
  `max_value` int NOT NULL DEFAULT '1',
  `incremental_value` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`id`, `rating_section_id`, `criteria`, `position`, `max_value`, `incremental_value`) VALUES
(208, 46, 'Dynamisme des exposants.es', 1, 5, 1),
(209, 46, 'Compréhensibilité des exposants.es', 2, 10, 1),
(210, 46, 'Interactions favorisées avec le public et les juges', 3, 5, 1),
(211, 46, 'Utilisation de la bonne terminologie', 4, 5, 1),
(212, 46, 'Articulation, ton et débit des exposants.es', 5, 5, 1),
(213, 47, 'Connaissance approfondie du sujet', 1, 10, 1),
(214, 47, 'Démonstration de la pertinence du sujet', 2, 5, 1),
(215, 47, 'Équilibre entre les sections de la présentation', 3, 5, 1),
(216, 47, 'Partage du temps entre les exposants.es', 4, 5, 1),
(217, 47, 'Regard critique sur la démarche', 5, 10, 1),
(218, 47, 'Capacité de répondre aux questions', 6, 5, 1),
(219, 45, 'Qualité du support visuel', 1, 10, 1),
(220, 45, 'Utilisation de l\'espace de présentation', 2, 5, 1),
(221, 48, 'Originalité de la démarche', 1, 5, 1),
(222, 49, 'Qualité du français écrit', 1, 5, 1),
(223, 49, 'Qualité du français oral', 2, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `criteria_evaluation`
--

CREATE TABLE `criteria_evaluation` (
  `score` float NOT NULL,
  `evaluation_id` int NOT NULL,
  `criteria_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evaluation`
--

CREATE TABLE `evaluation` (
  `id` int NOT NULL,
  `judge_id` int NOT NULL,
  `teams_id` int NOT NULL,
  `comments` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `survey_id` int NOT NULL,
  `heure` int NOT NULL,
  `est_actif` tinyint DEFAULT NULL,
  `rating_section_id` int DEFAULT NULL,
  `global_score_removed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `info_events`
--

CREATE TABLE `info_events` (
  `id` int NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `beginning` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ending` datetime NOT NULL,
  `event_processed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `judge`
--

CREATE TABLE `judge` (
  `id` int NOT NULL,
  `uuid` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `categories_id` int NOT NULL,
  `users_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_section`
--

CREATE TABLE `rating_section` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `position` int NOT NULL,
  `survey_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rating_section`
--

INSERT INTO `rating_section` (`id`, `name`, `position`, `survey_id`) VALUES
(45, 'PRÉSENTATION VISUELLE', 3, 1),
(46, 'ANIMATION', 1, 1),
(47, 'INTÉGRATION DES CONNAISSANCES', 2, 1),
(48, 'ORIGINALITÉ', 4, 1),
(49, 'FRANÇAIS', 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int NOT NULL,
  `teams_id` int DEFAULT NULL,
  `note` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`) VALUES
(0, 'Admin', ''),
(1, 'Juge', ''),
(3, 'Participants', '');

-- --------------------------------------------------------

--
-- Table structure for table `site_component`
--

CREATE TABLE `site_component` (
  `id` int NOT NULL,
  `type_id` int NOT NULL,
  `picture` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `order` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

CREATE TABLE `survey` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `survey`
--

INSERT INTO `survey` (`id`, `name`) VALUES
(1, 'GrillePourTous');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int NOT NULL,
  `team_number` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `project_picture` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `years` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `categories_id` int DEFAULT NULL,
  `equipments_needed` enum('test') CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT '1',
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `survey_id` int DEFAULT NULL,
  `judge_assignation` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams_contact_person`
--

CREATE TABLE `teams_contact_person` (
  `id` int NOT NULL,
  `teams_id` int NOT NULL,
  `contact_person_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`id`, `time`) VALUES
(1, '09:45:00'),
(2, '10:05:00'),
(57, '08:30:00'),
(58, '08:45:00'),
(60, '09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `pwd` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `numero_da` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `picture_consent` tinyint(1) NOT NULL DEFAULT '0',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `photo_consent_clause` enum('publication','usage_interne','refus_total') COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'refus_total',
  `reset_token` int DEFAULT NULL,
  `activation_token` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT '1',
  `blacklisted` tinyint(1) NOT NULL DEFAULT '0',
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `pwd`, `email`, `numero_da`, `picture`, `picture_consent`, `is_anonymous`, `photo_consent_clause`, `reset_token`, `activation_token`, `activated`, `blacklisted`, `role_id`) VALUES
(1, 'le testeur', 'professionnel', 'test', '$2y$10$nyygSsYkQmGDpxn5kZQrVeKyjDQPfG3tkAV0PdYSylTtX7nhtYevC', 'test@letesteur.test', NULL, '', 0, 0, 'refus_total', NULL, NULL, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users_teams`
--

CREATE TABLE `users_teams` (
  `id` int NOT NULL,
  `teams_id` int NOT NULL,
  `users_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `acquaintance_conflict`
--
ALTER TABLE `acquaintance_conflict`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_conflict_id_idx` (`users_id`),
  ADD KEY `judge_conflict_id_idx` (`judge_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_survey` (`survey_id`);

--
-- Indexes for table `categories_judge`
--
ALTER TABLE `categories_judge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_index` (`categories_id`),
  ADD KEY `judges_index` (`judge_id`);

--
-- Indexes for table `code_verification`
--
ALTER TABLE `code_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `component_type`
--
ALTER TABLE `component_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_person`
--
ALTER TABLE `contact_person`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_evaluation_id` (`rating_section_id`);

--
-- Indexes for table `criteria_evaluation`
--
ALTER TABLE `criteria_evaluation`
  ADD PRIMARY KEY (`evaluation_id`,`criteria_id`),
  ADD KEY `evaluation_criteria` (`evaluation_id`) USING BTREE,
  ADD KEY `criteria_evaluation` (`criteria_id`) USING BTREE;

--
-- Indexes for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questionnaire_juge_id` (`judge_id`),
  ADD KEY `questionnaire_equipe_id` (`teams_id`),
  ADD KEY `survey_index` (`survey_id`),
  ADD KEY `heure_index` (`heure`),
  ADD KEY `evaluation_ibfk_1` (`rating_section_id`);

--
-- Indexes for table `info_events`
--
ALTER TABLE `info_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `judge`
--
ALTER TABLE `judge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compte_juge_id` (`users_id`),
  ADD KEY `categorie_juge_id` (`categories_id`),
  ADD KEY `idx_judge_users_id` (`users_id`),
  ADD KEY `idx_judge_categories_id` (`categories_id`);

--
-- Indexes for table `rating_section`
--
ALTER TABLE `rating_section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_survey` (`survey_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_component`
--
ALTER TABLE `site_component`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_component` (`type_id`);

--
-- Indexes for table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categorie_id` (`categories_id`),
  ADD KEY `teams_survey` (`survey_id`);

--
-- Indexes for table `teams_contact_person`
--
ALTER TABLE `teams_contact_person`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_person_index` (`contact_person_id`),
  ADD KEY `teams_index` (`teams_id`),
  ADD KEY `idx_teams_contact_person_teams_id` (`teams_id`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `idx_users_role_activated` (`role_id`,`activated`),
  ADD KEY `idx_users_role_blacklisted` (`role_id`,`blacklisted`);

--
-- Indexes for table `users_teams`
--
ALTER TABLE `users_teams`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_users_teams` (`users_id`,`teams_id`),
  ADD KEY `compte_id` (`users_id`),
  ADD KEY `equipe_id` (`teams_id`),
  ADD KEY `idx_users_teams_teams_id` (`teams_id`),
  ADD KEY `idx_users_teams_users_id` (`users_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `categories_judge`
--
ALTER TABLE `categories_judge`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `code_verification`
--
ALTER TABLE `code_verification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `component_type`
--
ALTER TABLE `component_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_person`
--
ALTER TABLE `contact_person`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `contest`
--
ALTER TABLE `contest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=236;

--
-- AUTO_INCREMENT for table `info_events`
--
ALTER TABLE `info_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `judge`
--
ALTER TABLE `judge`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `rating_section`
--
ALTER TABLE `rating_section`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `site_component`
--
ALTER TABLE `site_component`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `survey`
--
ALTER TABLE `survey`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `teams_contact_person`
--
ALTER TABLE `teams_contact_person`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=561;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1074;

--
-- AUTO_INCREMENT for table `users_teams`
--
ALTER TABLE `users_teams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1075;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_survey` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories_judge`
--
ALTER TABLE `categories_judge`
  ADD CONSTRAINT `categories_index` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `judges_index` FOREIGN KEY (`judge_id`) REFERENCES `judge` (`id`);

--
-- Constraints for table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `section_evaluation_id` FOREIGN KEY (`rating_section_id`) REFERENCES `rating_section` (`id`);

--
-- Constraints for table `criteria_evaluation`
--
ALTER TABLE `criteria_evaluation`
  ADD CONSTRAINT `criteria_evaluation_ibfk_1` FOREIGN KEY (`criteria_id`) REFERENCES `criteria` (`id`),
  ADD CONSTRAINT `criteria_evaluation_ibfk_2` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation` (`id`);

--
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`rating_section_id`) REFERENCES `rating_section` (`id`),
  ADD CONSTRAINT `heure_index` FOREIGN KEY (`heure`) REFERENCES `time_slots` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `judge_index` FOREIGN KEY (`judge_id`) REFERENCES `judge` (`id`),
  ADD CONSTRAINT `survey_index` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`),
  ADD CONSTRAINT `survey_teams_index` FOREIGN KEY (`teams_id`) REFERENCES `teams` (`id`);

--
-- Constraints for table `judge`
--
ALTER TABLE `judge`
  ADD CONSTRAINT `categorie_juge_id` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `compte_juge_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `site_component`
--
ALTER TABLE `site_component`
  ADD CONSTRAINT `type_component` FOREIGN KEY (`type_id`) REFERENCES `component_type` (`id`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `categorie_id` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `teams_survey` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `teams_contact_person`
--
ALTER TABLE `teams_contact_person`
  ADD CONSTRAINT `contact_person_index` FOREIGN KEY (`contact_person_id`) REFERENCES `contact_person` (`id`),
  ADD CONSTRAINT `teams_index` FOREIGN KEY (`teams_id`) REFERENCES `teams` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `users_teams`
--
ALTER TABLE `users_teams`
  ADD CONSTRAINT `compte_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `equipe_id` FOREIGN KEY (`teams_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
