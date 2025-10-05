'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLocale = pathname.split('/')[1]; // Extract current locale from pathname

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale; // Replace the locale segment
    const newPath = segments.join('/');

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      defaultValue={currentLocale}
      disabled={isPending}
    >
      <option value="en">English</option>
      <option value="pl">Polski</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
