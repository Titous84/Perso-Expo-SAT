import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResultService from '../../api/result/resultService';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';
import { TEXTS } from '../../lang/fr';
import ResultInfo from '../../types/results/resultInfo';
import { ShowToast } from '../../utils/utils';
import EvaluationResultsToolbar from './EvaluationResultsTableToolBar';
import styles from './EvaluationsResultsListPage.module.css';

/**
 * NavigateButtonProps est une interface pour les propriétés du composant NavigateButton.
 * 
 * @property {EnhancedResultInfo} teamDetails Détails de l'équipe pour laquelle le bouton de navigation est affiché.
 * 
 * @author Francis Payan
 * Code partiellement généré par ChatGPT et Copilot.
 * @see https://www.chatgpt.com/
 */
interface NavigateButtonProps {
    teamDetails: EnhancedResultInfo;
}

/**
 * JudgeExclusion est une interface pour les informations d'exclusion d'un score de juge.
 * 
 * @property {string} teamName Nom de l'équipe concernée.
 * @property {string} judgeName Nom du juge concerné.
 * @property {boolean} isExcluded Indique si le score du juge est exclu ou non.
 * 
 * @author Francis Payan
 * Code partiellement généré par ChatGPT et Copilot.
 * @see https://www.chatgpt.com/
 */
interface JudgeExclusion {
    teamName: string;
    judgeName: string;
    isExcluded: boolean;
}

interface ResultRowData {
    categorie: string;
    teams_name: string;
    first_name_user: string;
    last_name_user: string;
    judge_id: number;
    comments: string;
    global_score: number;
    finalScore: number;
    judgeScores: {
        score: number;
        judgeName: string;
        isChecked: boolean;
        comments: string;
        judge_id: number;
    }[];
    id: number;
}

/**
 * Interface qui définit la structure des informations de résultat après traitement et calcul. 
 * 
 * @extends ResultInfo Informations de base du résultat.
 * @property {number | null} finalScore Score final calculé de l'équipe, peut être null si non calculé.
 * @property {{score: number; judgeName: string; isChecked: boolean}[]} judgeScores Liste des scores attribués par les juges, incluant : le nom du juge et si le score est sélectionné pour le calcul final.
 * 
 * @author Francis Payan
 * Code partiellement généré par ChatGPT et Copilot.
 * @see https://www.chatgpt.com/
 */
export interface EnhancedResultInfo extends ResultInfo {
    finalScore?: number | null;
    judgeScores: {
        score: number;
        judgeName: string;
        isChecked: boolean;
        comments?: string;
        judge_id: number;  // ID de l'évaluation pour chaque score de juge
    }[];
}

/**
 * Définit l'état du composant ResultsList.
 * 
 * @property {EnhancedResultInfo[]} results Tableau contenant les résultats détaillés de chaque équipe.
 * @property {Object} excludedScores Dictionnaire stockant l'état d'exclusion des scores pour chaque juge et chaque équipe.
 * @property {number} resetKey Clé pour réinitialiser les tris du tableau.
 * 
 * @author Francis Payan
 * Code partiellement généré par ChatGPT et Copilot.
 * @see https://www.chatgpt.com/
 * 
 */
interface EvaluationsResultsListPageState {
  results: EnhancedResultInfo[];
  excludedScores: { [teamName: string]: { [judgeName: string]: boolean } };
  resetKey: number; // Clé pour réinitialiser les tri du tableau
  selectedRows: number[];
  selectedJudgeScores: { teamName: string; judgeId: number }[];
  // Dialog de confirmation pour la suppression des notes sélectionnées
  // @author Léandre Kanmegne - H26
  isConfirmDeleteOpen: boolean;
  isConfirmDeleteTeamsOpen: boolean;
  // Dialog pour les détails de l'équipe
  // @author Léandre Kanmegne - H26
  detailTeam: EnhancedResultInfo | null;
  deleteTarget: { teamName: string; judgeId: number } | null;
  isConfirmDeleteJudgeOpen: boolean;
}

