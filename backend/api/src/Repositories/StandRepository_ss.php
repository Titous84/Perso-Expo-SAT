<?php
namespace App\Repositories;

use PDO;


/**
 * Repository: script pour obtenir les stands.
 * Souleymane Soumaré
 */
class StandRepository_ss extends Repository
{

    public function selectStands() : array
    {

        $sql = "SELECT team_number, categories_id, survey_id
        FROM teams;";

        $query = $this->db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        return $results;
    }

}

