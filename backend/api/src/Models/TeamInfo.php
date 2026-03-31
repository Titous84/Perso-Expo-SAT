<?php

namespace App\Models;

/**
 * Classe TeamInfo.
 * @package App\Models
 * @author Tristan Lafontaine
 */
class TeamInfo
{
	/**
	 * @var int|null ID de l'équipe.
	 */
	public ?int $id;
	
	/**
	 * team_number
	 * Number de l'équipe
	 * @var string
	 */
	public string $teamNumber;

	/**
	 * @var string Titre du stand.
	 */
	public string $title;

	/**
	 * @var string Description du stand.
	 */
	public string $description;

	/**
	 * @var string Categorie.
	 */
	public string $category;
    
    /**
     * survey
     *
     * @var string Type d'évaluation
     */
    public string $survey;
    
    /**
     * teamsActivated
     *
     * @var string
     */
    public string $teamsActivated;

	/**
	 * @var string|null L'année des participants.
	 */
	public ?string $year;
	
	/**
	 * type_id
	 * Permet de connaitre le type de l'évaluation: DD | SAT | TES
	 * @var int
	 */
	public int $typeId;

	/**
	 * Team constructeur.
	 * @param $teamJSON
	 */
    public function __construct($teamJSON)
    {
        $this->id = isset($teamJSON["team_id"]) ? $teamJSON["team_id"] : null ;
		$this->teamNumber = isset($teamJSON["team_number"]) ? $teamJSON["team_number"] : null ;
        $this->title = $teamJSON["title"];
        $this->description = $teamJSON["description"];
		$this->category = $teamJSON["category"];
        $this->survey = $teamJSON["survey"];
        $this->teamsActivated = $teamJSON["teams_activated"];
	    $this->year = $teamJSON["year"];
		$this->typeId = isset($teamJSON["type_id"]) ? $teamJSON["type_id"] : 0;
    }
}