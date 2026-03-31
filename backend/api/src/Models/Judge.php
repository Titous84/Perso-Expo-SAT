<?php

namespace App\Models;

/**
 * Classe Juge.
 * @author Jean-Philippe Bourassa
 * @package App\Models
 */
class Judge
{
	/**
	 * ID du juge.
	 */
	public ?int $id;

	
	/**
	 * User ID du juge.
	 */
	public ?int $user_id;

	/**
	 * Prénom du juge.
	 */
	public string $firstName;

	/**
	 * Nom du juge.
	 */
	public string $lastName;

	/**
	 * Mot de passe du juge.
	 */
	public ?string $pwd;

	/**
	 * Email du juge.
	 */
	public string $email;

	/**
	 * URL vers l'image du juge.
	 * Bugfix : le champ picture était de type string, ce qui causait des erreurs lors de l'appel de la fonction update_judge_infos.
	 * @author Léandre Kanmegne - H26
	 */
	public ?string $picture;

	/**
	 * Consentement du juge à afficher sa photo.
	 */
	public bool $pictureConsent;

	/**
	 * Statut d'activation du juge.
	 */
	public ?int $activated;

	/**
	 * Statut de bannissement du juge.
	 */
	public ?int $blacklisted;

	/**
	 * Rôle du juge.
	 */
	public ?int $role_id;

	/**
	 * Catégorie associé au juge.
	 */
	public ?string $category;

	/**
	 * Judge constructeur.
	 * @param $judgeJSON
	 */
	public function __construct($judgeJSON)
	{
		$this->id = $judgeJSON["id"] ?? null;
		$this->user_id = $judgeJSON["user_id"] ?? null;
		$this->firstName = $judgeJSON["firstName"];
		$this->lastName = $judgeJSON["lastName"];
		$this->pwd = password_hash($judgeJSON["pwd"], PASSWORD_DEFAULT);
		$this->email = $judgeJSON["email"];
		$this->picture = $judgeJSON["picture"] ?? null;
		$this->pictureConsent = $judgeJSON["pictureConsent"] ?? false;
		$this->activated = $judgeJSON["activated"] ?? false;
		$this->blacklisted = $judgeJSON["blacklisted"] ?? false;
		$this->role_id = $judgeJSON["role_id"] ?? null;
		$this->category = $judgeJSON["category"] ?? null;
	}
}
