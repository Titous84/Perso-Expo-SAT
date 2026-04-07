# ExpoSAT - Script de compilation et de packaging
# Source / Inspiré de :
# https://cours-alexandre-ouellet.github.io/projet-integrateur-1/

function Invoke-ExpoSAT {

    Write-Host "[*] Verification des fichiers de configuration (.env)..."

    # Vérification du frontend
    if (!(Test-Path -Path "./front/.env" -PathType Leaf)) {
        Write-Host "[!] ERREUR : Le fichier front/.env est manquant."
        Write-Host "[>] Assurez-vous de creer le fichier avant de compiler."
        return
    }

    # Vérification du backend
    if (!(Test-Path -Path "./backend/api/.env.prod" -PathType Leaf)) {
        Write-Host "[!] ERREUR : Le fichier backend/api/.env.prod est manquant."
        Write-Host "[>] Assurez-vous de creer le fichier avant de compiler."
        return
    }

    # Vérification des variables d'environnement essentielles dans .env.prod
    # Affichage de warnings si des variables manquent ou si base_url se termine par /
    # @author Léandre Kanmegne - H26
    # Code généré par ChatGPT - modele 5.4 mars 2026
    $envContent = Get-Content ./backend/api/.env.prod -ErrorAction SilentlyContinue
    $requiredVars = @("dbhost", "dbname", "dbusername", "dbpassword", "base_url")
    foreach ($var in $requiredVars) {
        $found = $envContent | Where-Object { $_ -match ('^\s*' + $var + '\s*=') }
        if (!$found) {
            Write-Warning "Variable '$var' manquante dans .env.prod - le site risque de ne pas fonctionner."
        }
    }
    # Verifie si base_url se termine par /
    foreach ($line in $envContent) {
        if ($line -match '^base_url\s*=\s*(.+)$') {
            $url = $matches[1].Trim()
            if ($url.EndsWith('/')) {
                Write-Warning "La variable base_url de .env.prod ne doit pas se terminer par '/' - cela peut causer des erreurs dans les requetes API."
            }
        }
    }

    # Fin du code généré

    # =========================
    # Gestion du dossier build
    # =========================
    if (Test-Path -Path ./build) {
        Get-ChildItem ./build/* -Recurse | Remove-Item -Recurse -Force
    } else {
        New-Item -Path ./ -Name "build" -ItemType "directory"
    }

    # =========================
    # Build Frontend (React)
    # =========================
    Set-Location ./front

    npm run build

    if (!(Test-Path -Path ./dist/index.html -PathType leaf)) {
        Write-Host "[!] ERREUR : La compilation du frontend a echoue."
        return
    }

    Set-Location ../

    # =========================
    # Copie des fichiers
    # =========================

    # .htaccess & Web.config
    Copy-Item -Path ".htaccess" -Destination "./build/"
    Copy-Item -Path "Web.config" -Destination "./build/"

    # API
    Copy-Item -Path "./backend/api" -Destination "./build/" -Recurse

    # Frontend compilé
    Copy-Item -Path "./front/dist/*" -Destination "./build/" -Recurse

    Write-Host "[+] Build complete avec succes !"
}

Invoke-ExpoSAT