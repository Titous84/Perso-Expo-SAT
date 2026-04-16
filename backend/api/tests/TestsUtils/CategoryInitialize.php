<?php
namespace Test\TestsUtils;

use App\Models\Category;
use App\Utils\GeneratorUUID;

/**
 * CategoryInitialize
 * @author Breno Gomes - H26
 * Classe qui initialise des catégories pour les tests
 * Bugfix : Modification des donnees d'initialisation des catégories
 * @author Léandre Kanmegne - H26
 */
class CategoryInitialize{
    /**
     * Category
     * Initialise une catégorie
     * @return Category
     */
    public function Category(): Category
    {
        TestingLogger::log("Création d'une catégorie");
        return new Category(array(
            "name" => "CategorieDeTest",
            "activated" => 1,
            "max_members" => 6,
            "survey_id" => 1,
            "acronym" => "CDT",
        ));
    }

    /**
     * Category_different
     * Initialise une autre catégorie
     * @return Category
     */    public function Category_different(): Category
    {
        TestingLogger::log("Création d'une catégorie");
        return new Category(array(
            "name" => "AutreCategorieDeTest",
            "activated" => 1,
            "max_members" => 6,
            "survey_id" => 1,
            "acronym" => "ACDT",
        ));
    }
}