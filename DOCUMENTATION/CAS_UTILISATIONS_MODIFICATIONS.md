# 🧱 3. Description des cas d’utilisation

## Regroupement des cas d’utilisation qui fonctionnent ensemble

### Bloc A — Parcours d’inscription et validation des données

- **CU-01** : Inscription d’un participant avec anonymat et consentement.
- **CU-03** : Correctifs d’inscription, numéro d’équipe, DA, mot de passe oublié, et améliorations UI liées au parcours.

### Bloc B — Administration et réinitialisation annuelle

- **CU-02** : Mise en place du flux de réinitialisation annuelle et ajustements d’administration.
- **CU-05** : Ajustement final du périmètre de réinitialisation + confirmation utilisateur obligatoire.

### Bloc C — Consultation et affichage des données en administration

- **CU-04** : Affichage complet des tableaux équipes/membres + robustesse technique du reset.

---

## 🔹 CU-01 — Inscription d’un participant avec anonymat et consentement

### Fiche descriptive

- **Code** : CU-01
- **Nom** : Inscription d’un participant
- **Introduit** : Sprint 1
- **Personnes autrices** : Nathan Reyes

### Entité actrice

- **Primaire** : Participant

### Déclencheur

Le participant accède au formulaire d’inscription et veut enregistrer son équipe.

### Préconditions

- Le formulaire d’inscription est accessible.
- Les catégories sont disponibles dans le système.

### Postconditions

- L’équipe est créée.
- Les champs d’anonymat et de consentement photo sont sauvegardés.

### Scénario nominal

| Étape | Action de l’acteur                                       | Action du système                         |
| ----- | -------------------------------------------------------- | ----------------------------------------- |
| 1     | Le participant ouvre la page d’inscription               | Le système affiche le formulaire          |
| 2     | Il saisit les informations d’équipe et des membres       | Le système valide les champs requis       |
| 3     | Il choisit la clause de consentement photo et l’anonymat | Le système contrôle la validité des choix |
| 4     | Il soumet l’inscription                                  | Le système enregistre les données en base |

### Scénarios d’exception

- **2a** : Champs manquants ou invalides → erreurs de validation affichées.
- **3a** : Valeur invalide pour anonymat/consentement → refus de la requête.
- **4a** : Erreur serveur à la persistance → inscription échoue.

### Spécifications non fonctionnelles

- Validation obligatoire côté frontend et backend.
- Cohérence des données d’inscription en base.

### Références techniques (fichiers)

- `migrations/2026-02-26_add_anonymat_et_clauses_photo.sql`
- `front/src/types/sign-up/team-member.ts`
- `front/src/pages/ParticipantRegistration/ParticipantRegistrationPage.tsx`
- `front/src/components/signup/team-member.tsx`
- `backend/api/src/Validators/ValidatorTeam.php`
- `backend/api/src/Repositories/SignUpTeamRepository.php`

---

## 🔹 CU-02 — Réinitialisation annuelle des données (mise en place)

### Fiche descriptive

- **Code** : CU-02
- **Nom** : Réinitialisation annuelle des données
- **Introduit** : Sprint 2
- **Personnes autrices** : Nathan Reyes

### Entité actrice

- **Primaire** : Administrateur

### Déclencheur

L’administrateur déclenche la réinitialisation annuelle depuis l’interface d’administration.

### Préconditions

- L’administrateur est authentifié.
- La route de reset annuel est disponible.

### Postconditions

- Les données événementielles ciblées sont réinitialisées.
- Le système reste opérationnel après l’exécution.

### Scénario nominal

| Étape | Action de l’acteur                                 | Action du système                                           |
| ----- | -------------------------------------------------- | ----------------------------------------------------------- |
| 1     | L’administrateur ouvre la section d’administration | Le système affiche les options de gestion                   |
| 2     | Il lance l’action de réinitialisation annuelle     | Le système appelle l’API dédiée                             |
| 3     | Il suit l’exécution                                | Le système vide les données prévues et confirme le résultat |

### Scénarios d’exception

- **2a** : API inaccessible → message d’erreur affiché.
- **3a** : Erreur interne pendant le reset → rollback/erreur selon le contexte.

### Spécifications non fonctionnelles

- Exécution contrôlée et traçable.
- Messages utilisateur explicites en succès/échec.

### Références techniques (fichiers)

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

---

## 🔹 CU-03 — Stabilisation du parcours d’inscription et correctifs transversaux

### Fiche descriptive

- **Code** : CU-03
- **Nom** : Correctifs inscription + récupération de mot de passe + UI
- **Introduit** : Sprint 3
- **Personnes autrices** : Nathan Reyes

### Entité actrice

- **Primaire** : Participant
- **Secondaire** : Administrateur

### Déclencheur

Des incohérences métier et UX sont observées dans l’inscription, le format des numéros d’équipe/DA et le flux « mot de passe oublié ».

### Préconditions

- Les modules d’inscription et de récupération de mot de passe sont actifs.
- Les catégories possèdent un acronyme exploitable.

### Postconditions

