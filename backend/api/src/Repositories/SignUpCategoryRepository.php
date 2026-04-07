<?php

namespace App\Repositories;

use PDOException;

/**
 * SignUpCategoryRepository
 * @author Tristan Lafontaine
 */
class SignUpCategoryRepository extends Repository{
    
    /**
     * getAllCategory
     * Obtien la liste des catégories
     * @return array
     * Bugfix : la fonction ne vérifiait pas si les catégories avaient une grille d'évaluation assignée, ce qui causait des erreurs lors de l'inscription des équipes.
     * @author Léandre Kanmegne - H26
     */
    public function get_all_categories() : array
    {
        try
        {
            $sql = "SELECT id, name, max_members, acronym FROM categories WHERE activated = 1 AND survey_id IS NOT NULL";
            $req = $this->db->prepare($sql);
            $req->execute();
            return $req->fetchAll();
        }
        catch(PDOException $e)
        {
            $context["http_error_code"] = $e->getCode();
            $this->logHandler->critical($e->getMessage(), $context);
			return [];
        }
    }

}