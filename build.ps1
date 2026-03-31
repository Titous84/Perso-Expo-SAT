# ExpoSAT - Script de compilation et de packaging
# Source / Inspiré de :
# https://cours-alexandre-ouellet.github.io/projet-integrateur-1/

function Build-ExpoSAT {

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

    Write-Host "[OK] Fichiers .env valides."

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

Build-ExpoSAT