import React from 'react';
import { ActualRole } from '../../utils/roleUtil';
import { removeToken } from "../../utils/tokenUtil";
import styles from "./LogOutPage.module.css";

/**
 * Page de déconnexion
 * @author Charles Lavoie
 */
export default class LogOutPage extends React.Component {
    constructor(props: {}) {
        super(props)

        this.state = {}

        this.changePage()
    }

    /**
     * @author Charles Lavoie
     * @returns Un titre en cas de lenteur et Navigate pour rediriger à la page d'accueil
     */
    changePage() {
        ActualRole.reset(); // Réinitialise le rôle actuel pour s'assurer que les informations de rôle sont à jour après la déconnexion
        //retourne à la page d'accueil
        //retire le token du localStorage
        removeToken();
        //Retourne un message à afficher si le Navigate est lent, retourne à la page d'accueil
        window.location.href = "/"
    }

    public render(){
        return (
            <div className={styles.screenHeight} data-testid="logout">
            </div>
        );
    }
}