- Le numéro d’équipe est généré côté backend avec format cohérent par catégorie.
- Le DA est validé strictement (7 chiffres).
- L’inscription à un membre est permise.
- Le flux « mot de passe oublié » fonctionne avec le bon format de réponse.

### Scénario nominal

| Étape | Action de l’acteur                          | Action du système                                              |
| ----- | ------------------------------------------- | -------------------------------------------------------------- |
| 1     | Le participant remplit son inscription      | Le système valide DA, membres et règles métier                 |
| 2     | Il soumet le formulaire                     | Le backend génère le numéro d’équipe et persiste l’inscription |
| 3     | Une récupération de mot de passe est lancée | Le système retourne un format `{ email }` exploitable          |
| 4     | L’administration consulte l’interface       | Les vues/tableaux et styles sont améliorés                     |

### Scénarios d’exception

- **1a** : DA invalide → message d’erreur.
- **2a** : Courriel personne-ressource non valide → inscription refusée.
- **3a** : Réponse de vérification invalide → flux interrompu avec erreur.

### Spécifications non fonctionnelles

- Cohérence métier entre frontend et backend.
- Lisibilité UI améliorée sur les pages concernées.

### Références techniques (fichiers)

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

---

## 🔹 CU-04 — Affichage complet des tableaux d’administration

### Fiche descriptive

- **Code** : CU-04
- **Nom** : Affichage complet des tableaux équipes et membres
- **Introduit** : Sprint 4
- **Personnes autrices** : Nathan Reyes

### Entité actrice

- **Primaire** : Administrateur

### Déclencheur

L’administrateur constate un affichage tronqué des données dans les tableaux (équipes/membres).

### Préconditions

- L’utilisateur est dans les écrans d’administration des équipes.
- Les données d’équipes et de membres sont disponibles.

### Postconditions

- Les tableaux sont lisibles au complet sans couper les colonnes importantes.
- Le comportement responsive est amélioré.

### Scénario nominal

| Étape | Action de l’acteur                            | Action du système                                      |
| ----- | --------------------------------------------- | ------------------------------------------------------ |
| 1     | L’administrateur ouvre la vue équipes/membres | Le système affiche les tableaux avec scroll horizontal |
| 2     | Il consulte les colonnes à zoom normal        | Le système applique `autoHeight`, `flex`, `minWidth`   |
| 3     | Il navigue dans la page                       | Le layout n’écrase plus les tableaux                   |

### Scénarios d’exception

- **1a** : Trop de colonnes visibles → colonnes secondaires masquées par défaut.
- **2a** : Contrainte de largeur du conteneur → remplacée par une zone fluide.

### Spécifications non fonctionnelles

- Affichage stable à 100% de zoom.
- Lisibilité et accessibilité améliorées.

### Références techniques (fichiers)

- `front/src/components/TeamsListPage/TeamsTables/TeamsTable.tsx`
- `front/src/components/TeamsListPage/AllTeamsMembersTable/AllTeamsMembersTable.tsx`
- `backend/api/src/Repositories/UserRepository.php`
- `DOCUMENTATION/CAS_UTILISATIONS_MODIFICATIONS.md`

---

## 🔹 CU-05 — Ajustement final du reset annuel + confirmation utilisateur

### Lien avec les autres cas

Ce cas représente l’ajustement final du processus de réinitialisation introduit au CU-02 et stabilisé au CU-04.

### Fiche descriptive

- **Code** : CU-05
- **Nom** : Réinitialisation annuelle (périmètre final)
- **Introduit** : Sprint 5
- **Personnes autrices** : Nathan Reyes

### Entité actrice

- **Primaire** : Administrateur

### Déclencheur

L’administrateur doit exécuter un reset annuel conforme au besoin métier final, avec confirmation explicite.

### Préconditions

- L’administrateur est authentifié.
- Le bouton de reset est visible dans l’interface.

### Postconditions

- Les données ciblées (équipes, liaisons, horaires via évaluations, résultats) sont réinitialisées.
- Les comptes administrateurs et juges sont conservés.

### Scénario nominal

| Étape | Action de l’acteur                          | Action du système                                   |
| ----- | ------------------------------------------- | --------------------------------------------------- |
| 1     | L’administrateur clique sur le reset annuel | Le système ouvre une boîte de confirmation          |
| 2     | Il confirme l’action                        | Le système exécute le reset avec le périmètre final |
| 3     | Il attend le retour                         | Le système affiche un message de succès/échec       |

### Scénarios d’exception

- **1a** : L’utilisateur annule → aucune modification de données.
- **2a** : Erreur backend → message d’échec, aucune suppression non prévue.

### Spécifications non fonctionnelles

- Confirmation obligatoire avant action destructive.
- Respect strict du périmètre métier défini.

### Références techniques (fichiers)

- `backend/api/src/Repositories/UserRepository.php`
- `front/src/pages/AdministratorsList/AdministratorsListPage.tsx`
- `DOCUMENTATION/CAS_UTILISATIONS_MODIFICATIONS.md`
