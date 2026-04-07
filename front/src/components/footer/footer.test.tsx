import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './footer';
/**
 * Charles Lavoie
 */
test('renders footer', async () => {
  render(<Footer />, {wrapper: MemoryRouter});
  const linkElement = await screen.findAllByTestId("footer");
  expect(linkElement.length === 1).toBeTruthy()
});
