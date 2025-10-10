import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter, usePathname } from 'next/navigation';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    locale: 'en',
  })),
  usePathname: vi.fn(() => '/'),
}));

test('renders language switcher with default English selected', () => {
  render(<LanguageSwitcher />);
  const selectElement = screen.getByRole('combobox');
  expect(selectElement).toBeInTheDocument();
  expect(selectElement).toHaveValue('en');
});

test('changes language when a new option is selected', () => {
  const mockReplace = vi.fn();
  (useRouter as vi.Mock).mockReturnValue({
    replace: mockReplace,
    locale: 'en',
  });
  (usePathname as vi.Mock).mockReturnValue('/');

  render(<LanguageSwitcher />);
  const selectElement = screen.getByRole('combobox');

  fireEvent.change(selectElement, { target: { value: 'pl' } });

  expect(mockReplace).toHaveBeenCalledWith('/pl');
});
