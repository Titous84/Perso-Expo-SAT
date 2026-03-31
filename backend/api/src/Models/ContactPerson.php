<?php

namespace App\Models;

/**
 * Classe Team.
 * @package App\Models
 * @author Tristan Lafontaine
 */
class ContactPerson
{

	/**
	 * @var int|null ID de l'équipe.
	 */
	public ?int $id;
    
    /**
     * name
     * Le nom complet de la personne ressource
     * @var string
     */
    public string $name;
    
    /**
     * email
     * Adresse courriel
     * @var string
     */
    public string $email;
    
    /**
     * teamId
     * L'id de l'équipe
     * @var int|null
     */
    public ?int $teamId;


	/**
	 * Team constructeur.
	 * @param $teamJSON
	 */
    public function __construct($teamJSON)
    {
        $this->id = $teamJSON["id"] ? : null;
        $this->name = $teamJSON["name"];
        $this->email = $teamJSON["email"];
        $this->teamId = $teamJSON["teamId"] ? : null;
    }
}