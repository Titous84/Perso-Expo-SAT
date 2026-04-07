/**
 * Tristan Lafontaine
 */
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { TEXTS } from '../../lang/fr';
import TeamMember from '../../types/sign-up/team-member';
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  REGEX,
} from '../../utils/constants';
import { INPUT_VARIANT } from '../../utils/muiConstants';
import { suffix } from '../../utils/utils';
import styles from './../../pages/ParticipantRegistration/ParticipantRegistrationPage.module.css';

/**
 *  Composant membre de l'équipe
 */
interface TeamMemberFormProps {
  teamMember: TeamMember;
  number: number;
  handleChangeTeamMember: (number: number, key: string, value: any) => void;
}

export default class TeamMemberForm extends React.Component<TeamMemberFormProps> {
  /**
   * Vérification personnaliser
   */
  componentDidMount() {
    //  Vérfier la longeur du champs nom famille
    ValidatorForm.addValidationRule('maxLenghtLastName', (value) => {
      if (value.length > MAX_LENGTH_LAST_NAME) {
        return false;
      }
      return true;
    });
    //  Vérifier la longeur du champs prénom
    ValidatorForm.addValidationRule('maxLenghtFirstName', (value) => {
      if (value.length > MAX_LENGTH_FIRST_NAME) {
        return false;
      }
      return true;
    });
    // Vérifie que le participant a sélectionné une clause de consentement photo.
    ValidatorForm.addValidationRule(
      'photoConsentRequired',
      (value) => value !== '',
    );
    // Vérifie que le numéro de DA contient exactement 7 chiffres.
    // @author Nathan Reyes
    ValidatorForm.addValidationRule('numeroDa7Chiffres', (value) =>
      /^\d{7}$/.test(value),
    );
  }

  //Permet d'enlever l'erreur des champs quand il respecte les critères
  componentWillUnmount() {
    // Retir l'erreur pour le champs prénom
    ValidatorForm.removeValidationRule('maxLenghtFirstName');
    // Retir l'erreur pour le champs nom famille
    ValidatorForm.removeValidationRule('maxLenghtLastName');
    // Retire l'erreur si aucune clause de consentement photo n'est sélectionnée.
    ValidatorForm.removeValidationRule('photoConsentRequired');
    // Retire la validation du numéro de DA à 7 chiffres.
    // @author Nathan Reyes
    ValidatorForm.removeValidationRule('numeroDa7Chiffres');
  }

