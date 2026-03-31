import React, { useState, useEffect, useRef } from 'react';
import Actions from '../../api/actions/actions';
import { useLocation, useNavigate } from 'react-router';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

/**
 * Page d'envoi des courriels d'évaluations vers les juges
 * Code partiellement généré par ChatGPT.
 * @author Tommy Garneau
 * @author OpenAI. (2025). ChatGPT (version 27 février 2025) [Grand modèle de langage]. https://chat.openai.com/chat
 * Code revise par @author Léandre Kanmegne - H26
 * Permet d'envoyer les évaluations à une liste de juges sélectionnés, en affichant un message de succès ou d'erreur selon le résultat de l'opération. Après l'envoi, redirige automatiquement vers la page d'administration des juges.
 */
const EmailEvaluationJudgeIndividually: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const judges = location.state?.selectedJudges ?? [];
  const hasSent = useRef(false); // Empêche le double envoi causé par React StrictMode
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading',);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  useEffect(() => {
    const routeEnvoiCourriel = async () => {
      if (hasSent.current) return;
      hasSent.current = true;

      if (judges.length === 0) {
        navigate('/administration?onglet=juges');
        return;
      }

      const result = await Actions.trySendEvaluationIndividually(judges);

     if (!result.error) {
       setStatus('success');
     } else {
       setStatus('error');

       // L'API peut retourner une chaîne de caractères ou un tableau de chaînes. On gère les deux cas pour afficher les messages d'erreur correctement.
       // Code généré par ChatGPT, version 5.4 Mars 2026,
       const raw = result.error as unknown;
       if (Array.isArray(raw)) {
         setErrorMessage(raw as string[]);
       } else {
         setErrorMessage(
           (raw as string).split('\n').filter((msg) => msg.trim() !== ''),
         );
       }
     }
     // Fin du code généré par ChatGPT
    };

    routeEnvoiCourriel();
  }, []);

  // Redirige vers la page d'administration des juges après 3 secondes, que l'envoi ait réussi ou échoué
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/administration?onglet=juges');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={2}
      padding={4}
    >
      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography>Envoi des évaluations en cours...</Typography>
        </>
      )}

      {status === 'success' && (
        <Alert severity="success">
          Les évaluations ont été envoyées avec succès ! Redirection dans 3
          secondes...
        </Alert>
      )}

      {status === 'error' && (
        <>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
            <strong>L'envoi a échoué pour les raisons suivantes :</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {errorMessage.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/administration?onglet=juges')}
          >
            Retour à la gestion des juges
          </Button>
        </>
      )}
    </Box>
  );
};

export default EmailEvaluationJudgeIndividually;
