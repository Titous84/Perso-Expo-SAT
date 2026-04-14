# Documentation des modifications par cas d'utilisation

Ce document regroupe les travaux par **cas d'utilisation (CU)**, en séparant les tâches par domaine (BDD, backend, frontend, UX) afin de faciliter la lecture et le suivi.

---

## CU-1 — Inscriptions : anonymat + clauses de consentement photo

### Objectif
Permettre, lors de l'inscription d'un participant, de choisir une clause de consentement photo et d'activer l'anonymat.

### Fichiers concernés
- `migrations/2026-02-26_add_anonymat_et_clauses_photo.sql`
- `front/src/types/sign-up/team-member.ts`
- `front/src/pages/ParticipantRegistration/ParticipantRegistrationPage.tsx`
- `front/src/components/signup/team-member.tsx`
- `backend/api/src/Validators/ValidatorTeam.php`
- `backend/api/src/Repositories/SignUpTeamRepository.php`

### Tâches réalisées
#### Base de données
- Ajout des colonnes `is_anonymous` et `photo_consent_clause` dans `users` via migration.

#### Frontend
- Extension du type `TeamMember` avec les nouveaux champs.
- Ajout des champs dans le formulaire d'inscription (choix de la clause + anonymat).

#### Backend
- Validation des nouvelles valeurs reçues lors de l'inscription.
- Sauvegarde des champs `photo_consent_clause` et `is_anonymous` lors de la création des membres.

---

## CU-2 — Réinitialisation de fin d'évènement + ajustements d'administration

### Objectif
Introduire un flux de réinitialisation annuelle piloté par les administrateurs et améliorer la gestion des utilisateurs d'administration.

### Fichiers concernés
- `backend/api/src/Actions/Administrators/PostResetEventDataAction.php`
- `backend/api/src/Services/UserService.php`
- `backend/api/src/Repositories/UserRepository.php`
- `backend/api/config/routes.php`
- `front/src/api/users/userService.ts`
- `front/src/pages/AdministratorsList/AdministratorsListPage.tsx`
- `front/src/pages/JudgesList/JudgesListPage.tsx`
- `front/src/pages/JudgesList/JudgeTableToolbar.tsx`
- `front/src/types/AdministrationMainPage/AdministrationMainPageTabs.ts`
- `front/src/lang/fr.ts`

### Tâches réalisées
#### Backend API
- Ajout d'une route admin dédiée au reset annuel.
- Ajout du service et du repository pour exécuter la réinitialisation des données événementielles.

#### Frontend administration
- Ajout d'un bouton de déclenchement de la réinitialisation annuelle.
- Renommage de l'onglet « Administrateurs » vers « Paramètres généraux ».

#### Gestion des juges
- Conservation des juges dans le flux de réinitialisation.
- Ajout d'une option de désactivation de juges sélectionnés.

---

## CU-3 — Correctifs inscription, mot de passe oublié, UI et cohérence métier

### Objectif
Stabiliser le parcours d'inscription et corriger plusieurs comportements transversaux (inscription, récupération de mot de passe, affichage UI).

### Fichiers concernés
- `backend/api/src/Repositories/SignUpTeamRepository.php`
- `backend/api/src/Services/SignUpTeamService.php`
- `backend/api/src/Services/VerificationCodeService.php`
- `backend/api/src/Validators/ValidatorTeam.php`
- `front/src/pages/ParticipantRegistration/ParticipantRegistrationPage.tsx`
- `front/src/components/signup/team-member.tsx`
- `front/src/api/verificationCode/verificationCodeService.ts`
- `front/src/api/users/userService.ts`
- `front/src/components/TeamsListPage/TeamsTables/TeamsTable.tsx`
- `front/src/utils/constants.ts`
- `front/src/lang/fr.ts`
- `front/src/index.css`
- `front/src/components/NavigationBar/NavigationBar.module.css`
- `front/src/components/footer/footer.module.css`
- `front/src/pages/EvaluationGridsList/EvaluationGridsListPage.tsx`
- `front/src/pages/EvaluationGridsList/EvaluationGridsListPage.module.css`

### Tâches réalisées
#### Inscriptions (règles métier)
- Déplacement de la génération du numéro d'équipe côté backend (incrémentation fiable par catégorie).
- Alignement du format du numéro d'équipe avec l'acronyme exact de la catégorie (ex. `SH-IS1`, `Info2`).
- Validation explicite de l'envoi des courriels aux personnes-ressources.
- Validation stricte du numéro DA sur exactement 7 chiffres (frontend + backend).
- Autorisation d'inscription avec un seul membre (frontend + backend).

#### Mot de passe oublié
- Harmonisation du format de réponse de validation (`{ email }`).
- Migration des appels front vers les routes publiques sans jeton.

#### Interface (UX/UI)
- Ajustement CSS des barres de navigation (haut/bas) sur toute la largeur visible.
- Refonte de la page « Gestion des grilles d'évaluation ».
- Amélioration de la consultation du tableau admin des équipes (mode détail via double-clic).

---

## CU-4 — Affichage complet des tableaux équipes + reset annuel robuste

### Objectif
Corriger les coupures visuelles dans les tableaux d'administration et fiabiliser techniquement la réinitialisation annuelle.

### Fichiers concernés
- `front/src/components/TeamsListPage/TeamsTables/TeamsTable.tsx`
- `front/src/components/TeamsListPage/AllTeamsMembersTable/AllTeamsMembersTable.tsx`
- `backend/api/src/Repositories/UserRepository.php`
- `DOCUMENTATION/CAS_UTILISATIONS_MODIFICATIONS.md`

### Tâches réalisées
#### Tableaux (frontend)
- Ajout d'un conteneur horizontal scrollable et de `autoHeight` pour afficher complètement les tableaux.
- Ajustement responsive des colonnes (`flex`, `minWidth`) + masquage de colonnes secondaires par défaut.
- Remplacement de `Container` par `Box` dans la page d'administration pour supprimer la contrainte de `max-width`.

#### Réinitialisation annuelle (backend)
- Encapsulation du reset dans une transaction SQL (`beginTransaction`, `commit`, `rollBack`).
- Extension du reset à l'ensemble des données événementielles nécessaires (évaluations, critères, résultats, équipes, liaisons, contacts, participants).

#### Traçabilité
- Changements réalisés et commentés par `@author Nathan Reyes`.

---

## CU-5 — Ajustement final du périmètre de reset + confirmation utilisateur

### Objectif
Limiter précisément le reset annuel au besoin métier final et sécuriser l'action côté interface.

### Fichiers concernés
- `backend/api/src/Repositories/UserRepository.php`
- `front/src/pages/AdministratorsList/AdministratorsListPage.tsx`
- `DOCUMENTATION/CAS_UTILISATIONS_MODIFICATIONS.md`

### Tâches réalisées
#### Backend
- Réduction du périmètre du reset :
  - suppression des données d'équipes et liaisons,
  - suppression des horaires de passage via `evaluation` et `criteria_evaluation`,
  - suppression des résultats (`results`).
- Conservation explicite des administrateurs et des juges.

#### Frontend
- Ajout d'une confirmation obligatoire avant déclenchement de la réinitialisation annuelle.

#### Traçabilité
- Changements réalisés et commentés en français par `@author Nathan Reyes`.
