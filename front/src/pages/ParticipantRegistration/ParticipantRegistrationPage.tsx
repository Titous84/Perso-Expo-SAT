/**
 * @file Page d'inscription des participants.
 * @author Tristan Lafontaine
 */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField
} from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Navigate } from 'react-router';
import SignUpService from '../../api/signUp/signUpService';
import AlertComposant from '../../components/alert/alert';
import TeamContactPerson from '../../components/signup/team-contact-person';
import TeamInformation from '../../components/signup/team-info';
import TeamMemberForm from '../../components/signup/team-member';
import { TEXTS } from '../../lang/fr';
import APIResult from '../../types/apiResult';
import IPage from '../../types/IPage';
import Category from '../../types/sign-up/category';
import ContactPerson from '../../types/sign-up/contact-person';
import TeamInfo from '../../types/sign-up/team-info';
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from '../../utils/constants';
import { INPUT_VARIANT } from '../../utils/muiConstants';
import { ShowToast } from '../../utils/utils';
import styles from './ParticipantRegistrationPage.module.css';

/**
 * @constant {number} MIN_MEMBER - Le nombre minimum de membres par équipe.
 * @constant {number} MIN_CONTACT - Le nombre minimum de personnes ressources par équipe.
 * @constant {number} MAX_CONTACT - Le nombre maximum de personnes ressources par équipe.
 * @author Mathieu Sévégny
 */
// Permet l'inscription d'une équipe avec un seul participant.
// @author Nathan Reyes
const MIN_MEMBER = 1;
const MIN_CONTACT = 1;
const MAX_CONTACT = 2;

interface Member {
  firstName: string;
  lastName: string;
  numero_da: string;
}

interface SuccessMessage {
  title: string;
  description: string;
  category: string;
  year: string;
  members: Member[];
}

/**
 * Variables d'état du composant React: ParticipantRegistrationPage.
 * @author Tristan Lafontaine
 * @author Léandre Kanmegne - H26
 */
interface ParticipantRegistrationPageState {
  teamInfo: TeamInfo;
  categories: Category[];
  maxMembers: number;
  error: string[];
  sendSuccess: boolean;
  activeCircularProcress: boolean;
  successMessage: SuccessMessage;
  contactPersonsList: ContactPerson[];
  contactPersonDialogIndex: number | null;
  manualContactPersonIndexes: number[];
  contactPersonSearch: string;
}

/**
 * Page du formulaire d'inscription pour les participants.
 * @author Tristan Lafontaine
 */
