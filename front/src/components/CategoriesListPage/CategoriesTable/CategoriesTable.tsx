import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CategoryService from '../../../api/categories/CategoriesService';
import EvaluationGridService from '../../../api/evaluationGrid/evaluationGridService';
import CategoriesTableToolbar from '../../CategoriesListPage/CategoriesTableToolbar';
import TemporarySnackbar, {
  SnackbarMessageType,
} from '../../TemporarySnackbar/TemporarySnackbar';
import { validateCategoriesInfos } from '../../TeamsListPage/Validations/ValidationCategories';
import ConfirmationDialog from '../../ConfirmationDialog/ConfirmationDialog';
import { ICategories } from '../../../types/TeamsList/ICategories';
import { IEvaluationGrid } from '../../../types/evaluationGrid/IEvaluationGrid';

export interface ICategorie {
  id: number;
  name: string;
  acronym: string;
  activated: number;
  survey_id: number;
  surveyName: string;
}

/**
 * Affiche la table des catégories d'équipes.
 * @author Breno Gomes - H26
 * @returns Une liste des catégories d'équipes dans une table.
 */
export default function CategoriesTable() {
  const [categories, setCategories] = useState<ICategorie[]>([]);
  const [evaluationGrids, setEvaluationGrids] = useState<IEvaluationGrid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>(
    [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAcronym, setNewCategoryAcronym] = useState('');

  // Snackbar pour afficher les messages d'erreur ou de succès.
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Pour contrôler si le snackbar est affiché ou non.
  const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // Message à afficher dans le snackbar.
  const [snackbarMessageType, setSnackbarMessageType] =
    useState<SnackbarMessageType>('error');

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  /**
   * Rafraîchit les catégories en faisant une requête à l'API.
   * @author Morgan Boissonneault - H26
   */
  async function refreshCategories() {
    EvaluationGridService.getEvaluationGrid().then((response1) => {
      const evaluationGridsNouv = response1.data ?? [];
      setEvaluationGrids(evaluationGridsNouv);
      console.log("Grilles d'évaluation obtenues : ", evaluationGrids);
      CategoryService.tryGetCategories().then((response2) => {
        console.log('tryGetCategories : ', response2.data);
        // Indenté même si c'est plus lent parce que ça simplifie la logique.
        let categoriesWithSurveyNames: ICategorie[] = [];
        (response2.data ?? []).forEach((category) => {
          const survey = evaluationGridsNouv.find(
            (survey) => survey.id === category.survey_id,
          );
          if (!survey) {
            console.error(
              "Aucune grille d'évaluation trouvée pour la catégorie : " +
                category.name,
            );
            return;
          }
          categoriesWithSurveyNames.push({
            ...category,
            surveyName: survey.name,
          });
        });

        setCategories(categoriesWithSurveyNames);
        setLoading(false);
      });
    });
  }

  useEffect(() => {
    refreshCategories();
  }, []);

  const columns: GridColDef[] = [
    { field: 'acronym', headerName: 'Acronyme', width: 99, editable: true },
    {
      field: 'name',
      headerName: 'Nom de la catégorie',
      flex: 1,
      editable: true,
    },
    {
      field: 'surveyName',
      headerName: "Grille d'évaluation",
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: evaluationGrids.map((grid) => grid.name),
    },
    {
      field: 'activated',
      headerName: 'Activée',
      valueFormatter: (value) => {
        return value ? 'Oui' : 'Non';
      },
      editable: true,
      type: 'singleSelect',
      valueOptions: [1, 0],
    },
  ];

  /**
   * Gère la modification des rangées.
   * @author Morgan Boissonneault - H26
   */
  const processRowUpdate = async (newRow: ICategorie, oldRow: ICategorie) => {
    // Ne pas faire de mise à jour si l'utilisateur n'a rien changé
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
      return oldRow;
    }

    let indexSurveys: number = -1;
    const survey = evaluationGrids.find((grid, i) => {
      if (grid.name === newRow.surveyName) {
        indexSurveys = i;
        return true;
      }
      return false;
    });
    let indexCategories: number = -1;
    categories.find((categorie, i) => {
      if (categorie.id === newRow.id) {
        indexCategories = i;
        return true;
      }
      return false;
    });
    if (!survey || indexSurveys === -1 || indexCategories === -1) {
      console.error('Erreur de logique dans CategoriesTable');
      return oldRow;
    }

    const update: ICategories = {
      id: newRow.id,
      name: newRow.name,
      acronym: newRow.acronym,
      activated: newRow.activated,
      survey_id: survey.id,
    };

    const result = await CategoryService.updateCategory(update);
    if (result.error) {
      setSnackbarMessage('Erreur lors de la modification de la catégorie.');
      setSnackbarMessageType('error');
      setIsSnackbarOpen(true);
      return oldRow;
    } else {
      setSnackbarMessage('Modification effectuée.');
      setSnackbarMessageType('success');
      setIsSnackbarOpen(true);

      const nouvellesCategories = [...categories];
      const nouvelleCategorie = {
        id: newRow.id,
        name: newRow.name,
        acronym: newRow.acronym,
        activated: newRow.activated,
        survey_id: survey.id,
        surveyName: survey.name,
      };
      nouvellesCategories[indexCategories] = nouvelleCategorie;

      setCategories(nouvellesCategories);
      return nouvelleCategorie;
    }
  };

  /**
   * Gère la suppression des catégories sélectionnées.
   * @author Breno Gomes - H26
   */
  const deleteSelectedCategories = () => {
    setIsConfirmationDialogOpen(false);
    CategoryService.deleteCategories(selectedCategoriesIds)
      .then((response) => {
        if (!response.error) {
          //Refresh les données et afficher un message de succès.
          refreshCategories().then(() => {
            setSelectedCategoriesIds([]);
            setSnackbarMessage('Catégories supprimées avec succès');
            setSnackbarMessageType('success');
            setIsSnackbarOpen(true);
            setIsConfirmationDialogOpen(false);
          });
        } else {
          setSnackbarMessage('Erreur lors de la suppression des catégories.');
          setSnackbarMessageType('error');
          setIsSnackbarOpen(true);
          throw new Error(response.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage(
          'Une erreur est survenue lors de la suppression des catégories.',
        );
        setSnackbarMessageType('error');
        setIsSnackbarOpen(true);
      });
  };

  /**
   * Gère le clic sur le bouton de suppression.
   */
  const handleDeleteButtonClick = () => {
    if (selectedCategoriesIds.length === 0) {
      setSnackbarMessage(
        'Veuillez sélectionner au moins une catégorie à supprimer.',
      );
      setSnackbarMessageType('warning');
      setIsSnackbarOpen(true);
      return;
    }
    setIsConfirmationDialogOpen(true);
  };

  /**
   * Gère la création d'une nouvelle catégorie d'équipe.
   */
  const handleCreateCategory = async () => {
    try {
      // Valider les informations de la nouvelle catégorie avant de l'envoyer à l'API.
      const validationErrors = validateCategoriesInfos(
        newCategoryName,
        newCategoryAcronym,
      );
      if (validationErrors.length > 0) {
        validationErrors.forEach((msg) => {
          // Afficher les messages d'erreurs.
          setSnackbarMessage(msg);
          setSnackbarMessageType('error');
          setIsSnackbarOpen(true); // Déclencher l'affichage du snackbar.
        });
        throw new Error('VALIDATION_FAILED');
      }

      //Valider si une catégorie avec le même nom ou acronyme existe déjà avant de l'envoyer à l'API.
      categories.forEach((category) => {
        if (category.name.toLowerCase() === newCategoryName.toLowerCase()) {
          setSnackbarMessage('Une catégorie avec ce nom existe déjà.');
          setSnackbarMessageType('error');
          setIsSnackbarOpen(true);
          throw new Error('DUPLICATE_CATEGORY_NAME');
        }
        if (
          category.acronym.toLowerCase() === newCategoryAcronym.toLowerCase()
        ) {
          setSnackbarMessage('Une catégorie avec cet acronyme existe déjà.');
          setSnackbarMessageType('error');
          setIsSnackbarOpen(true);
          throw new Error('DUPLICATE_CATEGORY_ACRONYM');
        }
      });

      const response = await CategoryService.createCategory(
        newCategoryName,
        newCategoryAcronym,
      );

      if (!response.error) {
        //Refresh les données et afficher un message de succès.
        await refreshCategories();
        setIsDialogOpen(false);
        setNewCategoryName('');
        setNewCategoryAcronym('');
        setSnackbarMessage('Catégorie créée avec succès');
        setSnackbarMessageType('success');
        setIsSnackbarOpen(true);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      {/* Snackbar caché par défaut qui affiche les messages */}
      <TemporarySnackbar
        parentIsSnackbarOpen={isSnackbarOpen}
        parentSetIsSnackbarOpen={setIsSnackbarOpen}
        message={snackbarMessage}
        snackbarMessageType={snackbarMessageType}
      />

      {/* Fenêtre contextuelle de confirmation cachée par défaut */}
      <ConfirmationDialog
        parentIsDialogOpen={isConfirmationDialogOpen}
        parentSetIsDialogOpen={setIsConfirmationDialogOpen}
        title={'Confirmation de suppression'}
        content={
          'Êtes-vous sûr de vouloir supprimer les catégories sélectionnées?'
        }
        confirmationButtonText={'Supprimer'}
        confirmationButtonOnClick={deleteSelectedCategories}
      />

      {/* Bugfix: Définit la pagination initiale à 100 éléments par page pour permettre l'exportation complete des donnees */}
      {/* @author Léandre Kanmegne - H26 */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={categories}
          columns={columns}
          //editMode="row"
          pageSizeOptions={[5, 10, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 100 },
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
          rowSelectionModel={selectedCategoriesIds}
          onRowSelectionModelChange={(newSelection) =>
            setSelectedCategoriesIds(newSelection as number[])
          }
          slots={{
            toolbar: () => (
              <CategoriesTableToolbar
                deleteSelectedCategories={handleDeleteButtonClick}
                openCreateDialog={() => setIsDialogOpen(true)}
              />
            ),
          }}
        />

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Ajouter une catégorie</DialogTitle>

          <DialogContent>
            <TextField
              margin="dense"
              label="Nom*"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Acronyme*"
              fullWidth
              value={newCategoryAcronym}
              onChange={(e) => setNewCategoryAcronym(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleCreateCategory}>
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
