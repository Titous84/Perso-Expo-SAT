import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import AdministratorsListPage from './AdministratorsListPage';
import UserService from '../../api/users/userService';
import { ShowToast } from '../../utils/utils';

// Mock du tableau pour isoler le comportement de réinitialisation annuelle.
// @author Nathan Reyes
vi.mock('../../components/AdministratorsListPage/AdministrationTable/AdministratorsTable', () => ({
  default: () => (
  <div data-testid="administratorsTableMock" />
  )
}));

// Mock du service utilisateur pour contrôler la réponse de l'API.
// @author Nathan Reyes
vi.mock('../../api/users/userService', () => ({
  __esModule: true,
  default: {
    resetEventData: vi.fn()
  }
}));

// Mock du toast afin de valider les messages affichés à l'utilisateur.
// @author Nathan Reyes
vi.mock('../../utils/utils', () => ({
  ShowToast: vi.fn()
}));

describe('AdministratorsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('ouvre une confirmation avant de lancer la réinitialisation annuelle', async () => {
    render(<AdministratorsListPage />, { wrapper: MemoryRouter });

    const resetButton = screen.getByRole('button', {
      name: /réinitialiser les données de fin d'évènement/i
    });

    await userEvent.click(resetButton);

    expect(
      await screen.findByRole('heading', { name: /confirmer la réinitialisation annuelle/i })
    ).toBeInTheDocument();
  });

  test('déclenche la réinitialisation annuelle et affiche un succès', async () => {
    vi.mocked(UserService.resetEventData).mockResolvedValue(undefined);

    render(<AdministratorsListPage />, { wrapper: MemoryRouter });

    await userEvent.click(
      screen.getByRole('button', { name: /réinitialiser les données de fin d'évènement/i })
    );

    await userEvent.click(
      await screen.findByRole('button', { name: /confirmer la réinitialisation/i })
    );

    await waitFor(() => {
      expect(UserService.resetEventData).toHaveBeenCalledTimes(1);
      expect(ShowToast).toHaveBeenCalledWith(
        'Réinitialisation annuelle effectuée avec succès.',
        5000,
        'success',
        'top-center',
        false
      );
    });
  });

  test('affiche une erreur si la réinitialisation annuelle échoue', async () => {
    vi.mocked(UserService.resetEventData).mockRejectedValue(new Error('Erreur simulée'));

    render(<AdministratorsListPage />, { wrapper: MemoryRouter });

    await userEvent.click(
      screen.getByRole('button', { name: /réinitialiser les données de fin d'évènement/i })
    );

    await userEvent.click(
      await screen.findByRole('button', { name: /confirmer la réinitialisation/i })
    );

    await waitFor(() => {
      expect(UserService.resetEventData).toHaveBeenCalledTimes(1);
      expect(ShowToast).toHaveBeenCalledWith(
        'Une erreur est survenue lors de la réinitialisation des données annuelles.',
        5000,
        'error',
        'top-center',
        false
      );
    });
  });
});