/**
 * Composant NavigateButton pour le bouton de navigation vers les détails de l'équipe.
 * 
 * @param {NavigateButtonProps} props Propriétés passées au composant.
 * @property {EnhancedResultInfo} teamDetails Détails de l'équipe pour laquelle le bouton de navigation est affiché.
 * @returns {React.FC<NavigateButtonProps>} Composant NavigateButton pour le bouton de navigation vers les détails de l'équipe.
 * 
 * @author Francis Payan
 * Code partiellement généré par ChatGPT et Copilot.
 * @see https://www.chatgpt.com/
 */
const NavigateButton: React.FC<NavigateButtonProps> = ({ teamDetails }) => {
    const navigate = useNavigate();

    return (
        <Button
            variant="contained"
            color="secondary"
            className="resetButton"
            onClick={() => navigate(`/details-equipe/${teamDetails.teams_name}`, { state: { teamDetails } })}
        >
            Détails
        </Button>
    );
};


/**
 * Page des résultats des évaluations des équipes par les juges.
 * 
 * Initialise l'état du composant avec les résultats et les notes exclues.
 * @param {Object} props Propriétés passées au composant.
 * 
 * @author Souleymane Soumaré
 * @editor Francis Payan 
 */
class EvaluationsResultsListPage extends React.Component<
  {},
  EvaluationsResultsListPageState
