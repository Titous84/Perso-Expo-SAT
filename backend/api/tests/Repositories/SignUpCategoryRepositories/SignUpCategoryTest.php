<?php

namespace Repositories\SignUpCategoryRepositories;

use App\Enums\EnumHttpCode;
use App\Handlers\LogHandler;
use App\Repositories\SignUpCategoryRepository;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Dotenv\Dotenv;
use App\Utils\GeneratorUUID;
use Test\TestsUtils\CategoryInitialize;
use Test\TestsUtils\PDOInitialize;
use Test\TestsUtils\TestingLogger;

final class SignUpCategoryTest extends TestCase {
    
    private static $pdo;
    
    /**
     * setUpBeforeClass
     * Permet de créer une instance de PDO
     * @return void
     */
    public static function setUpBeforeClass() : void
    {
        $dotenv = new Dotenv();
        $dotenv->load(__DIR__ . '/../../../.env.prod');
        self::$pdo = new PDOInitialize();
    }
    
    /**
     * tearDownAfterClass
     * Permet de supprimer l'instance du PDO
     * @return void
     */
    public static function tearDownAfterClass(): void
    {
        self::$pdo = null;
    }

    /**
     * test_add_category_signup
     * Fonction pour tester l'ajout d'une catégorie dans la base de données.
     * @author Breno Gomes -H26
     * @return void
     */
    public function test_add_category(){
        TestingLogger::log("Changement de la variable ENV en mode développement");
        $_ENV["production"] = "false";

        TestingLogger::log("Création du répertoire SignUpCategoryRepository");
        $logHandler = new LogHandler();
        $signUpCategoryRepository = new SignUpCategoryRepository(self::$pdo->PDO(), $logHandler);

        $categoryInitialize = new CategoryInitialize();
        $category = $categoryInitialize->Category();

        TestingLogger::log("Ajout de la catégorie dans la base de données");
        $response = $signUpCategoryRepository->add_Category($category);
        $this->assertTrue($response, "Erreur : test_add_category");
    }

    public function test_delete_category(){
        TestingLogger::log("Création du répertoire SignUpCategoryRepository");
        $logHandler = new LogHandler();
        $signUpCategoryRepository = new SignUpCategoryRepository(self::$pdo->PDO(), $logHandler);

        $categoryInitialize = new CategoryInitialize();
        $category = $categoryInitialize->Category();
        $signUpCategoryRepository->add_Category($category);

        $categories = $signUpCategoryRepository->get_all_categories();
        $deleted = false;
        foreach ($categories as $categorie) {
            if ($categorie["name"] === "CategorieDeTest" || $categorie["name"] === "AutreCategorieDeTest") {
                $response = $signUpCategoryRepository->delete_category($categorie["id"]);
                $this->assertEquals(1, $response, "Erreur : test_delete_category");
                $deleted = true;
            }
        }
        $this->assertTrue($deleted, "Aucune catégorie de test trouvée à supprimer");
    }

    public function test_get_all_categories(){
        echo date("Y-m-d h:m:s") . " Création du répertoire SignUpCategoryRepository \n";
        $logHandler = new LogHandler();
        $signUpCategoryRepository = new SignUpCategoryRepository(self::$pdo->PDO(), $logHandler);

        echo date("Y-m-d h:m:s") . " Appel la classe GeneratorUuid\n";
		$generatorUUID = new GeneratorUuid();

        $categoryInitialize = new CategoryInitialize(); 

        $category1 = $categoryInitialize->Category();
        $category2 = $categoryInitialize->Category_different();

        echo date("Y-m-d h:m:s") . " Ajout de deux catégories dans la base de données \n";
        $response1 = $signUpCategoryRepository->add_Category($category1);
        $this->assertTrue($response1, "Erreur : test_add_category_signup");
        $response2 = $signUpCategoryRepository->add_Category($category2);
        $this->assertTrue($response2, "Erreur : test_add_category_signup");

        echo date("Y-m-d h:m:s") . " Obtenir toutes les catégories de la bd. \n";
        $categories = $signUpCategoryRepository->get_all_categories();

        $this->assertGreaterThan(0, count($categories), "Erreur : test_get_all_categories");
        
        $this->test_delete_category();
    }
    
}