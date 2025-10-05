import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import Home from './page';

// Mock the getDictionary function
vi.mock('../lib/i18n/getDictionary', () => ({
  getDictionary: vi.fn(async () => ({
    common: {
      hello: 'Hello',
      language_switcher: 'Switch Language',
    },
    home: {
      title: 'Welcome to e-Przewoźnik',
    },
  })),
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    locale: 'en',
  })),
  usePathname: vi.fn(() => '/'),
}));

test('renders the main heading', async () => {
  render(await Home({ params: { lang: 'en' } }));
  const heading = screen.getByText(/Welcome to e-Przewoźnik/i);
  expect(heading).toBeInTheDocument();
});
