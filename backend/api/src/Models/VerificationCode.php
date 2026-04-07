<?php

namespace App\Models;

/**
 * Classe VerificationCode.
 * Fortement inspiré de user.php (Model)
 * @author Maxime Demers Boucher
 * @package App\Models
 */
class VerificationCode
{
	/**
	 * @var int|null ID du code de vérification
	 */
	public ?int $id;

	/**
	 * @var string code de vérification.
	 */
	public string $verificationCode;

	/**
	 * @var string email du user.
	 */
	public string $email;

	/**
	 * timestamp du code actif ou non
	 */
	public $valideTime;

	/**
	 * VerificationCode constructeur.
	 * @param $userJSON
	 * Bugfix @author Léandre Kanmegne H-26
	 * Correction de la déclaration des variables dans le constructeur de la classe VerificationCode pour éviter les
	 */
    public function __construct( string $verificationCode, string $email, string $valideTime)
    {
        $this->id = null;
        $this->verificationCode = $verificationCode;
        $this->email = $email;
		$this->valideTime = $valideTime;
    }
}