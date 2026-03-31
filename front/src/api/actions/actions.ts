import APIResult from "../../types/apiResult";
import SendEvaluation from "../../types/JudgeEvaluation/sendEvaluation";
import { APIRequest } from "../apiUtils";
import Judge from "../../types/judge";

export default class Actions {
  /**
   * Obtien une réponse à la suite d'envoi des courriels d'évaluations aux juges
   * @returns SendEvaluation[]
   * @author Charles Lavoie
   */
  public static async trySendEvaluation(): Promise< APIResult<SendEvaluation[]> > {
    const response: APIResult<SendEvaluation[]> = await APIRequest(
      'evaluation/send',
      'GET',
      false,
    );
    return response;
  }

  /**
   * Obtien une réponse à la suite d'envoi du courriel à un seul juge
   * @param judges Liste de juges à qui envoyer le courriel
   * @returns SendEvaluation[]
   * @author Tommy Garneau
   * Code revise par @author Léandre Kanmegne - H26
   * Permet d'envoyer les évaluations à une liste de juges sélectionnés, en affichant un message de succès ou d'erreur selon le résultat de l'opération. Après l'envoi, redirige automatiquement vers la page d'administration des juges.
   */
  public static async trySendEvaluationIndividually(judges: Judge[], ): Promise<APIResult<SendEvaluation[]>> {
    const response: APIResult<SendEvaluation[]> = await APIRequest(
      'evaluation/sendIndividually',
      'POST',
      true,
      judges,
    );
    return response;
  }
}