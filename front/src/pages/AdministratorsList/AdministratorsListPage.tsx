import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { TEXTS } from '../../lang/fr';
import AdministratorsTable from "../../components/AdministratorsListPage/AdministrationTable/AdministratorsTable";
import UserService from "../../api/users/userService";
import { ShowToast } from "../../utils/utils";

/**
 * Page de gestion des administrateurs
 *
 * Affiche la liste des administrateurs et permet l'ajout, la modification
 * et la suppression d'administrateurs.
 *
 * @author Antoine Ouellette
 */
export default function AdministratorsListPage() {
    // État de chargement du bouton de réinitialisation annuelle.
    // @author Nathan Reyes
    const [isResetLoading, setIsResetLoading] = useState<boolean>(false)

    /**
     * Lance la réinitialisation des données de fin d'évènement.
     * @author Nathan Reyes
     */
    const handleAnnualReset = async () => {
        setIsResetLoading(true)
        try {
            await UserService.resetEventData()
            ShowToast("Réinitialisation annuelle effectuée avec succès.", 5000, "success", "top-center", false)
        } catch (error: any) {
            ShowToast(error?.message ?? "La réinitialisation annuelle a échoué.", 5000, "error", "top-center", false)
        } finally {
            setIsResetLoading(false)
        }
    }

    return (
        <div data-testid="administratorsListPage">
            <Box sx={{ mb: 4 }}>
                {/* Titre du contenu */}
                <Typography variant="h4" sx={{ mt:4, mb:2 }}>{TEXTS.administratorsListPage.title}</Typography>

                {/* Tableau de la liste des administrateurs */}
                <AdministratorsTable />

                {/* Bouton de réinitialisation annuelle des données */}
                {/* @author Nathan Reyes */}
                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleAnnualReset}
                        disabled={isResetLoading}
                    >
                        {isResetLoading ? "Réinitialisation en cours..." : "Réinitialiser les données de fin d'évènement"}
                    </Button>
                </Box>
            </Box>
        </div>
    )
}
