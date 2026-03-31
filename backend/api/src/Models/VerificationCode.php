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
	 * @var TIMESTAMP timestamp du code actif ou non
	 */
	public $valideTime;

	/**
	 * Users constructeur.
	 * @param $userJSON
	 */
    public function __construct( string $verificationCode, string $email, string $valideTime)
    {
        $this->id = null;
        $this->verificationCode = $verificationCode ?? null;
        $this->email = $email;
		$this->valideTime = $valideTime ?? null;
    }
}