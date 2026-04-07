<?php
namespace App\Services;

use Exception;
use Twig\Loader\FilesystemLoader;
use Twig\Environment;
use App\Handlers\LogHandler;

/**
 * Classe TwigService permet de générer du html avec des v{ariables.
 * @author Mathieu Sévégny
 * @package App\Services
 */
class TwigService
{
	/**
	 * @var Environment permet de générer du html avec des variables.
	 */
	public $twig;

	/**
	 * @var LogHandler Permet d'avoir assez à la classe LogHandler
	 * Bugfix @author Léandre Kanmegne H-26
	 * Correction de la déclaration de la variable $logHandler pour spécifier le type LogHandler
	 */
	private $logHandler;

	/**
	 * TwigService constructeur.
	 */
	public function __construct(LogHandler $logHandler)
	{
		try
		{
			$this->logHandler = $logHandler;
			$loader = new FilesystemLoader(__DIR__ . '/../../src/Interfaces');
    		$this->twig = new Environment($loader,[]);
			
		}
		catch(Exception $e)
		{
			$context["http_error_code"] = $e->getCode();
            $this->logHandler->critical($e->getMessage(), $context);
		}
	}

}