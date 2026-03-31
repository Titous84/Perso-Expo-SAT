import { Box, Typography } from "@mui/material";
import IPage from "../../types/IPage";
import CategoriesTable from "../../components/CategoriesListPage/CategoriesTable/CategoriesTable";

/**
 * Page affichant la liste des catégories d'équipes.
 * @author Breno Gomes - H26
 */
export default class CategoriesListPage extends IPage<{}> {
    public render() {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                    Catégories d'équipes
                </Typography>

                <CategoriesTable />
            </Box>
        );
    }
}
