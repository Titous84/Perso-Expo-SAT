-- Index pour améliorer les performances des requêtes liées aux juges et aux utilisateurs dans l'application Expo-SAT.
-- @author Léandre Kanmegne - H26


-- Index 1 : users judge pour accélérer les jointures lors de la récupération des juges d'une catégorie.
CREATE INDEX idx_judge_users_id ON judge(users_id);

-- Index 2 : judge categories  pour accélérer les jointures lors de la récupération des catégories d'un juge.
CREATE INDEX idx_judge_categories_id ON judge(categories_id);

-- Index 3 : Pour le filtre blacklisted dans la table users, souvent utilisé pour exclure les utilisateurs blacklistés des résultats.
CREATE INDEX idx_users_role_blacklisted ON users(role_id, blacklisted);

-- Index 4 : Pour le filtre activated dans la table users, souvent utilisé pour exclure les utilisateurs non activés des résultats.
CREATE INDEX idx_users_role_activated ON users(role_id, activated);

-- Index 5 :Pour les équipes, afin d'améliorer les performances des requêtes qui récupèrent les membres d'une équipe ou les équipes d'un utilisateur.
CREATE INDEX idx_users_teams_teams_id ON users_teams(teams_id);

CREATE INDEX idx_users_teams_users_id ON users_teams(users_id);

-- Index 6 : Pour les personnes ressources , afin d'améliorer les performances des requêtes qui récupèrent les personnes ressources d'une équipe ou les équipes d'une personne ressource.
CREATE INDEX idx_teams_contact_person_teams_id ON teams_contact_person(teams_id);