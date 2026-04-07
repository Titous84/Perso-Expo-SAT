<?php

namespace Tests\Services\SignUpTeamService;

use App\Enums\EnumHttpCode;
use App\Fabricators\Emails\EmailEvaluationFabricator;
use App\Repositories\SurveyRepository;
use App\Services\SurveyService;
use App\Handlers\LogHandler;
use App\Models\Judge;
use App\Services\EmailService;
use App\Services\TwigService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Dotenv\Dotenv;
use App\Utils\GeneratorUUID;
use App\Validators\ValidatorQuestionResult;
use App\Validators\ValidatorUUID;
use PHPMailer\PHPMailer\PHPMailer;
use Test\TestsUtils\PDOInitialize;
use App\Models\User;
use App\Repositories\JudgeStandRepository;
use App\Repositories\UserRepository;
use App\Validators\ValidatorCommentResult;
use Test\TestsUtils\TestingLogger;

/**
 * Classe permettant de tester les formulaires des juges.
 * @author Christopher Boisvert
 * @author Jean-Christophe Demers
 * @package Tests\SurveyService\SurveyServiceTest
 * Bugfix : Ajout des parametres manquants et nettoyage des méthodes de test ayant des méthodes inexistantes
 * @author Léandre Kanmegne - H26
 */
final class SurveyServiceTest extends TestCase
{

	private static $pdo;

	private $surveyService;

	private static $mockUser = array(
		"first_name" => "John",
		"last_name" => "Doe",
		"username" => "christolord3",
		"pwd" => "123elite",
		"email" => "johndoe@hotmail.com",
		"picture_consent" => 1,
		"activated" => 1,
		"blacklisted" => 0,
		"role_id" => 1
	);

	private static $mockJudge = array(
		"category" => "Humain",
		"firstName" => "John",
		"lastName" => "Doe",
		"username" => "christolord3",
		"pwd" => "123elite",
		"email" => "johndoe@hotmail.com",
		"pictureConsent" => 1,
		"activated" => 1,
		"blacklisted" => 0,
		"role_id" => 1
	);

	private static $mockEvaluation = array(
		'jugeId' => 23,
		'standId' => 1,
		'surveyId' => 2,
		'heure' => 2,
	);

	private static $evaluation_id = null;

	private static $judgeUUID = null;

	// criteria_id => score
	private static $mockScores = [
		31 => 1,
		32 => 6,
		33 => 2,
		34 => 7,
		35 => 9,
		36 => 0,
		37 => 8,
	];

	/**
	 * @before
	 * Permet de créer une instance de PDO
	 * @return void
	 */
	public function set_up_environment(): void
	{
		//Configuration de l'environnement
		$dotenv = new Dotenv();
		$dotenv->load(__DIR__ . '/../../../.env.prod');
		self::$pdo = new PDOInitialize();


		TestingLogger::log("Changement de la variable ENV en mode développement");
		$_ENV["production"] = "false";

		TestingLogger::log("Création du LogHandler");
		$logHandler = new LogHandler();

		TestingLogger::log("Création du SurveyRepository");
		$surveyRepository = new SurveyRepository(self::$pdo->pdo(), $logHandler);

		TestingLogger::log("Création du ValidatorUUID");
		$validatorUUID = new ValidatorUUID();

		TestingLogger::log("Création du ValidatorCommentResult");
		$validatorCommentResult = new ValidatorCommentResult();

		TestingLogger::log("Création du ValidatorQuestionResult");
		$validatorQuestionResult = new ValidatorQuestionResult();

		TestingLogger::log("Création du PHPMailer");
		$phpMailer = new PHPMailer();

		TestingLogger::log("Création du EmailService");
		$emailService = new EmailService($phpMailer, new LogHandler());

		TestingLogger::log("Création du TwigService");
		$twigService = new TwigService(new LogHandler());

		TestingLogger::log("Création du EmailEvaluationFabricator");
		$emailEvaluationFabricator = new EmailEvaluationFabricator($emailService, $twigService);

		TestingLogger::log("Création du service SurveyService");
		$this->surveyService = new SurveyService(
			$surveyRepository,
			$logHandler,
			$validatorUUID,
			$validatorCommentResult,
			$validatorQuestionResult,
			$emailEvaluationFabricator
		);
	}




	/**
	 * test_get_survey_with_empty_uuid
	 * Méthode qui teste si le SurveyService gère bien les uuids vide.
	 */
	public function test_get_survey_with_empty_uuid()
	{
		TestingLogger::log("Tentative d'obtention du Survey");
		$surveyResult = $this->surveyService->get_all_survey_by_judge_id("");

		$this->assertEquals($surveyResult->get_http_code(), EnumHttpCode::BAD_REQUEST);
		$this->assertEquals(array("L'UUID se doit d'être de 36 caractères."), $surveyResult->get_message());
		$this->assertEmpty($surveyResult->get_content());
	}

	/**
	 * test_get_survey_with_empty_uuid
	 * Méthode qui teste si le SurveyService gère bien les uuids vide.
	 */
	public function test_get_survey_with_random_uuid()
	{
		TestingLogger::log("Generation d'un UUID");
		$randomUUID = GeneratorUUID::generate_UUID_array(1);

		TestingLogger::log("Tentative d'obtention du Survey");
		$surveyResult = $this->surveyService->get_all_survey_by_judge_id($randomUUID[0]);

		$this->assertEquals(EnumHttpCode::NOT_FOUND, $surveyResult->get_http_code());
		$this->assertEquals(array("Aucune évaluation trouvé."), $surveyResult->get_message());
		$this->assertEmpty($surveyResult->get_content());
	}
}