  render() {
    return (
      <Paper
        elevation={8}
        className={`${styles.paddingPaper} ${styles.paddingPaperTop} ${styles.member}`}
      >
        <Paper className={`${styles.subhead} ${styles.stack}`}>
          <h2>
            {this.props.number}
            <sup>{suffix(this.props.number)}</sup> membre
          </h2>
        </Paper>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextValidator
              required
              variant={INPUT_VARIANT}
              label={TEXTS.signup.firstName.label}
              name={TEXTS.signup.firstName.label}
              onChange={(event: any) =>
                this.props.handleChangeTeamMember(
                  this.props.number,
                  'firstName',
                  event.target.value,
                )
              }
              value={this.props.teamMember.firstName}
              validators={['required', 'maxLenghtFirstName']}
              errorMessages={[
                TEXTS.signup.firstName.error.required,
                TEXTS.signup.firstName.error.maximum,
              ]}
              inputProps={{ maxLength: MAX_LENGTH_FIRST_NAME }}
              fullWidth
            />
            <p className={styles.alignRight}>
              {this.props.teamMember.firstName.length} / {MAX_LENGTH_FIRST_NAME}
            </p>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextValidator
              required
              variant={INPUT_VARIANT}
              label={TEXTS.signup.lastName.label}
              name={TEXTS.signup.lastName.label}
              onChange={(event: any) =>
                this.props.handleChangeTeamMember(
                  this.props.number,
                  'lastName',
                  event.target.value,
                )
              }
              value={this.props.teamMember.lastName}
              validators={['required', 'maxLenghtLastName']}
              errorMessages={[
                TEXTS.signup.lastName.error.required,
                TEXTS.signup.lastName.error.maximum,
              ]}
              inputProps={{ maxLength: MAX_LENGTH_LAST_NAME }}
              fullWidth
            />
            <p className={styles.alignRight}>
              {this.props.teamMember.lastName.length} / {MAX_LENGTH_LAST_NAME}
            </p>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <TextValidator
              required
              variant={INPUT_VARIANT}
              label="Numero DA"
              onChange={(event: any) =>
                this.props.handleChangeTeamMember(
                  this.props.number,
                  'numero_da',
                  event.target.value,
                )
              }
              name="Numero DA"
              value={this.props.teamMember.numero_da}
              validators={['required', 'matchRegexp:' + REGEX.DA_7_DIGITS, 'numeroDa7Chiffres']}
              errorMessages={[
                TEXTS.signup.numeroDa.error.required,
                TEXTS.signup.numeroDa.error.invalid,
                TEXTS.signup.numeroDa.error.invalid,
              ]}
              inputProps={{ maxLength: 7 }}
              fullWidth
            />
            <p className={styles.alignRight}>
              {this.props.teamMember.numero_da.length} / 7
            </p>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <FormControl>
              {/* Sélection de la clause de consentement photo selon les besoins d'ExpoSAT. */}
              {/* @author Nathan Reyes */}
              <FormLabel>{TEXTS.signup.photoConsent.title}</FormLabel>
              <RadioGroup
                name={`photo-consent-clause-${this.props.number}`}
                value={this.props.teamMember.photoConsentClause}
                onChange={(event: any) => {
                  const clauseSelectionnee = event.target.value;

                  // Synchronise l'ancien champ pictureConsent avec la clause choisie.
                  // @author Nathan Reyes
                  const consentementPhoto =
                    clauseSelectionnee === 'refus_total' ? 0 : 1;
                  this.props.handleChangeTeamMember(
                    this.props.number,
                    'photoConsentClause',
                    clauseSelectionnee,
                  );
                  this.props.handleChangeTeamMember(
                    this.props.number,
                    'pictureConsent',
                    consentementPhoto,
                  );
                }}
              >
                <FormControlLabel
                  value={'publication'}
                  control={<Radio />}
                  label={TEXTS.signup.photoConsent.publication}
                />
                <FormControlLabel
                  value={'usage_interne'}
                  control={<Radio />}
                  label={TEXTS.signup.photoConsent.internalUse}
                />
                <FormControlLabel
                  value={'refus_total'}
                  control={<Radio />}
                  label={TEXTS.signup.photoConsent.totalRefusal}
                />
              </RadioGroup>
              {/* Bugfix de la validation du champ de consentement photo qui ne se déclenchait pas correctement avec les RadioButtons. */}
              {/* @author Léandre Kanmegne - H26 */}
              {/* Code généré par Chatgpt modele 5.4 mars 2026 */}
              <TextValidator
                name={`photo-consent-clause-${this.props.number}`}
                value={this.props.teamMember.photoConsentClause}
                validators={['photoConsentRequired']}
                errorMessages={[TEXTS.signup.photoConsent.errorRequired]}
                inputProps={{
                  style: { display: 'none' },
                }}
                InputLabelProps={{
                  style: { display: 'none' },
                }}
                sx={{
                  '& .MuiInputBase-root': { display: 'none' },
                }}
                style={{ marginTop: '-8px' }}
              />
              {/* Fin du bugfix */}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 12 }}>
            {/* Option d'inscription anonyme demandée pour les listes. */}
            {/* @author Nathan Reyes */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.teamMember.isAnonymous === 1}
                  onChange={(event: any) => {
                    this.props.handleChangeTeamMember(
                      this.props.number,
                      'isAnonymous',
                      event.target.checked ? 1 : 0,
                    );
                  }}
                />
              }
              label={
                <span>
                  {TEXTS.signup.anonymousRegistration.label}
                  {/* Icône d'information menant vers les CGU. */}
                  {/* @author Nathan Reyes */}
                  <Tooltip
                    title={TEXTS.signup.anonymousRegistration.cguTooltip}
                  >
                    <IconButton
                      size="small"
                      component="a"
                      href={TEXTS.signup.anonymousRegistration.cguLink}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Consulter les CGU"
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </span>
              }
            />
          </Grid2>
        </Grid2>
      </Paper>
    );
  }
}
