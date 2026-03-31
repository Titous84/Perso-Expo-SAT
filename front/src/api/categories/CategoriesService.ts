import APIResult from "../../types/apiResult";
import { APIRequest } from "../apiUtils";
import { ICategories } from "../../types/TeamsList/ICategories";

/**
 * Service pour les catégories d'équipes.
 * @author Breno Gomes - H26
 */
export default class CategoriesService {

    /**
     * Obtenir toutes les catégories
     */
    public static async tryGetCategories(): Promise<APIResult<ICategories[]>> {
        return await APIRequest(
            "gestion-equipes/categories",
            "GET",
            true
        );
    }

    /**
     * Créer une catégorie
     */
    public static async createCategory(name: string, acronym: string): Promise<APIResult<string>> {

        return await APIRequest(
            "gestion-equipes/categories",
            "POST",
            true,
            {
                name: name,
                acronym: acronym
            }
        );
    }

    /**
     * Modifier une catégorie
     */
    public static async updateCategory(category: ICategories): Promise<APIResult<string>> {
        return await APIRequest(
            `gestion-equipes/categories/${category.id}`,
            "PATCH",
            true,
            {
                "name": category.name,
                "acronym": category.acronym,
                "survey_id": category.survey_id,
                "activated": category.activated,
            }
        );  
    }
    
    /**
   * Supprime les catégories en fonction de leurs IDs
   */
  public static async deleteCategories(categoriesIds: number[]): Promise<APIResult<string>> {
    const body = { categories: categoriesIds };
    const response: APIResult<string> = await APIRequest(
      "gestion-equipes/categories",
      "DELETE",
      true,
      body
    );
    return response;
  }
}
