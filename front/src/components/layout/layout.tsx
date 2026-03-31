import { Paper } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React from 'react';
import styles from './layout.module.css';

interface LayoutProps {
  name: string;
  children: any;
  isNotContainer?: boolean;
}

/**
 * Composant de mise en page pour les pages d'administration. Affiche un titre et un espace pour le contenu de la page.
 * @author Léandre Kanmegne H-26
 * Code partiellement généré par : OpenAI. (2025). ChatGPT (version 5.4 Mars 2026) [Modèle massif de langage]. https://chatgpt.com/
 */
export default class Layout extends React.Component<LayoutProps> {
  public render() {
    return (
      <Grid2 container={this.props.isNotContainer == undefined} columns={12}>
        <Grid2 size={{ xs: 0, md: 2 }}></Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={8}
            className={`${styles.paddingPaper} ${styles.paddingPaperTop}`}
          >
            <Paper className={styles.subhead}>
              <h2>{this.props.name}</h2>
            </Paper>
            {this.props.children}
          </Paper>
        </Grid2>
        <Grid2 size={{ xs: 0, md: 2 }}></Grid2>
      </Grid2>
    );
  }
}
