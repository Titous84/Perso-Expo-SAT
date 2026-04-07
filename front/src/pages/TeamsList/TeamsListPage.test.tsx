import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TeamsListPage from './TeamsListPage';

test('renders inscription page', async () => {
  render(<TeamsListPage />, {wrapper: MemoryRouter});
  const linkElement = await screen.findAllByTestId("teamsList");
  expect(linkElement.length === 1).toBeTruthy()
});
