import { Container, Divider, Stack } from "@mui/material";
import AdministrationNavigationSidebar from "../../components/AdministrationMainPage/AdministrationNavigationSidebar";
import { ADMINISTRATION_MAIN_PAGE_TABS } from "../../types/AdministrationMainPage/AdministrationMainPageTabs";
import IPage from "../../types/IPage";
import React from "react";

/**
 * Variables d'états du composant React: AdministrationMainPage.
 * @property {IPage} componentToDisplayInContentZone - Composant React à afficher dans la zône de contenu de l'onglet sélectionné.
 */
interface AdministrationMainPageState {
    componentToDisplayInContentZone: React.ComponentType<any>;
    selectedTabId: string;
}

/**
 * Page d'administration
 */
export default class AdministrationMainPage extends IPage<{}, AdministrationMainPageState> {
    constructor(props: {}) {
        super(props)

        // Initialisation des variables d'états.
        const ongletDepuisUrl = this.getTabIdFromUrl(); // @author Nathan Reyes
        const ongletSelectionne = ADMINISTRATION_MAIN_PAGE_TABS.find(tab => tab.id === ongletDepuisUrl) ?? ADMINISTRATION_MAIN_PAGE_TABS[0]; // @author Nathan Reyes
        this.state = {
            // Initialiser l'onglet depuis l'URL pour supporter le bouton retour du navigateur.
            // @author Nathan Reyes
            componentToDisplayInContentZone: ongletSelectionne.componentToDisplayInContentZone,
            selectedTabId: ongletSelectionne.id
        }
    }


    componentDidMount(): void {
        // Synchronise l'onglet actif lorsque l'utilisateur navigue avec le bouton retour/avance.
        // @author Nathan Reyes
        window.addEventListener("popstate", this.handleBrowserNavigation)
    }

    componentWillUnmount(): void {
        // Nettoie l'écouteur lors du démontage de la page.
        // @author Nathan Reyes
        window.removeEventListener("popstate", this.handleBrowserNavigation)
    }

    /**
     * Lit l'identifiant de l'onglet actif depuis les paramètres URL.
     * @author Nathan Reyes
     */
    private getTabIdFromUrl(): string | null {
        const params = new URLSearchParams(window.location.search)
        return params.get("onglet")
    }

    /**
     * Réagit à la navigation navigateur (retour/avance) pour restaurer l'onglet.
     * @author Nathan Reyes
     */
    private handleBrowserNavigation = () => {
        const tabId = this.getTabIdFromUrl()
        const tab = ADMINISTRATION_MAIN_PAGE_TABS.find(currentTab => currentTab.id === tabId)
        if (!tab) return

        this.setState({
            selectedTabId: tab.id,
            componentToDisplayInContentZone: tab.componentToDisplayInContentZone
        })
    }

    render() {
        return (
            <div data-testid="AdministrationMainPage">
                <Stack direction="row">
                    {/* Barre latérale de navigation */}
                    {/* Passe une référence de cette méthode à l'enfant. Quand l'enfant appelle cette méthode, elle change la valeur de l'onglet sélectionné. */}
                    <AdministrationNavigationSidebar
                        onAdministrationSidebarTabSelected={this.onSidebarTabSelected}
                        selectedTabId={this.state.selectedTabId} // @author Nathan Reyes
                    />

                    <Divider orientation="vertical" flexItem />

                    {/* Zône du contenu de l'onglet sélectionné */}
                    <Container>
                        {/* Rendu dynamique du composant React */}
                        {React.createElement(this.state.componentToDisplayInContentZone)}
                    </Container>
                </Stack>
            </div>
        )
    }

    /**
     * Quand un onglet est sélectionné, on change le contenu selon l'onglet sélectionné.
     * @param {string} newTabId - Identifiant de l'onglet qui vient d'être sélectionné.
     */
    onSidebarTabSelected = (newTabId: string) => {
        // Change la variable d'état du composant React affiché dans la zône de contenu.
        // On recherche l'onglet sélectionné dans la liste des onglets et dans cet onglet, il y a le composant React à afficher dans la zône de contenu.
        const ongletSelectionne = ADMINISTRATION_MAIN_PAGE_TABS.find(tab => tab.id === newTabId)
        if (!ongletSelectionne) {
            return
        }

        // Met à jour l'URL avec l'onglet actif pour garder l'historique de navigation.
        // @author Nathan Reyes
        const params = new URLSearchParams(window.location.search)
        params.set("onglet", newTabId)
        window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`)

        this.setState({
            selectedTabId: newTabId,
            componentToDisplayInContentZone: ongletSelectionne.componentToDisplayInContentZone
        });
    };
}