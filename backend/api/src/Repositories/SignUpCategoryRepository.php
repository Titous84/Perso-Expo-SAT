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

    /**
     * addCategory
     * Ajoute une nouvelle catégorie
     * @param object $category
     * @return bool
     * @Author Breno Gomes - H26
     */
    public function add_Category($category) : bool
    {
        try
        {
            $sql = "INSERT INTO categories (name, activated, max_members, survey_id, acronym) VALUES (:name, 1, :max_members, 1, :acronym)";
            $req = $this->db->prepare($sql);
            $req->bindParam(":name", $category->name);
            $req->bindParam(":max_members", $category->max_members);
            $req->bindParam(":acronym", $category->acronym);
            return $req->execute();
        }
        catch(PDOException $e)
        {
            $context["http_error_code"] = $e->getCode();
            $this->logHandler->critical($e->getMessage(), $context);
            return false;
        }
    }


    /**
     * delete_category
     * Supprime une catégorie de la base de données
     * @param int $id
     * @return int
     * @Author Breno Gomes - H26
     */
    public function delete_category($id) : int
    {
        try
        {
            $sql = "DELETE FROM categories WHERE id = :id";
            $req = $this->db->prepare($sql);
            $req->bindParam(":id", $id);
            $req->execute();
            return $req->rowCount();
        }
        catch(PDOException $e)
        {
            $context["http_error_code"] = $e->getCode();
            $this->logHandler->critical($e->getMessage(), $context);
            return 0;
        }
    }
}