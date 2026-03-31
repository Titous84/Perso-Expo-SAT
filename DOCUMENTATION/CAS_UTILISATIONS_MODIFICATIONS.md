# Documentation des modifications par cas d'utilisation

## Cas 1 — Inscriptions (anonymat + clauses de consentement photo)

### Fichiers modifiés

- `migrations/2026-02-26_add_anonymat_et_clauses_photo.sql`
- `front/src/types/sign-up/team-member.ts`
- `front/src/pages/ParticipantRegistration/ParticipantRegistrationPage.tsx`
- `front/src/components/signup/team-member.tsx`
- `backend/api/src/Validators/ValidatorTeam.php`
- `backend/api/src/Repositories/SignUpTeamRepository.php`

### Résumé

- Ajout d'une migration SQL pour supporter `is_anonymous` et `photo_consent_clause` dans `users`.
- Ajout des champs côté front dans le type `TeamMember`.
- Ajout des champs au formulaire d'inscription participant (sélection de clause + anonymat).
- Validation backend des nouvelles informations.
- Persistance backend des nouvelles informations lors de la création des membres.

## Cas 2 — Réinitialisation de fin d'évènement + renommage de l'onglet

### Fichiers modifiés

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

### Résumé

- Ajout d'une route API admin pour lancer la réinitialisation annuelle.
- Ajout d'une méthode service/référentiel backend pour vider les données évènementielles.
- Ajout d'un bouton dans la page administrateurs pour déclencher la réinitialisation.
- Conservation des juges lors de la réinitialisation annuelle (ils ne sont plus supprimés).
- Ajout d'une option pour désactiver des juges sélectionnés dans la page de gestion des juges.
- Renommage de l'onglet « Administrateurs » en « Paramètres généraux ».

## Cas 3 — Correctifs inscription, interface et récupération de mot de passe

### Fichiers modifiés

- `backend/api/src/Repositories/SignUpTeamRepository.php`
- `backend/api/src/Services/SignUpTeamService.php`
- `backend/api/src/Services/VerificationCodeService.php`
- `front/src/pages/ParticipantRegistration/ParticipantRegistrationPage.tsx`
- `front/src/api/verificationCode/verificationCodeService.ts`
- `front/src/api/users/userService.ts`
- `backend/api/src/Validators/ValidatorTeam.php`
- `front/src/components/signup/team-member.tsx`
- `front/src/components/TeamsListPage/TeamsTables/TeamsTable.tsx`
- `front/src/utils/constants.ts`
- `front/src/lang/fr.ts`
- `front/src/index.css`
- `front/src/components/NavigationBar/NavigationBar.module.css`
- `front/src/components/footer/footer.module.css`
- `front/src/pages/EvaluationGridsList/EvaluationGridsListPage.tsx`
- `front/src/pages/EvaluationGridsList/EvaluationGridsListPage.module.css`

### Résumé

- Génération du numéro d'équipe déplacée côté backend pour assurer une incrémentation fiable par catégorie.
- Alignement du format des numéros d'équipe avec l'acronyme exact de la catégorie (ex: `SH-IS1`, `Info2`).
- Validation explicite de l'envoi des courriels aux personnes-ressources au moment de l'inscription d'une équipe.
- Harmonisation du format retourné par la validation du code de vérification (`{ email }`) pour corriger le flux « mot de passe oublié ».
- Ajustement des appels front du module « mot de passe oublié » pour utiliser les routes publiques sans jeton.
- Validation stricte du numéro DA à exactement 7 chiffres (front + backend) avec messages adaptés.
- Possibilité d'inscrire une équipe avec un seul membre (front + backend).
- Ajustement CSS des barres de navigation (haut/bas) pour occuper toute la largeur visible.
- Refonte de la page « Gestion des grilles d'évaluation » avec une interface plus claire (entête, recherche, état vide, cartes d'actions).
- Amélioration de l'affichage du tableau admin des équipes avec un mode de consultation détaillé (double-clic sur une ligne) pour voir toutes les informations sans troncature.

## Cas 4 — Correctifs affichage complet des tableaux équipes + réinitialisation annuelle robuste

### Fichiers modifiés

- `front/src/components/TeamsListPage/TeamsTables/TeamsTable.tsx`
- `front/src/components/TeamsListPage/AllTeamsMembersTable/AllTeamsMembersTable.tsx`
- `backend/api/src/Repositories/UserRepository.php`
- `DOCUMENTATION/CAS_UTILISATIONS_MODIFICATIONS.md`

### Résumé

- Ajout d'un conteneur horizontal scrollable et de `autoHeight` sur les tableaux « Vue des équipes » et « Vue des membres » afin d'éviter la coupure visuelle et d'afficher le tableau au complet selon l'espace disponible.
- Ajustement responsive des colonnes du tableau des équipes (`flex` + `minWidth`) et masquage par défaut de colonnes secondaires afin d'améliorer l'affichage complet à zoom normal (100%) sans dézoomer la page.
- Remplacement du `Container` MUI par une zone de contenu fluide (`Box`) dans la page d'administration, car la `max-width` du `Container` comprimait les tableaux et causait l'affichage tronqué.
- Renforcement de la réinitialisation annuelle côté backend avec transaction SQL (`beginTransaction` / `commit` / `rollBack`) pour éviter les états partiels qui pouvaient provoquer des bogues d'affichage.
- Extension de la réinitialisation annuelle pour inclure explicitement :
  - la réinitialisation des horaires de passage via la suppression des évaluations (tout en conservant la table de référence `time_slots`),
  - les résultats (`results`),
  - les évaluations et critères d'évaluation,
  - les liaisons d'équipes et les contacts associés,
  - les équipes et les participants.
- Les changements de ce cas ont été réalisés et commentés par `@author Nathan Reyes`.
