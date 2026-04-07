<?php

namespace App\Services;

use App\Repositories\SendRepository;
use App\Fabricators\Emails\EmailSendResultFabricator;


/**
 * Souleymane Soumaré
 * Service pour envoyer resultat par mail.
 * Bugfix @author Léandre Kanmegne H-26
 * Correction de la déclaration de la variable $repository pour spécifier le type SendRepository, et ajout de la déclaration des variables $emailService et $twigService pour éviter les erreurs d'accès à des variables non déclarées.
 */
final class ResultatSendService
{
    /**
     * @var SendRepository
     */
    private $repository;
    private $emailService;
    private $twigService;

    /**
     * Le constructeur.
     *
     * @param SendRepository $repository The repository
     * @param $emailService
     * @param $twigService
     */
    public function __construct(SendRepository $repository, $emailService, $twigService)
    {
        $this->repository = $repository;
         $this->emailService = $emailService;
        $this->twigService = $twigService;
    }

    public function sendingResultat($id) : string
    {   
        return json_encode($this->repository->sendResultats($id));
    }

    public function sendingMail($team,$note,$name,$email) 
    {       
        $sendEmail = new EmailSendResultFabricator($this->emailService,$this->twigService);
        $sendEmail->send_mail([
            "team_name" => $team,
            "note" => $note,
            "name_ressource_person" => $name,
            "email_ressource_person" => $email
        ]);
    }   

}
