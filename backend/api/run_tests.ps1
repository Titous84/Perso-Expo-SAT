# Script de lancement des tests PHPUnit
# Creer une base de données de test et y importer le fichier exposat.sql
# @author Léandre Kanmegne - H26
$db = 'expo_sat_test'
$user = 'root'
$pass = 'mysql'
$mysql = "C:\Program Files\Ampps\mysql\bin\mysql.exe"

Write-Host "Suppression de la base de données si elle existe"
& $mysql --user="$user" --password="$pass" --execute="DROP DATABASE IF EXISTS $db;"
Write-Host "Creation de la base de données"
& $mysql --user="$user" --password="$pass" --execute="CREATE DATABASE $db;"
& $mysql --user="$user" --password="$pass" $db --execute="SOURCE ../../exposat.sql;"
Write-Host "Chargement des données de test"
& $mysql --user="$user" --password="$pass" $db --execute="SOURCE ../../Donnees_SQL_test/Insert_de_test_pour_affichage.sql;"

Write-Host "Running tests..."
$env:dbname = $db # Override l'appel la variable BD de Php unit vers la base de données de test
& .\vendor\bin\phpunit .\tests\