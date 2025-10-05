import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import Home from './page';

test('renders the main heading', () => {
  render(<Home />);
  const heading = screen.getByText(/Get started by editing/i);
  expect(heading).toBeInTheDocument();
});
