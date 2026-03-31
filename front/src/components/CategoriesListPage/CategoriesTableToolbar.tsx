import { useNavigate } from 'react-router';
import { Button, IconButton, Stack, Tooltip } from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'

interface CategoriesTableToolbarProps {
    deleteSelectedCategories: () => void;
    openCreateDialog: () => void;
}

/**
 * Tableau des catégories d'équipes.
 * @author Breno Gomes - H26
 * Inspiré du composant TeamsTableToolbar de la page de gestion des équipes, écrit par Antoine Ouellette et Carlos Cordeiro.
 */
export default function CategoriesTableToolbar({ deleteSelectedCategories, openCreateDialog }: CategoriesTableToolbarProps) {
    const navigate = useNavigate();

    return (
        <GridToolbarContainer>
            <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
                <Stack direction="row">
                    <GridToolbarQuickFilter />
           
                    <Tooltip title="Filtres">
                        <GridToolbarFilterButton />
                    </Tooltip>
               
                    <Tooltip title="Colonnes">
                        <GridToolbarColumnsButton />
                    </Tooltip>
                </Stack>

                <Stack direction="row">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openCreateDialog}
                    >
                        Ajouter catégorie
                    </Button>

                    <Tooltip title="Supprimer">
                        <IconButton
                            onClick={deleteSelectedCategories}
                        >
                            <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        </GridToolbarContainer>
    );
}