> {
  private hasMounted = false; // Indique si le composant a été monté pour éviter les appels d'API redondants

  constructor(props: {}) {
    super(props);
    this.state = {
      results: [],
      excludedScores: {},
      resetKey: 0,
      selectedRows: [],
      selectedJudgeScores: [],
      isConfirmDeleteOpen: false,
      detailTeam: null,
      deleteTarget: null,
      isConfirmDeleteJudgeOpen: false,
      isConfirmDeleteTeamsOpen: false,
    };
  }

  /**
   * Appelle les fonctions pour récupérer les informations des résultats et les états d'exclusion des notes des juges.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  async componentDidMount() {
    // Bugfix : Ajoute une vérification pour éviter les appels d'API redondants causés par React StrictMode en mode développement, en utilisant une variable d'instance pour suivre si le composant a déjà été monté.
    // @author Léandre Kanmegne - H26
    if (this.hasMounted) return;
    this.hasMounted = true;

    await this.getInfos(true); // Récupère les infos existantes
    await this.fetchJudgeScoreExclusions(); // Fonction pour récupérer l'état d'exclusion des notes des juges
  }

  /**
   * Transforme les données d'exclusion des notes des juges en un format plus facile à gérer.
   *
   * @param {JudgeExclusion[]} exclusions Les données d'exclusion des scores des juges à transformer.
   * @returns {Object} Un objet contenant les états d'exclusion des scores pour chaque juge et chaque équipe.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  mapExclusionsToState(exclusions: JudgeExclusion[]): {
    [teamName: string]: { [judgeName: string]: boolean };
  } {
    const exclusionState: {
      [teamName: string]: { [judgeName: string]: boolean };
    } = {};
    exclusions.forEach((exclusion) => {
      // Pour chaque exclusion de note de juge
      if (!exclusionState[exclusion.teamName]) {
        // Si l'équipe n'a pas encore été traitée
        exclusionState[exclusion.teamName] = {}; // Crée un objet pour stocker les exclusions de note de juge pour l'équipe
      }
      exclusionState[exclusion.teamName][exclusion.judgeName] =
        exclusion.isExcluded; // Stocke l'état d'exclusion de la note de juge pour l'équipe
    });
    return exclusionState; // Retourne l'état d'exclusion des notes des juges pour chaque équipe
  }

  /**
   * Récupère les données d'exclusion des notes des juges depuis le service API.
   *
   * @returns {Promise<void>} Une promesse qui résout une fois les données d'exclusion sont récupérées.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  async fetchJudgeScoreExclusions() {
    const exclusionsResponse = await ResultService.getScoreExclusions(); // Appel API pour récupérer les exclusions de notes des juges
    if (exclusionsResponse.data) {
      // Si l'appel API est un succès et que les données sont retournées
      const exclusionsData = exclusionsResponse.data; // Récupère les données d'exclusion des notes des juges
      const exclusions: JudgeExclusion[] =
        this.transformExclusions(exclusionsData); // Transforme les données d'exclusion des notes des juges
      this.setState({ excludedScores: this.mapExclusionsToState(exclusions) }); // Met à jour l'état avec les données d'exclusion des notes des juges
    }
  }

  /**
   * Transforme les données d'exclusion des notes des juges en un format plus facile à gérer.
   *
   * @param {Object} data Les données d'exclusion des notes des juges à transformer.
   * @returns {JudgeExclusion[]} Un tableau d'objets JudgeExclusion contenant les états d'exclusion des scores pour chaque juge et chaque équipe.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  transformExclusions(data: {
    [teamName: string]: { [judgeName: string]: boolean };
  }): JudgeExclusion[] {
    let exclusions: JudgeExclusion[] = [];
    Object.keys(data).forEach((teamName) => {
      Object.keys(data[teamName]).forEach((judgeName) => {
        exclusions.push({
          teamName,
          judgeName,
          isExcluded: data[teamName][judgeName],
        });
      });
    });
    return exclusions;
  }

  /**
   * Récupère les résultats de l'évaluation depuis le service API et les traite.
   *
   * @author Souleymane Soumaré
   * @editor Francis Payan
   * Bugfix : Vide le tableau si pas de données retournées par l'API.
   * @author Léandre Kanmegne - H26
   */
  async getInfos(showToast: boolean = false) {
    const APIResults = await ResultService.GetResult();
    if (
      APIResults.data &&
      Array.isArray(APIResults.data) &&
      APIResults.data.length > 0 &&
      typeof APIResults.data[0] === 'object'
    ) {
      const enhancedResultsWithoutIds = this.enhanceAndGroupResults(
        APIResults.data,
      );
      const enhancedResults = enhancedResultsWithoutIds.map(
        (result, index) => ({ ...result, id: index }),
      );
      this.setState({ results: enhancedResults });
    } else {
      this.setState({ results: [] });
      if (showToast) {
        ShowToast(
          'Aucun résultat à afficher',
          5000,
          'warning',
          'top-center',
          false,
        );
      }
    }
  }

  /**
   * Regroupe les résultats par équipe et calcule la note finale pour chaque équipe.
   *
   * @param {ResultInfo[]} results Les résultats bruts à transformer et à grouper.
   * @returns {EnhancedResultInfo[]} Un tableau d'objets EnhancedResultInfo avec les notes par équipe et la note finale calculée.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  enhanceAndGroupResults(results: ResultInfo[]): EnhancedResultInfo[] {
    const groupedResults: { [key: string]: EnhancedResultInfo } = {}; // cette variable stockera les résultats groupés par équipe

    results.forEach((result) => {
      // pour chaque résultat brut reçu du service API
      const teamName = result.teams_name; // récupère le nom de l'équipe
      const judgeScoreEntry = {
        // crée un objet pour stocker la note du juge et s'il est inclus dans le calcul final ou non
        score: result.global_score,
        judgeName: `${result.first_name_user} ${result.last_name_user}`,
        isChecked: false, // initialise à false pour inclure la note dans le calcul final par défaut
        comments: result.comments || 'Aucun commentaire',
        judge_id: result.judge_id, // Id du juge pour chaque score de juge
      };

      if (!groupedResults[teamName]) {
        // si l'équipe n'a pas encore été traitée
        groupedResults[teamName] = {
          // crée un nouvel objet pour stocker les scores de l'équipe
          ...result, // copie les informations de base de l'équipe
          finalScore: null, // Initialise finalScore avec null
          judgeScores: [judgeScoreEntry], // Ajoute la note du juge à la liste des scores de l'équipe
        };
      } else {
        // Ici, nous nous assurons que judgeScores est un tableau non null avant de faire un push
        groupedResults[teamName].judgeScores =
          groupedResults[teamName].judgeScores || [];
        groupedResults[teamName].judgeScores.push(judgeScoreEntry); // Ajoute la note du juge à la liste des notes de l'équipe
      }
    });

    /**
     * Calcule la note finale pour chaque équipe en excluant les scores marqués comme non inclus.
     *
     * @param {EnhancedResultInfo[]} groupedResults Les résultats groupés par équipe.
     * @returns {EnhancedResultInfo[]} Les résultats après modifications avec les notes finales calculées.
     *
     * @editor Francis Payan
     * Code partiellement généré par ChatGPT et Copilot.
     * @see https://www.chatgpt.com/
     */
    const finalResults: EnhancedResultInfo[] = Object.values(
      groupedResults,
    ).map((teamResult) => {
      // Calcule la note finale en excluant les scores qui sont marqués comme non inclus
      const includedScores = teamResult.judgeScores!.filter(
        (js) => !js.isChecked,
      );
      const totalScore = includedScores.reduce(
        (acc, curr) => acc + curr.score,
        0,
      ); // Calcule la somme des notes, acc = accumulateur, curr = valeur actuelle
      const finalScore =
        includedScores.length > 0
          ? Math.round(totalScore / includedScores.length)
          : null; // Calcule la note finale en arrondissant à l'entier le plus proche

      return {
        // Retourne un objet EnhancedResultInfo avec les informations de l'équipe et la note finale calculée
        ...teamResult, // Copie les informations de l'équipe
        finalScore, // Stocke la note finale calculée dans l'objet
      };
    });

    /**
     * Trie les résultats par catégorie puis par note finale décroissante.
     *
     * @param {EnhancedResultInfo} a Le premier résultat à comparer.
     * @param {EnhancedResultInfo} b Le deuxième résultat à comparer.
     * @returns {number} La valeur de comparaison entre les deux résultats.
     *
     * @author Francis Payan
     * Code partiellement généré par ChatGPT et Copilot.
     * @see https://www.chatgpt.com/
     */
    finalResults.sort((a, b) => {
      const categoryCompare = a.categorie.localeCompare(b.categorie); // Trie par catégorie
      if (categoryCompare !== 0) return categoryCompare; // Si les catégories sont différentes, retourne la comparaison des catégories
      return b.finalScore! - a.finalScore!; // Trie par note finale décroissante
    });

    return finalResults; // Retourne le tableau des résultats après modification et triés
  }

  /**
   * Gère l'action d'exclusion d'un score de juge pour une équipe donnée.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event L'événement déclencheur qui contient l'état coché de l'élément.
   * @param {string} teamName Le nom de l'équipe concernée par la modification.
   * @param {string} judgeName Le nom du juge concerné par la modification.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  handleScoreExclusion = (
    event: React.ChangeEvent<HTMLInputElement>,
    teamName: string,
    judgeName: string,
  ) => {
    const isChecked = event.target.checked; // Récupère l'état coché de l'élément
    this.setState(
      (prevState) => ({
        // Met à jour l'état en excluant le score du juge pour l'équipe concernée
        ...prevState, // Copie l'état actuel
        excludedScores: {
          // Met à jour l'état des notes exclues
          ...prevState.excludedScores, // Copie l'état actuel des notes exclues
          [teamName]: {
            // Met à jour l'état des notes exclues pour l'équipe concernée
            ...prevState.excludedScores[teamName], // Copie l'état actuel des notes exclues pour l'équipe concernée
            [judgeName]: isChecked, // Met à jour l'état de la note du juge pour l'équipe concernée
          },
        },
      }),
      () => {
        // Après la mise à jour de l'état, recalcule les notes finales
        const enhancedResults = this.enhanceAndGroupResults(this.state.results);
        this.setState({ results: enhancedResults }); // Met à jour l'état avec les résultats traités et calculés
      },
    );
  };

  /**
   * Inverse l'état d'inclusion d'un score de juge pour une équipe spécifique.
   *
   * @param teamName Le nom de l'équipe pour laquelle la note du juge doit être modifié.
   * @param judgeName Le nom du juge dont la note est concerné.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  toggleJudgeScore = async (teamName: string, judgeName: string) => {
    this.setState((prevState) => {
      // Met à jour l'état en inversant l'état d'inclusion de la note du juge pour l'équipe concernée
      const resultsCopy = prevState.results.map((result) => {
        // Copie les résultats actuels
        if (result.teams_name === teamName) {
          // Si l'équipe correspond à l'équipe concernée
          const judgeScoresCopy = result.judgeScores.map((judgeScore) => {
            // Copie les notes des juges de l'équipe
            if (judgeScore.judgeName === judgeName) {
              // Si le juge correspond au juge concerné
              const newIsChecked = !judgeScore.isChecked; // Inverse l'état d'inclusion de la note du juge

              // Appel API avec judge_id pour mettre à jour l'exclusion
              this.updateJudgeScoreExclusion(
                judgeScore.judge_id,
                newIsChecked,
              ).catch((error) => {
                console.error(
                  "lors de la mise à jour du statut d'exclusion:",
                  error,
                );
              });
              return { ...judgeScore, isChecked: newIsChecked }; // Retourne la note du juge avec le nouvel état d'inclusion
            }
            return judgeScore; // Retourne la note du juge sans modification si ce n'est pas le juge concerné
          });

          // Calcul de la note finale ajustée après la mise à jour de l'exclusion
          const includedScores = judgeScoresCopy.filter((js) => !js.isChecked); // Filtre les notes des juges incluses dans le calcul final
          const totalScore = includedScores.reduce(
            (acc, curr) => acc + curr.score,
            0,
          ); // Calcule la somme des notes des juges incluses
          const finalScore =
            includedScores.length > 0
              ? Math.round(totalScore / includedScores.length)
              : 0; // Calcule la note finale en arrondissant à l'entier le plus proche

          return { ...result, judgeScores: judgeScoresCopy, finalScore }; // Retourne l'équipe avec les notes des juges mises à jour et la note finale recalculée
        }
        return result; // Retourne l'équipe sans modification si ce n'est pas l'équipe concernée
      });

      // Bugfix : Mise à jour du detailTeam pour rafraîchir le dialog en temps réel
      // @author Léandre Kanmegne - H26
      // Code généré par ChatGPT et Copilot, avec correction de la logique pour trouver la bonne équipe dans les résultats mis à jour.
      const updatedDetailTeam = prevState.detailTeam
        ? resultsCopy.find(
            (r) => r.teams_name === prevState.detailTeam!.teams_name,
          ) || null
        : null;

      return {
        ...prevState,
        results: resultsCopy,
        detailTeam: updatedDetailTeam,
      }; // Retourne l'état avec les résultats mis à jour
    });
  };

  /**
   * Gère la suppression des notes de juge sélectionnées.
   * @param isChecked Indique si la note est sélectionnée ou non.
   * @param teamName Le nom de l'équipe sélectionnée.
   * @param judgeId L'identifiant du juge sélectionné.
   * @author Tommy Garneau
   */
  handleJudgeScoreSelection = (
    isChecked: boolean,
    teamName: string,
    judgeId: number,
  ) => {
    // Met à jour l'état en supprimant la note sélectionnée
    this.setState((prevState) => {
      const selectedJudgeScores = [...prevState.selectedJudgeScores];

      // Vérifie si la note du juge est déjà sélectionnée
      if (isChecked) {
        // Ajouter la note sélectionnée
        selectedJudgeScores.push({ teamName, judgeId });
      } else {
        // Supprimer la note désélectionnée
        const index = selectedJudgeScores.findIndex(
          (selected) =>
            selected.teamName === teamName && selected.judgeId === judgeId,
        );
        // Supprimer l'index si la note est désélectionnée
        if (index !== -1) {
          selectedJudgeScores.splice(index, 1);
        }
      }

      return { selectedJudgeScores };
    });
  };

  /**
   * Appelle l'API pour mettre à jour l'exclusion d'une note de juge.
   *
   * @param judge_id L'identifiant du juge pour lequel le statut doit être mis à jour.
   * @param isExcluded Le nouveau statut d'exclusion de la note.
   * @returns Une promesse qui résout une fois la mise à jour est effectuée.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  async updateJudgeScoreExclusion(
    judge_id: number,
    isExcluded: boolean,
  ): Promise<void> {
    const updateResponse = await ResultService.updateScoreExclusion(
      judge_id,
      isExcluded,
    );
  }

  /**
   * resetSorts réinitialise les tris du tableau MUI.
   *
   * @author Francis Payan
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  resetSorts = () => {
    // Incrémente resetKey pour forcer la récréation du tableau MUI
    this.setState((prevState) => ({ resetKey: prevState.resetKey + 1 }));
  };

  /**
   * Fonction pour afficher une notification de succès.
   * @param message Message à afficher dans la notification.
   */
  ShowSuccess(message: string) {
    ShowToast(message, 5000, 'success', 'top-center', false);
  }

  /**
   * Fonction pour afficher une notification d'erreur.
   * @param error Message d'erreur à afficher dans la notification.
   */
  ShowErrors(error: string) {
    let errors;
    if (error === TEXTS.api.errors.communicationFailed) {
      errors = Array(error);
    } else {
      errors = Object.values(error);
    }
    errors.forEach((message) =>
      ShowToast(message, 5000, 'error', 'top-center', false),
    );
  }

  /**
   * Rendu du composant ResultsList.
   * @author Léandre Kanmegne - H26
   * Code partiellement généré par ChatGPT et Copilot.
   * @see https://www.chatgpt.com/
   */
  render() {
    const columns: GridColDef[] = [
      { field: 'categorie', headerName: 'Catégorie', flex: 1 },
      { field: 'teams_name', headerName: "Nom de l'équipe", flex: 1 },
      {
        field: 'finalScore',
        headerName: 'Note finale (%)',
        width: 150,
        valueFormatter: (value) =>
          value != null && !isNaN(value) ? `${value}%` : 'N/A',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              this.openTeamDetail(params.row as EnhancedResultInfo)
            }
          >
            Voir détails
          </Button>
        ),
      },
    ];

    const { detailTeam } = this.state;

    return (
      <>
        {/* Dialog confirmation suppression depuis toolbar */}
        <ConfirmationDialog
          parentIsDialogOpen={this.state.isConfirmDeleteOpen}
          parentSetIsDialogOpen={
            ((open: boolean) =>
              this.setState({ isConfirmDeleteOpen: open })) as React.Dispatch<
              React.SetStateAction<boolean>
            >
          }
          title={'Confirmation de suppression'}
          content={
            'Êtes-vous sûr de vouloir supprimer les résultats sélectionnés?'
          }
          confirmationButtonText={'Supprimer'}
          confirmationButtonOnClick={this.deleteJudgeScores}
        />

        {/* Dialog confirmation suppression note individuelle */}
        <ConfirmationDialog
          parentIsDialogOpen={this.state.isConfirmDeleteJudgeOpen}
          parentSetIsDialogOpen={
            ((open: boolean) =>
              this.setState({
                isConfirmDeleteJudgeOpen: open,
              })) as React.Dispatch<React.SetStateAction<boolean>>
          }
          title={'Confirmation de suppression'}
          content={'Êtes-vous sûr de vouloir supprimer cette note de juge?'}
          confirmationButtonText={'Supprimer'}
          confirmationButtonOnClick={this.deleteSingleJudgeScore}
        />

        {/* Dialog confirmation suppression résultats équipes sélectionnées */}
        <ConfirmationDialog
          parentIsDialogOpen={this.state.isConfirmDeleteTeamsOpen}
          parentSetIsDialogOpen={
            ((open: boolean) =>
              this.setState({
                isConfirmDeleteTeamsOpen: open,
              })) as React.Dispatch<React.SetStateAction<boolean>>
          }
          title={'Confirmation de suppression'}
          content={
            'Êtes-vous sûr de vouloir supprimer tous les résultats des équipes sélectionnées?'
          }
          confirmationButtonText={'Supprimer'}
          confirmationButtonOnClick={this.deleteSelectedTeamsResults}
        />

        {/* Dialog de détails de l'équipe */}
        <Dialog
          open={detailTeam !== null}
          onClose={() => this.setState({ detailTeam: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Détails — {detailTeam?.teams_name}</DialogTitle>
          <DialogContent dividers>
            {detailTeam && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Catégorie :</strong> {detailTeam.categorie}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Note finale :</strong>{' '}
                  {detailTeam.finalScore != null
                    ? `${detailTeam.finalScore}%`
                    : 'N/A'}
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  Notes des juges
                </Typography>

                {detailTeam.judgeScores.map((judgeScore, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: judgeScore.isChecked
                        ? 'action.disabledBackground'
                        : 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      opacity: judgeScore.isChecked ? 0.6 : 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        <strong>{judgeScore.judgeName}</strong> —{' '}
                        {judgeScore.score}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {judgeScore.comments || 'Aucun commentaire'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip
                        title={
                          judgeScore.isChecked
                            ? 'Inclure dans le calcul'
                            : 'Exclure du calcul'
                        }
                      >
                        <Checkbox
                          checked={judgeScore.isChecked}
                          onChange={() =>
                            this.toggleJudgeScore(
                              detailTeam.teams_name,
                              judgeScore.judgeName,
                            )
                          }
                          size="small"
                        />
                      </Tooltip>
                      <Tooltip title="Supprimer cette note">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            this.openDeleteJudgeConfirmation(
                              detailTeam.teams_name,
                              judgeScore.judge_id,
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ detailTeam: null })}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tableau principal */}
        <Box sx={{ height: 600, width: '100%' }}>
          <Typography
            variant="h4"
            className={styles.title}
            sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
          >
            {TEXTS.admin.resultats.layout1.link1}
          </Typography>
          <div className="my-custom-table">
            <DataGrid
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 100 },
                },
              }}
              rows={this.state.results}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelection) => {
                const selectedIds = newSelection.map((id) => Number(id));
                this.setState({ selectedRows: selectedIds });
              }}
              sx={{ width: '100%', minHeight: 400 }}
              slots={{
                toolbar: () => (
                  <EvaluationResultsToolbar
                    sendInfo={this.sendInfo}
                    deleteJudgeScores={this.openDeleteConfirmation}
                    deleteSelectedTeamsResults={
                      this.openDeleteTeamsConfirmation
                    }
                    selectedRows={this.state.selectedRows}
                    selectedJudgeScores={this.state.selectedJudgeScores}
                    results={this.state.results}
                  />
                ),
              }}
            />
          </div>
        </Box>
      </>
    );
  }

  /**
   * Supprime les notes sélectionnées des juges.
   * @author Tommy Garneau
   * Bugfix : Remplace la mise à jour manuelle de l'état local par un appel à l'API pour supprimer les notes sélectionnées, puis rafraîchit les données après la suppression.
   * @author : Léandre Kanmegne - H26
   */
  openDeleteConfirmation = () => {
    if (this.state.selectedJudgeScores.length === 0) {
      ShowToast(
        'Aucune note sélectionnée pour la suppression.',
        5000,
        'warning',
        'top-center',
        false,
      );
      return;
    }
    this.setState({ isConfirmDeleteOpen: true });
  };

  deleteJudgeScores = async () => {
    this.setState({ isConfirmDeleteOpen: false });
    const { selectedJudgeScores } = this.state;
    try {
      const promises = selectedJudgeScores.map(({ teamName, judgeId }) =>
        ResultService.deletesJudgeScore(teamName, judgeId),
      );
      await Promise.all(promises);

      this.ShowSuccess(
        'Les notes sélectionnées ont été supprimées avec succès.',
      );

      // Rafraichit les données après la suppression
      this.setState({ selectedJudgeScores: [], results: [] });
      await this.getInfos();
      await this.fetchJudgeScoreExclusions();
    } catch (error) {
      this.ShowErrors(
        'Une erreur est survenue lors de la suppression des notes sélectionnées.',
      );
    }
  };

  /**
   * Envoyer les informations par mail.
   */
  async sendInfo(result: ResultInfo | undefined) {
    // TODO: Implémenter l'envoi des informations par courriel.
    ShowToast(
      'Cette fonctionnalité est à venir.',
      5000,
      'info',
      'top-center',
      false,
    );
  }

  /**
   * Ouvre le dialog de détails pour une équipe
   * @author Léandre Kanmegne - H26
   */
  openTeamDetail = (team: EnhancedResultInfo) => {
    this.setState({ detailTeam: team });
  };

  /**
   * Ouvre la confirmation de suppression d'une note de juge individuelle
   * @author Léandre Kanmegne - H26
   */
  openDeleteJudgeConfirmation = (teamName: string, judgeId: number) => {
    this.setState({
      deleteTarget: { teamName, judgeId },
      isConfirmDeleteJudgeOpen: true,
    });
  };

  /**
   * Supprime une note de juge individuelle depuis le dialog de détails
   * @author Léandre Kanmegne - H26
   */
  deleteSingleJudgeScore = async () => {
    this.setState({ isConfirmDeleteJudgeOpen: false });
    const { deleteTarget } = this.state;
    if (!deleteTarget) return;

    try {
      await ResultService.deletesJudgeScore(
        deleteTarget.teamName,
        deleteTarget.judgeId,
      );
      this.ShowSuccess('La note du juge a été supprimée avec succès.');

      this.setState({ deleteTarget: null, detailTeam: null });
      await this.getInfos();
      await this.fetchJudgeScoreExclusions();
    } catch (error) {
      this.ShowErrors('Une erreur est survenue lors de la suppression.');
    }
  };

  /**
   * Ouvre la confirmation de suppression des équipes sélectionnées (toutes leurs notes)
   * @author Léandre Kanmegne - H26
   */
  openDeleteTeamsConfirmation = () => {
    if (this.state.selectedRows.length === 0) {
      ShowToast(
        'Aucune équipe sélectionnée pour la suppression.',
        5000,
        'warning',
        'top-center',
        false,
      );
      return;
    }
    this.setState({ isConfirmDeleteTeamsOpen: true });
  };

  /**
   * Supprime toutes les notes de toutes les équipes sélectionnées
   * @author Léandre Kanmegne - H26
   */
  deleteSelectedTeamsResults = async () => {
    this.setState({ isConfirmDeleteTeamsOpen: false });
    const { selectedRows, results } = this.state;

    try {
      const promises: Promise<any>[] = [];
      selectedRows.forEach((rowId) => {
        const team = results.find((r) => r.id === rowId);
        if (team) {
          team.judgeScores.forEach((js) => {
            promises.push(
              ResultService.deletesJudgeScore(team.teams_name, js.judge_id),
            );
          });
        }
      });
      await Promise.all(promises);

      this.ShowSuccess(
        'Les résultats des équipes sélectionnées ont été supprimés avec succès.',
      );
      this.setState({ selectedRows: [], results: [] });
      await this.getInfos();
      await this.fetchJudgeScoreExclusions();
    } catch (error) {
      this.ShowErrors('Une erreur est survenue lors de la suppression.');
    }
  };
}

export default EvaluationsResultsListPage;