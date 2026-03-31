import APIResult from "../../types/apiResult";
import Category from "../../types/sign-up/category";
import TeamInfo from "../../types/sign-up/team-info";
import { APIRequest } from "../apiUtils";
import ContactPerson from '../../types/sign-up/contact-person';

/**
 * API pour la page d'inscription d'une équipe
 * @author Tristan Lafontaine
 */
export default class SignUpService {
  /**
   * Obtien les catégories
   * @returns Category[]
   */
  public static async tryGetCategory(): Promise<APIResult<Category[]>> {
    const response: APIResult<Category[]> = await APIRequest(
      'signup/category',
      'GET',
      false,
    );
    return response;
  }

  /**
   * Inscription d'une équipe
   * @param team TeamInfo Les informations de l'équipe
   * @returns
   */
  public static async tryPostTeam(
    team: TeamInfo,
  ): Promise<APIResult<TeamInfo>> {
    const body = {
      team,
    };
    const response: APIResult<TeamInfo> = await APIRequest(
      'signup/',
      'POST',
      false,
      body,
    );
    return response;
  }

    /**
     * Obtient les personnes-ressources pour l'inscription d'une équipe
     * @returns ContactPerson[]
     * @author Léandre Kanmegne - H26
     */
    public static async tryGetContactPersons(): Promise<APIResult<ContactPerson[]>> {
        return await APIRequest("signup/contact-persons", "GET", false);
    }
}