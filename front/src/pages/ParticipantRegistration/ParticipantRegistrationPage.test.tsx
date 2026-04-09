import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import ParticipantRegistrationPage from './ParticipantRegistrationPage';
import SignUpService from '../../api/signUp/signUpService';
import { TEXTS } from '../../lang/fr';

// Mock API d'inscription pour contrôler les réponses et valider le payload envoyé.
// @author Nathan Reyes
vi.mock('../../api/signUp/signUpService', () => ({
  __esModule: true,
  default: {
    tryGetCategory: vi.fn(),
    tryGetContactPersons: vi.fn(),
    tryPostTeam: vi.fn()
  }
}));

// Mock simplifié de la section informations d'équipe.
// @author Nathan Reyes
vi.mock('../../components/signup/team-info', () => ({
  default: (props: any) => (
    <button
      type="button"
      onClick={() => {
        props.handleChangeForm('Titre test', 'title');
        props.handleChangeForm('Description test', 'description');
        props.handleChangeForm('Sciences physiques', 'category');
        props.handleChangeForm('1re année', 'year');
      }}
    >
      Remplir infos équipe
    </button>
  )
}));

// Mock simplifié des personnes ressources.
// @author Nathan Reyes
vi.mock('../../components/signup/team-contact-person', () => ({
  default: (props: any) => (
    <button
      type="button"
      onClick={() => {
        props.handleChangeContact(props.number, 'fullName', 'Contact Test');
        props.handleChangeContact(props.number, 'email', 'contact@test.com');
      }}
    >
      Remplir contact {props.number}
    </button>
  )
}));

// Mock simplifié du formulaire membre pour piloter anonymat + consentement photo.
// @author Nathan Reyes
vi.mock('../../components/signup/team-member', () => ({
  default: (props: any) => (
    <div data-testid={`member-form-${props.number}`}>
      <button
        type="button"
        onClick={() => {
          props.handleChangeTeamMember(props.number, 'firstName', `Prenom${props.number}`);
          props.handleChangeTeamMember(props.number, 'lastName', `Nom${props.number}`);
          props.handleChangeTeamMember(props.number, 'numero_da', props.number === 1 ? '1234567' : '7654321');
          props.handleChangeTeamMember(props.number, 'photoConsentClause', 'publication');
          props.handleChangeTeamMember(props.number, 'isAnonymous', 1);
        }}
      >
        Remplir membre {props.number}
      </button>
    </div>
  )
}));

describe('ParticipantRegistrationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(SignUpService.tryGetCategory).mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Sciences physiques',
          max_members: 4,
          image: '',
          description: '',
          survey_id: 1,
          acronym: 'SP'
        }
      ]
    } as any);

    vi.mocked(SignUpService.tryGetContactPersons).mockResolvedValue({ data: [] } as any);
    vi.mocked(SignUpService.tryPostTeam).mockResolvedValue({ data: { message: 'Ajout réussi' } } as any);
  });

  test("permet de conserver un minimum d'un seul membre", async () => {
    render(<ParticipantRegistrationPage />);

    // Attendre que la page soit affichée.
    // @author Nathan Reyes
    await screen.findByTestId('inscription');

    // Au départ, il y a 1 membre: le bouton de retrait ne doit pas être visible.
    expect(screen.queryByRole('button', { name: TEXTS.signup.buttons.removeMember })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: TEXTS.signup.buttons.addMember }));

    expect(await screen.findByRole('button', { name: TEXTS.signup.buttons.removeMember })).not.toBeNull();

    await userEvent.click(screen.getByRole('button', { name: TEXTS.signup.buttons.removeMember }));

    // Après retrait, on revient à 1 membre et le bouton disparaît de nouveau.
    // @author Nathan Reyes
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: TEXTS.signup.buttons.removeMember })).toBeNull();
    });
  });

  test("envoie les champs anonymat et consentement photo lors d'une inscription", async () => {
    render(<ParticipantRegistrationPage />);

    await screen.findByTestId('inscription');

    await userEvent.click(screen.getByRole('button', { name: /Remplir infos équipe/i }));
    await userEvent.click(screen.getByRole('button', { name: /Remplir contact 1/i }));
    await userEvent.click(screen.getByRole('button', { name: /Remplir membre 1/i }));

    await userEvent.click(screen.getByRole('button', { name: TEXTS.ajoutAdmin.btnconn }));

    await waitFor(() => {
      expect(SignUpService.tryPostTeam).toHaveBeenCalledTimes(1);
    });

    const sentPayload = vi.mocked(SignUpService.tryPostTeam).mock.calls[0][0];
    expect(sentPayload.members).toHaveLength(1);
    expect(sentPayload.members[0].photoConsentClause).toBe('publication');
    expect(sentPayload.members[0].isAnonymous).toBe(1);
    expect(sentPayload.members[0].numero_da).toBe('1234567');
  });
});
