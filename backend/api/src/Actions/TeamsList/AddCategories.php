<?php
declare (strict_types=1);

namespace App\Actions\TeamsList;

use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use App\Services\TeamsListService;
use App\Utils\TokenUtils;
use App\Services\TokenService;

/**
 * Classe permettant d'ajouter catégorie.
 * @author Breno Gomes - H26
 * @package App\Actions\TeamsList
 */
class AddCategories
{
    private TeamsListService $teamsListService;
    private TokenService $tokenService;

    /**
     * Constructeur de la classe AddCategories
     * @param  TeamsListService $teamsListService
     * @param  TokenService $tokenService
     * @return void
     */

    public function __construct(TeamsListService $teamsListService, TokenService $tokenService)
    {
        $this->teamsListService = $teamsListService;
        $this->tokenService = $tokenService;
    }

    /**
     * Fonction invoquée lors de l'appelle de la classe AddCategories
     * @param Request $request Objet de requête PSR-7.
     * @param Response $response Objet de réponse PSR-7.
     * @return ResponseInterface Réponse retournée par la route.
     */
    public function __invoke(Request $request, Response $response): ResponseInterface
    {
        $result = TokenUtils::is_user_in_permitted_roles($request, $this->tokenService, ["Admin"]);

        if ($result != null) {
            $response->getBody()->write($result->to_json());
            return $response->withStatus($result->get_http_code());
        }

        $data = json_decode($request->getBody()->getContents(), true);
        $name = $data['name'] ?? null;
        $acronym = $data['acronym'] ?? null;

        if (!$name || !$acronym) {
            $errorResponse = [
                'success' => false,
                'message' => 'Le nom et l\'acronyme de la catégorie sont requis.'
            ];
            $response->getBody()->write(json_encode($errorResponse));
            return $response->withStatus(400);
        }

        $addResult = $this->teamsListService->add_category($name, $acronym);

        $response->getBody()->write($addResult->to_json());
        return $response->withStatus($addResult->get_http_code());
    }
}
