/**
 * Membre d'équipe.
 * Mathieu Sévégny
 */
export default interface TeamMember {
  /**
   * Prénom du membre (max 40 char.)
   */
  firstName: string;
  /**
   * Nom de famille du membre (max 40 char.)
   */
  lastName: string;
  /**
   * Numéro de DA du membre (max 255 char.)
   */
  numero_da: string;
  /**
   * Consentement d'être pris en photo
   */
  pictureConsent: number;
  /**
   * Clause de consentement photo sélectionnée par le participant.
   * @author Nathan Reyes
   */
  photoConsentClause: '' | 'publication' | 'usage_interne' | 'refus_total';
  /**
   * Indique si le participant souhaite masquer ses informations personnelles.
   * @author Nathan Reyes
   */
  isAnonymous: number;
}
