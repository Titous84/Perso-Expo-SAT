<?php

namespace App\Repositories;

use PDO;
use PDOException;

/**
 * @author: Souleymane Soumaré
 * Repository: script pour obtenir les resultats.
 * 
 * @Éditeur: Samuel Lambert
 * Édition: Requête sql ne fonctionnait pas 
 * 
 * Éditeur: Francis Payan
 * Édition: Requête sql fonctionne
 */
class ResultatRepository extends Repository
{

    //Tableau de messages d'erreur
    private $errorMessages = [];

    /**
     * Fonction pour obtenir les resultats des évaluations à partir de la base de données.
     * 
     * @return array
     * 
     * @author Francis Payan
     */
    public function selectResultats() : array
    {
        $sql = "SELECT
            categories.name AS 'categorie',
            teams.name AS 'teams_name',
            users.first_name AS 'first_name_user',
            users.last_name AS 'last_name_user',
            judge.id AS 'judge_id',
            evaluation.comments AS 'comments',
            ROUND(SUM(criteria_evaluation.score * criteria.max_value) / SUM(criteria.max_value) * 10, 2) AS 'global_score'        
        FROM evaluation
        INNER JOIN teams ON evaluation.teams_id = teams.id
        INNER JOIN categories ON teams.categories_id = categories.id
        INNER JOIN judge ON evaluation.judge_id = judge.id
        INNER JOIN users ON judge.users_id = users.id
        INNER JOIN criteria_evaluation ON evaluation.id = criteria_evaluation.evaluation_id
        INNER JOIN criteria ON criteria_evaluation.criteria_id = criteria.id
        GROUP BY categories.name, teams.name, users.first_name, users.last_name, evaluation.comments, evaluation.id
        ORDER BY categories.name, global_score DESC;";

        $query = $this->db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        return $results;   

    }

    /**
     * Fonction pour supprimer les résultats d'un juge ou plusieurs pour une évaluation
     * @param int $judgeId
     * @return bool
     * @author Tommy Garneau
     * Bugfix @author Léandre Kanmegne H-26
     * Correction de la requête SQL pour supprimer les résultats d'un juge pour une équipe spécifique
     */
    public function delete_judge_resultat(string $teamName, int $judgeId): bool {
    try {
        // supprime les criteria_evaluation
        $sql = "DELETE FROM criteria_evaluation
                WHERE evaluation_id IN (
                    SELECT evaluation.id
                    FROM evaluation
                    INNER JOIN judge ON evaluation.judge_id = judge.id
                    INNER JOIN teams ON evaluation.teams_id = teams.id
                    WHERE judge.id = :judge_id AND teams.name = :team_name
                )";
        $req = $this->db->prepare($sql);
        $req->execute([
            "judge_id" => $judgeId,
            "team_name" => $teamName
        ]);

        // Supprime l'evaluation
        $sql2 = "DELETE FROM evaluation
                 WHERE judge_id = :judge_id 
                 AND teams_id = (SELECT id FROM teams WHERE name = :team_name)";
        $req2 = $this->db->prepare($sql2);
        $req2->execute([
            "judge_id" => $judgeId,
            "team_name" => $teamName
        ]);

        return true;
    } catch (PDOException $e) {
            $context["http_error_code"] = $e->getCode();
            $this->logHandler->critical($e->getMessage(), $context);
            $this->errorMessages[] = "deleteJudgeResult: " . $e->getMessage();
            throw $e;
        }
    }
}

