import { Add as AddIcon, Delete as DeleteIcon, Send as SendIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Judge from "../../types/judge";

/**
 * Props pour le composant React: AdministratorsTableToolbar.
 * @property {() => void} deleteSelectedJudge - Méthode passée par le parent qui supprime les administrateurs sélectionnés dans le tableau.
 * @property {(id: number | null) => void} setSelectedUserId - Méthode pour mettre à jour l'ID du juge sélectionné dans le tableau parent.
 */
interface JudgeTableToolbarProps {
    selectedJudges: Judge[];
    deleteSelectedJudge: () => void;
    deactivateSelectedJudges: () => void; // @author Nathan Reyes
    setSelectedUserId: (id: number | null) => void;
}

/**
 * Bouton qui permet de naviguer vers la page d'envoi d'évaluation aux juges.
 * @author Tommy Garneau
 * code inspiré de https://medium.com/@bobjunior542/using-usenavigate-in-react-router-6-a-complete-guide-46f51403f430
 * @param selectedJudges La liste des juges sélectionnés.
 * @returns Un bouton qui permet d'envoyer un courriel aux juges sélectionnés.
 * Code revise par @author Léandre Kanmegne - H26 
 */
function SendEvaluationGridsButton({ selectedJudges }: { selectedJudges: Judge[];}) {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const handleClick = () => {
    if (selectedJudges && selectedJudges.length > 0) {
      setOpenConfirm(true); // ouvre la confirmation avant de naviguer
    }
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    navigate('/envoiEvaluationsJugeIndividuelle', {
      state: { selectedJudges },
    });
  };

  return (
    <>
      <Button
        className="sendMailButton"
        startIcon={<SendIcon />}
        onClick={handleClick}
        disabled={!selectedJudges || selectedJudges.length === 0}
      >
        Envoyer les évaluations
      </Button>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmation d'envoi</DialogTitle>
        <DialogContent>
          <p>
            Vous êtes sur le point d'envoyer les évaluations à{' '}
            <strong>{selectedJudges.length} juge(s)</strong> :
          </p>
          <ul>
            {selectedJudges.map((j) => (
              <li key={j.id}>
                {j.firstName} {j.lastName} — {j.email}
              </li>
            ))}
          </ul>
          <p>Cette action va régénérer leurs liens d'accès. Confirmer ?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirm}
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Envoyer
          </Button>
          <Button
            onClick={() => setOpenConfirm(false)}
            style={{ backgroundColor: 'gray', color: 'white' }}
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * Barre d'outils pour le tableau des Juge.
 * @param {JudgeTableToolbarProps} { deleteSelectedJudge, setSelectedUserId } - Un objet contenant les props reçues par le composant React.
 * @returns {React.Component} Le composant React de cette barre d'outils.
 *
 * @author Étienne nadeau
 * inspirer d'Antoine Ouellette
 */
export default function JudgeTableToolbar({ selectedJudges, deleteSelectedJudge, deactivateSelectedJudges, setSelectedUserId }: JudgeTableToolbarProps) {
    const navigate = useNavigate(); // Récupère la méthode pour naviguer entre les pages.
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    // Méthode pour ouvrir la boîte de dialogue de confirmation de suppression
    const handleClickDelete = () => {
        setOpenPopup(true);
    };

    // Méthode permettant de fermer le popup
    const handleClickCancel = () => {
        setOpenPopup(false);
        setSelectedUserId(null); // Réinitialise l'ID du juge sélectionné quand on ferme le popup
    };

    // Méthode pour déclencher la suppression après confirmation
    const handleDeleteConfirmed = () => {
        deleteSelectedJudge();
        setOpenPopup(false);
    };

    return (
        <GridToolbarContainer>
            <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
                {/* Éléments alignés à la gauche de la barre d'outils */}
                <Stack direction="row">
                    {/* Barre de recherche */}
                    <GridToolbarQuickFilter />

                    {/* Bouton Filtres */}
                    <Tooltip title="Filtres">
                        <GridToolbarFilterButton />
                    </Tooltip>

                    {/* Boutons des colonnes affichées */}
                    <Tooltip title="Colonnes">
                        <GridToolbarColumnsButton />
                    </Tooltip>
                </Stack>

                {/* Éléments alignés à la droite de la barre d'outils */}
                <Stack direction="row">
                    <SendEvaluationGridsButton
                        selectedJudges={selectedJudges} // Passer les juges sélectionnés
                    />

                    {/* Bouton pour créer un nouveau juge */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            navigate('/inscription-juge'); // Navigue vers la page de création d'un nouveau juge.
                        }}
                    >
                        Créer
                    </Button>

                    {/* Bouton pour supprimer les juges sélectionnées dans le tableau */}
                    <Tooltip title="Confirmer">
                        <IconButton
                            onClick={handleClickDelete} // Ouvre la boîte de dialogue de confirmation
                        >
                            <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <Typography variant="h6" sx={{ fontSize: 10,  fontWeight: 'bold'}}>
                Cliquer à l’extérieur du champ pour modifier les informations du juge.
            </Typography>

            <Dialog open={openPopup} onClose={handleClickCancel}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <p>Êtes-vous sûr de vouloir supprimer le(s) juge(s) sélectionné(s) ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmed} style={{ backgroundColor: 'red', color: 'white' }}>
                        Supprimer
                    </Button>
                    <Button onClick={handleClickCancel} style={{ backgroundColor: 'gray', color: 'white' }}>
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </GridToolbarContainer>
    );
}