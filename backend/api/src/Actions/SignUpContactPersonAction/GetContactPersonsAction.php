<?php
declare(strict_types=1);
namespace App\Actions\SignUpContactPersonAction;

use App\Repositories\SignUpTeamRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Classe GetContactPersonsAction 
 * Permet de récupérer la liste des personnes-ressources pour l'inscription d'une équipe
 * @package App\Actions\SignUpContactPersonAction
 * @author Léandre Kanmegne - H26
 */
class GetContactPersonsAction {
    private SignUpTeamRepository $signUpTeamRepository; // Dépendance pour accéder à la base de données

    // Le constructeur pour injecter la dépendance du repository
    public function __construct(SignUpTeamRepository $signUpTeamRepository) {
        $this->signUpTeamRepository = $signUpTeamRepository;
    }

    // Fonction invoquée lors de l'appel de la route pour récupérer les personnes-ressources
    public function __invoke(Request $request, Response $response): Response {
        $contactPersons = $this->signUpTeamRepository->get_all_contact_persons();

       // Mapping pour formater les données des personnes-ressources avant de les retourner en JSON
        $mapped = array_map(function($person) {
            return [
                'id'       => $person['id'],
                'fullName' => $person['name'],
                'email'    => $person['email'],
            ];
        }, $contactPersons);

        $response->getBody()->write(json_encode([
        'content' => $mapped,
        'message' => 'success'
    ]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200); // Retourne une réponse HTTP 200 avec le JSON des personnes-ressources
    }
}