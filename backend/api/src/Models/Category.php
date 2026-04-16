<?php

namespace App\Models;

/**
 * Classe Category.
 * @author Breno Gomes - H26
 * @package App\Models
 */
class Category
{
    /**
     * ID de la catégorie.
     */
    public ?int $id;

    /**
     * Nom de la catégorie.
     */
    public string $name;

    /**
     * Statut d'activation de la catégorie.
     */
    public int $activated;

    /**
     * Nombre maximum de membres dans la catégorie.
     */
    public int $max_members;

    /**
     * ID du type d'évaluation associé à la catégorie.
     */
    public int $survey_id;

    /**
     * Acronyme de la catégorie.
     */
    public string $acronym;

    /**
     * Category constructeur.
     * @param array $categoryJSON
     */
    public function __construct(array $categoryJSON)
    {
        $this->id = $categoryJSON["id"] ?? null;
        $this->name = $categoryJSON["name"];
        $this->activated = $categoryJSON["activated"] ?? 1;
        $this->max_members = $categoryJSON["max_members"] ?? 6;
        $this->survey_id = $categoryJSON["survey_id"] ?? 1;
        $this->acronym = $categoryJSON["acronym"];
    }
}