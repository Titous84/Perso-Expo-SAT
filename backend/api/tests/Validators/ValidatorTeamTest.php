<?php

namespace Tests\Validators;

use App\Enums\EnumHttpCode;
use App\Repositories\SignUpTeamRepository;
use App\Validators\ValidatorTeam;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires du validateur d'équipe pour les cas d'usage récents.
 * @author Nathan Reyes
 */
final class ValidatorTeamTest extends TestCase
{
    /**
     * Construit une équipe valide minimale (1 membre) pour les tests.
     * @author Nathan Reyes
     */
    private function buildValidTeam(): array
    {
        return [
            "title" => "Stand test",
            "description" => "Description test",
            "category" => "Sciences physiques",
            "year" => "1re année",
            "contactPerson" => [
                [
                    "fullName" => "Personne Ressource",
                    "email" => "ressource@test.com"
                ]
            ],
            "members" => [
                [
                    "firstName" => "Alice",
                    "lastName" => "Tremblay",
                    "numero_da" => "1234567",
                    "photoConsentClause" => "publication",
                    "isAnonymous" => 1
                ]
            ]
        ];
    }

    /**
     * Valide qu'une équipe avec un seul membre est acceptée,
     * incluant anonymat et clause de consentement photo.
     * @author Nathan Reyes
     */
    public function test_validate_accepts_one_member_with_anonymity_and_photo_clause()
    {
        // Mock du repository pour fournir la limite de membres par catégorie.
        // @author Nathan Reyes
        $signUpTeamRepository = $this->createMock(SignUpTeamRepository::class);
        $signUpTeamRepository->method('get_max_members_category')->willReturn(4);

        $validatorTeam = new ValidatorTeam($signUpTeamRepository);
        $result = $validatorTeam->validate($this->buildValidTeam());

        $this->assertEquals(EnumHttpCode::SUCCESS, $result->get_http_code());
    }

    /**
     * Vérifie qu'une clause photo invalide est refusée par la validation.
     * @author Nathan Reyes
     */
    public function test_validate_rejects_invalid_photo_clause()
    {
        $signUpTeamRepository = $this->createMock(SignUpTeamRepository::class);
        $signUpTeamRepository->method('get_max_members_category')->willReturn(4);

        $validatorTeam = new ValidatorTeam($signUpTeamRepository);
        $team = $this->buildValidTeam();
        $team["members"][0]["photoConsentClause"] = "valeur_invalide";

        $result = $validatorTeam->validate($team);

        $this->assertEquals(EnumHttpCode::BAD_REQUEST, $result->get_http_code());
        $this->assertContains(
            "La clause de consentement photo est invalide pour le membre : 1234567",
            $result->get_content()
        );
    }

    /**
     * Vérifie qu'un numéro DA différent de 7 chiffres est refusé.
     * @author Nathan Reyes
     */
    public function test_validate_rejects_invalid_da_format()
    {
        $signUpTeamRepository = $this->createMock(SignUpTeamRepository::class);
        $signUpTeamRepository->method('get_max_members_category')->willReturn(4);

        $validatorTeam = new ValidatorTeam($signUpTeamRepository);
        $team = $this->buildValidTeam();
        $team["members"][0]["numero_da"] = "12345";

        $result = $validatorTeam->validate($team);

        $this->assertEquals(EnumHttpCode::BAD_REQUEST, $result->get_http_code());
        $this->assertContains(
            "Le numéro DA doit contenir exactement 7 chiffres : 12345",
            $result->get_content()
        );
    }
}