export default class ParticipantRegistrationPage extends IPage<
  {},
  ParticipantRegistrationPageState
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      teamInfo: {
        title: '',
        description: '',
        category: '',
        year: '1re année',
        contactPerson: [{ email: '', fullName: '' }],
        members: [
          {
            numero_da: '',
            firstName: '',
            lastName: '',
            pictureConsent: 0,
            photoConsentClause: '',
            isAnonymous: 0,
          },
        ],
      },
      categories: [],
      maxMembers: 8,
      error: [],
      sendSuccess: false,
      successMessage: {
        title: '',
        description: '',
        category: '',
        year: '',
        members: [],
      },
      activeCircularProcress: false,
      /**
       * @author Léandre Kanmegne - H26
       */
      contactPersonsList: [],
      contactPersonDialogIndex: null,
      manualContactPersonIndexes: [],
      contactPersonSearch: '',
    };

    this.handleChangeForm = this.handleChangeForm.bind(this);
  }

  /**
   * Ajoute un membre à un tableau
   * Mathieu Sévégny
   */
  addPerson(type: 'members' | 'contactPerson') {
    let oldState: any = { ...this.state.teamInfo };
    let array: any[] = Array.from(oldState[type]);

    if (type === 'contactPerson') {
      array.push({ email: '', fullName: '' });
    } else {
      array.push({
        numero_da: '',
        firstName: '',
        lastName: '',
        pictureConsent: 0,
        photoConsentClause: '', // @author Nathan Reyes
        isAnonymous: 0, // @author Nathan Reyes
      });
    }

    oldState[type] = array;

    this.setState((prevState) => {
      let teamInfo = Object.assign({}, prevState.teamInfo);
      teamInfo = oldState;
      return { teamInfo };
    });
  }

  /**
   * Ajoute une personne ressource sélectionnée depuis la liste
   * @author Léandre Kanmegne - H26
   */
  addContactPersonFromList(person: ContactPerson) {
    this.setState((prevState) => {
      const currentList = [...prevState.teamInfo.contactPerson];
      const index = prevState.contactPersonDialogIndex;

      let nouvelleList;

      if (index !== null && index >= 0 && index < currentList.length) {
        nouvelleList = currentList.map((contact, i) =>
          i === index
            ? { fullName: person.fullName, email: person.email }
            : contact,
        );
      } else {
        const premierEstVide =
          currentList.length === 1 &&
          currentList[0].fullName === '' &&
          currentList[0].email === '';

        nouvelleList = premierEstVide
          ? [{ fullName: person.fullName, email: person.email }]
          : [
              ...currentList,
              { fullName: person.fullName, email: person.email },
            ];
      }

      return {
        teamInfo: {
          ...prevState.teamInfo,
          contactPerson: nouvelleList,
        },
        contactPersonDialogIndex: null,
        contactPersonSearch: '',
      };
    });
  }

  /**
   * Active le mode saisie manuelle pour une personne ressource
   * @author Léandre Kanmegne - H26
   */
  activateManualMode(index: number) {
    this.setState((prevState) => {
      const currentList = [...prevState.teamInfo.contactPerson];
      currentList[index] = { fullName: '', email: '' };
      return {
        teamInfo: { ...prevState.teamInfo, contactPerson: currentList },
        contactPersonDialogIndex: null,
        contactPersonSearch: '',
        manualContactPersonIndexes: [
          ...prevState.manualContactPersonIndexes,
          index,
        ],
      };
    });
  }

  /**
   * Enlève un membre à un tableau
   * Mathieu Sévégny
   */
  removePerson(type: 'members' | 'contactPerson') {
    let oldState: any = { ...this.state.teamInfo };
    let array: any[] = Array.from(oldState[type]);
    array.pop();
    oldState[type] = array;

    this.setState((prevState) => {
      let teamInfo = Object.assign({}, prevState.teamInfo);
      teamInfo = oldState;
      return { teamInfo };
    });
  }

  // Tristan Lafontaine
  handleChangeForm(event: any, key: string) {
    let teamInfo: any = { ...this.state };
    teamInfo.teamInfo[key] = event;
    if (key === 'category') {
      teamInfo['maxMembers'] = this.state.categories.filter(
        (category) => category.name === event,
      )[0].max_members;
    }
    this.setState(teamInfo);
  }

  /**
   * Tristan Lafontaine
   */
  componentDidMount() {
    this.getCategory();

    /**
     * @author Léandre Kanmegne - H26
     */
    this.getContactPersons();

    ValidatorForm.addValidationRule('maxLenghtLastName', (value) => {
      if (value.length > MAX_LENGTH_LAST_NAME) return false;
      return true;
    });
    ValidatorForm.addValidationRule('maxLenghtFirstName', (value) => {
      if (value.length > MAX_LENGTH_FIRST_NAME) return false;
      return true;
    });
    ValidatorForm.addValidationRule('maxLenghtEmail', (value) => {
      if (value.length > MAX_LENGTH_EMAIL) return false;
      return true;
    });
  }

  /**
   * Réagit aux changements dans les formulaires des membres.
   * Mathieu Sévégny
   */
  handleChangeTeamMemberForm(number: number, key: string, value: any) {
    // @author Nathan Reyes
    this.setState((prevState) => {
      const array: any[] = Array.from(prevState.teamInfo.members);
      let person: any = { ...array[number - 1] };
      person[key] = value;
      array[number - 1] = person;
      let teamInfo = Object.assign({}, prevState.teamInfo);
      teamInfo.members = array;
      return { teamInfo };
    });
  }

  /**
   * Réagit aux changements dans les formulaires des personnes ressources.
   * Mathieu Sévégny
   */
  handleChangeContactForm(number: number, key: string, value: any) {
    let array: any[] = Array.from(this.state.teamInfo.contactPerson);
    let person: any = { ...array[number - 1] };
    person[key] = value;
    array[number - 1] = person;

    this.setState((prevState) => {
      let teamInfo = Object.assign({}, prevState.teamInfo);
      teamInfo.contactPerson = array;
      return { teamInfo };
    });
  }

  // Tristan Lafontaine
  componentWillUnmount() {
    ValidatorForm.removeValidationRule('maxLenghtEmail');
    ValidatorForm.removeValidationRule('maxLenghtFirstName');
    ValidatorForm.removeValidationRule('maxLenghtLastName');
  }

  /**
   * Génère les formulaires de membres.
   * Mathieu Sévégny
   */
  generateTeamMemberForms() {
    let counter = 0;
    return this.state.teamInfo.members.map((teamMember) => {
      counter++;
      return (
        <TeamMemberForm
          key={'member' + String(counter)}
          handleChangeTeamMember={(n, k, v) =>
            this.handleChangeTeamMemberForm(n, k, v)
          }
          number={counter}
          teamMember={teamMember}
        />
      );
    });
  }

  /**
   * Génère les formulaires des personnes ressources.
   * @author Mathieu Sévégny
   */
  generateContactPersonForms() {
    let counter = 0;
    return this.state.teamInfo.contactPerson.map((contactPerson) => {
      counter++;
      return (
        <TeamContactPerson
          key={'contact' + String(counter)}
          handleChangeContact={(n, k, v) =>
            this.handleChangeContactForm(n, k, v)
          }
          number={counter}
          contactPerson={contactPerson}
          readOnly={
            !this.state.manualContactPersonIndexes.includes(counter - 1)
          }
          onChangeContactPerson={(n) =>
            this.setState({ contactPersonDialogIndex: n - 1 })
          }
        />
      );
    });
  }

  /**
   * @author Tristan Lafontaine
   */
  generateAlert() {
    let counter = 0;
    if (this.state.error.length > 0) {
      return this.state.error.map((error) => {
        counter++;
        return (
          <AlertComposant
            key={'alert' + String(counter)}
            typeAlert="error"
            errorMessage={error}
            titleAlert="Erreur"
          />
        );
      });
    } else if (this.state.sendSuccess === true) {
      return (
        <Navigate
          replace
          to="/inscription-reussie"
          state={{ successMessage: this.state.successMessage }}
        />
      );
    }
  }

  /**
   * Tristan Lafontaine
   */
  async getCategory() {
    const response = await SignUpService.tryGetCategory();
    if (response.error) {
      ShowToast(response.error!, 5000, 'error', 'top-center', false);
    } else {
      if (response.data) {
        var categoriesData = response.data;
        if (categoriesData) {
          this.setState({ categories: categoriesData });
        }
      }
    }
  }

  /**
   * @author Léandre Kanmegne - H26
   */
  async getContactPersons() {
    const response = await SignUpService.tryGetContactPersons();
    if (response.error) {
      ShowToast(response.error!, 5000, 'error', 'top-center', false);
    } else if (response.data) {
      this.setState({ contactPersonsList: response.data });
    }
  }

  /**
   * @author Tristan Lafontaine
   */
  async onSubmit() {
    this.setState({ activeCircularProcress: true });

    if (!this.state.categories || this.state.categories.length === 0) {
      ShowToast(
        'Les catégories ne sont pas encore chargées. Veuillez réessayer dans quelques secondes.',
        5000,
        'warning',
        'top-center',
        false,
      );
      this.setState({ activeCircularProcress: false });
      return;
    }

    // Le numéro d'équipe est désormais généré côté serveur pour éviter les doublons.
    // @author Nathan Reyes
    const teamInfoWithNumber = {
      ...this.state.teamInfo,
    };

    const response: APIResult<any> =
      await SignUpService.tryPostTeam(teamInfoWithNumber);

    if (response.error && !response.data) {
      var error = response.error;
      if (error) {
        if (error === TEXTS.api.errors.communicationFailed) {
          this.setState({ error: Array(error) });
        } else {
          const results: string[] = Object.values(error);
          this.setState({ error: results });
        }
        window.scrollTo(0, 0);
        this.setState({ activeCircularProcress: false });
      }
    } else {
      if (response.data) {
        var apiResponse = response.data;
        if (apiResponse) {
          const results: string[] = Object.values(apiResponse);
          if (results[0] === 'Ajout réussi') {
            this.setState({ error: [] });

            const teamInfo = this.state.teamInfo;
            const successMessage = {
              title: teamInfo.title,
              description: teamInfo.description,
              category: teamInfo.category,
              year: teamInfo.year,
              members: teamInfo.members.map((member) => ({
                firstName: member.firstName,
                lastName: member.lastName,
                numero_da: member.numero_da,
              })),
            };

            this.setState({
              sendSuccess: true,
              successMessage: successMessage,
            });
          } else {
            window.scrollTo(0, 0);
            this.setState({ error: results });
          }
        }
        this.setState({ activeCircularProcress: false });
      } else {
        this.setState({ error: ['Erreur inconnue.'] });
        this.setState({ activeCircularProcress: false });
      }
    }
  }

  error() {
    window.scrollTo(0, 0);
  }

  circluarProgess() {
    return (
      <div className={`${styles.pageFullScreen} ${styles.flexTitle}`}>
        <CircularProgress size={50} color="inherit" />
      </div>
    );
  }

  public render() {
    return (
      <>
        {this.state.activeCircularProcress === false ? (
          <Box className="centeredContainer">
            <div data-testid="inscription" className="formContainer">
              <ValidatorForm noValidate onSubmit={() => this.onSubmit()}>
                {this.generateAlert()}
                <h1 className={styles.title}>{TEXTS.signup.title}</h1>
                <Box className={styles.paddingPaperTop}>
                  <div>
                    <TeamInformation
                      teamInfo={this.state.teamInfo}
                      handleChangeForm={this.handleChangeForm}
                      categories={this.state.categories}
                    />
                    <div className={styles.paddingEntreCarre}>
                      {this.generateContactPersonForms()}
                      <br />
                      <div className={styles.center}>
                        {/* Bouton d'ajout de personne ressource */}
                        {/* @author Léandre Kanmegne - H26 */}
                        {this.state.teamInfo.contactPerson.length <
                          MAX_CONTACT && (
                          <Button
                            variant={INPUT_VARIANT}
                            className={styles.boutonMembre}
                            onClick={() =>
                              this.setState({ contactPersonDialogIndex: -1 })
                            }
                          >
                            {TEXTS.signup.information.buttonContactPerson.add}
                          </Button>
                        )}
                        {/* Bouton de retrait de personne ressource */}
                        {/* Mathieu Sévégny */}
                        {this.state.teamInfo.contactPerson.length >
                          MIN_CONTACT && (
                          <Button
                            variant={INPUT_VARIANT}
                            className={styles.boutonMembre}
                            onClick={() => this.removePerson('contactPerson')}
                          >
                            {
                              TEXTS.signup.information.buttonContactPerson
                                .remove
                            }
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <h2>{TEXTS.signup.textMember.title}</h2>
                  <h3>{TEXTS.signup.textMember.text}</h3>
                  <div className={styles.paddingEntreCarre}>
                    {this.generateTeamMemberForms()}
                    <br />
                    <div className={styles.center}>
                      {/* Bouton d'ajout de membre */}
                      {/* Mathieu Sévégny */}
                      {this.state.teamInfo.members.length <
                        this.state.maxMembers && (
                        <Button
                          variant={INPUT_VARIANT}
                          className={styles.boutonMembre}
                          onClick={() => this.addPerson('members')}
                        >
                          {TEXTS.signup.buttons.addMember}
                        </Button>
                      )}
                      {/* Bouton de retrait de membre */}
                      {/* Mathieu Sévégny */}
                      {this.state.teamInfo.members.length > MIN_MEMBER && (
                        <Button
                          variant={INPUT_VARIANT}
                          className={styles.boutonMembre}
                          onClick={() => this.removePerson('members')}
                        >
                          {TEXTS.signup.buttons.removeMember}
                        </Button>
                      )}
                    </div>
                    <br />
                  </div>
                </Box>

                <div className={styles.centerSubmitForm}>
                  <Button
                    type="submit"
                    variant={INPUT_VARIANT}
                    className={styles.boutonMembre}
                    onClick={this.error}
                  >
                    {TEXTS.ajoutAdmin.btnconn}
                  </Button>
                </div>
              </ValidatorForm>
              <br />
            </div>

            {/* Dialogue de sélection de personne ressource */}
            {/* @author Léandre Kanmegne - H26 */}
            <Dialog
              open={this.state.contactPersonDialogIndex !== null}
              onClose={() =>
                this.setState({
                  contactPersonDialogIndex: null,
                  contactPersonSearch: '',
                })
              }
            >
              <DialogTitle>Sélectionner une personne ressource</DialogTitle>
              <Box sx={{ px: 2, pt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Rechercher..."
                  value={this.state.contactPersonSearch}
                  onChange={(e) =>
                    this.setState({ contactPersonSearch: e.target.value })
                  }
                />
              </Box>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {this.state.contactPersonsList
                  .filter(
                    (p) =>
                      p.fullName
                        .toLowerCase()
                        .includes(
                          this.state.contactPersonSearch.toLowerCase(),
                        ) ||
                      p.email
                        .toLowerCase()
                        .includes(this.state.contactPersonSearch.toLowerCase()),
                  )
                  .map((person) => (
                    <ListItem key={person.email} disablePadding>
                      <ListItemButton
                        onClick={() => this.addContactPersonFromList(person)}
                      >
                        <ListItemText
                          primary={person.fullName}
                          secondary={person.email}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
              <p
                style={{ textAlign: 'center', color: 'gray', margin: '4px 0' }}
              >
                ou
              </p>
              <ListItem
                sx={{
                  justifyContent: 'center',
                  py: 1,
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >
                <Button
                  variant={INPUT_VARIANT}
                  className={styles.boutonMembre}
                  onClick={() =>
                    this.activateManualMode(
                      this.state.contactPersonDialogIndex === -1
                        ? this.state.teamInfo.contactPerson.length - 1
                        : this.state.contactPersonDialogIndex!,
                    )
                  }
                >
                  Saisir manuellement
                </Button>
              </ListItem>
            </Dialog>
          </Box>
        ) : (
          this.circluarProgess()
        )}
      </>
    );
  }
}
