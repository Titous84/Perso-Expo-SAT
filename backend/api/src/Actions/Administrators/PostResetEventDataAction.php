<?php

namespace App\Actions\Administrators;

use App\Services\TokenService;
use App\Services\UserService;
use App\Utils\TokenUtils;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

/**
 * Action permettant de réinitialiser les données de fin d'évènement.
 * @author Nathan Reyes
 */
class PostResetEventDataAction
{
    /** @var UserService Service des utilisateurs. */
    private $userService;

    /** @var TokenService Service de jeton. */
    private $tokenService;

    public function __construct(UserService $userService, TokenService $tokenService)
    {
        $this->userService = $userService;
        $this->tokenService = $tokenService;
    }

    public function __invoke(Request $request, Response $response, array $args): ResponseInterface
    {
        // Vérifier que l'utilisateur est administrateur.
        // @author Nathan Reyes
        $isUserPermitted = TokenUtils::is_user_in_permitted_roles($request, $this->tokenService, ["Admin"]);

        if ($isUserPermitted !== null) {
            $response->getBody()->write($isUserPermitted->to_json());
            return $response->withStatus($isUserPermitted->get_http_code());
        }

        // Exécuter la réinitialisation annuelle des données.
        // @author Nathan Reyes
        $serviceResponse = $this->userService->reset_event_data();
        $response->getBody()->write($serviceResponse->to_json());
        return $response->withStatus($serviceResponse->get_http_code());
    }
}
