import { Link } from 'react-router-dom';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ButtonExposat from '../../components/button/button-exposat';
import Layout from '../../components/layout/layout';
import { IEvaluationGrid } from '../../types/evaluationGrid/IEvaluationGrid';
import IPage from '../../types/IPage';
import EvaluationGridService from '../../api/evaluationGrid/evaluationGridService';
import { ShowToast } from '../../utils/utils';
import { TEXTS } from '../../lang/fr';
import styles from './EvaluationGridsListPage.module.css';

/**
 * Variables d'état du composant React: EvaluationGridsListPage.
 * @property {IEvaluationGrid[]} evaluationGrids - La liste des modèles de questionnaire.
 */
interface EvaluationGridsListPageState {
  evaluationGrids: IEvaluationGrid[];
  searchTerm: string;
}

/**
 * Page de la liste des modèles de questionnaire.
 * @author Raphaël Boisvert
 * @author Thomas-Gabriel Paquin
 */
export default class EvaluationGridsListPage extends IPage<
  {},
  EvaluationGridsListPageState
> {
  constructor(props: {}) {
    super(props);

    // Variables d'état
    this.state = {
      evaluationGrids: [],
      searchTerm: '',
    };

    // Sert à lier le contexte de la classe aux méthodes.
    ((this.getEvaluationGrid = this.getEvaluationGrid.bind(this)),
      (this.deleteEvaluationGrid = this.deleteEvaluationGrid.bind(this)));
  }

  componentDidMount() {
    this.getEvaluationGrid();
  }

  /**
   * Récupère les modèles de questionnaire
   */
  async getEvaluationGrid() {
    const response = await EvaluationGridService.getEvaluationGrid();
    if (response && response.data) {
      this.setState({
        evaluationGrids: response.data,
      });
    }
  }

  /**
   * Supprime un modèle de questionnaire
   * @param id L'id du modèle de questionnaire
   * Bugfix : Ajout d'une gestion d'erreur plus robuste pour les cas où la suppression échoue, avec un message d'erreur clair pour l'utilisateur.
   * @author Léandre Kanmegne - H26
   */
  deleteEvaluationGrid(id: number) {
    EvaluationGridService.deleteEvaluationGrid(id)
      .then((response) => {
        if (response.error) {
          const message = Array.isArray(response.error)
            ? response.error[0]
            : response.error;
          ShowToast(message, 5000, 'error', 'top-center', false);
        } else {
          this.getEvaluationGrid();
          ShowToast(
            'Formulaire supprimé avec succès',
            5000,
            'success',
            'top-center',
            false,
          );
        }
      })
      .catch(() => {
        ShowToast(
          'Erreur lors de la suppression du formulaire',
          5000,
          'error',
          'top-center',
          false,
        );
      });
  }

  render() {
    const totalGrids = this.state.evaluationGrids.length;
    const filteredGrids = this.state.evaluationGrids.filter((grid) =>
      grid.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()),
    );

    return (
      <Layout name={TEXTS.evaluationGrid.title}>
        <Paper className={styles.headerCard} elevation={1}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h6" className={styles.sectionTitle}>
                Gestion des grilles d'évaluation
              </Typography>
              <Typography variant="body2" className={styles.sectionSubtitle}>
                Créez, modifiez ou supprimez rapidement vos modèles de
                formulaire.
              </Typography>
            </Box>
            {/* Résumé rapide du nombre de grilles configurées. */}
            {/* @author Nathan Reyes */}
            <Chip
              color="primary"
              variant="outlined"
              label={`${totalGrids} grille${totalGrids > 1 ? 's' : ''} disponible${totalGrids > 1 ? 's' : ''}`}
            />
          </Stack>
          <div className={styles.searchContainer}>
            {/* Barre de recherche pour accélérer la gestion des grilles volumineuses. */}
            {/* @author Nathan Reyes */}
            <TextField
              size="small"
              fullWidth
              label="Rechercher une grille"
              placeholder="Ex. Informatique, Santé, Robotique..."
              value={this.state.searchTerm}
              onChange={(event) =>
                this.setState({ searchTerm: event.target.value })
              }
            />
          </div>
        </Paper>

        <div className={styles.actionsRow}>
          <Link to={`/gestion-grille-evaluation/formulaire/`}>
            <ButtonExposat
              className={styles.buttonCreate}
              children={TEXTS.evaluationGrid.buttonCreate}
            />
          </Link>
        </div>

        {filteredGrids.length === 0 ? (
          <Paper className={styles.emptyState} elevation={0}>
            <Typography variant="h6">
              {totalGrids === 0
                ? 'Aucune grille pour le moment'
                : 'Aucune grille ne correspond à votre recherche'}
            </Typography>
            <Typography variant="body2">
              {totalGrids === 0
                ? "Commencez par créer une première grille d'évaluation."
                : 'Essayez un autre mot-clé pour retrouver la grille recherchée.'}
            </Typography>
          </Paper>
        ) : (
          <div className={styles.gridList}>
            {filteredGrids.map((evaluationGrid) => (
              <Paper
                key={evaluationGrid.id}
                className={styles.gridCard}
                elevation={1}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={2}
                >
                  <div>
                    <Typography variant="subtitle1" className={styles.gridName}>
                      {evaluationGrid.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID #{evaluationGrid.id}
                    </Typography>
                  </div>
                  <div className={styles.buttonGroup}>
                    <Link
                      to={`/gestion-grille-evaluation/formulaire/${evaluationGrid.id}`}
                    >
                      <ButtonExposat
                        className={styles.buttonEdit}
                        children={TEXTS.evaluationGrid.buttonEdit}
                      />
                    </Link>
                    <ButtonExposat
                      className={styles.buttonDelete}
                      onClick={() =>
                        this.deleteEvaluationGrid(evaluationGrid.id)
                      }
                      children={TEXTS.evaluationGrid.buttonDelete}
                    />
                  </div>
                </Stack>
                <Divider className={styles.cardDivider} />
              </Paper>
            ))}
          </div>
        )}
      </Layout>
    );
  }
}
