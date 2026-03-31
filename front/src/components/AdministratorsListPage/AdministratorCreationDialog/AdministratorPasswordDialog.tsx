import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import UserService from '../../../api/users/userService';

interface AdministratorPasswordDialogProps {
  parentIsDialogOpen: boolean;
  parentSetIsDialogOpen: (isOpen: boolean) => void;
  parentSetSnackbarMessage: (message: string) => void;
  parentSetSnackbarMessageType: (
    type: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  parentSetIsSnackbarOpen: (isOpen: boolean) => void;
  adminEmail: string;
}

/**
 * Fenêtre contextuelle de modification du mot de passe d'un administrateur.
 * @author Léandre Kanmegne - H26
 */
export default function AdministratorPasswordDialog(
  props: AdministratorPasswordDialogProps,
) {
  const [newPassword, setNewPassword] = useState(''); // hook pour stocker le nouveau mot de passe entré dans le formulaire.
  const [confirmPassword, setConfirmPassword] = useState(''); // hook pour stocker la confirmation du mot de passe entré dans le formulaire.
  const [isLoading, setIsLoading] = useState(false); // hook pour indiquer si la modification du mot de passe est en cours ou non.
  const [errorMessage, setErrorMessage] = useState(''); // hook pour stocker un message d'erreur à afficher dans la fenêtre contextuelle en cas de problème lors de la modification du mot de passe.

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    props.parentSetIsDialogOpen(false);
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.ChangePwUser(
        props.adminEmail,
        newPassword,
      );

      if (response.error) {
        setErrorMessage(response.error);
      } else {
        props.parentSetSnackbarMessage(
          `Mot de passe de ${props.adminEmail} modifié avec succès.`,
        );
        props.parentSetSnackbarMessageType('success');
        props.parentSetIsSnackbarOpen(true);
        handleClose();
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={props.parentIsDialogOpen} onClose={handleClose}>
      <DialogTitle>Modifier le mot de passe</DialogTitle>
      <DialogContent>
        <TextField
          label="Administrateur"
          value={props.adminEmail}
          fullWidth
          disabled
          margin="normal"
        />
        <TextField
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Confirmer le mot de passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : 'Confirmer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
