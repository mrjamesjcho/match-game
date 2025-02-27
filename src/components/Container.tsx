'use client';

import { useState } from 'react';
import Gameboard from './Gameboard';
import Menu from './Menu';
import { Theme } from '@/utils/color';

export default function Container() {
  const [menuOpen, setMenuOpen] = useState<'help' | 'settings' | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.DEFAULT);

  const handleMenuClick = (menu: 'help' | 'settings' | null) => {
    setMenuOpen(menu);
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Menu
        open={menuOpen}
        theme={theme}
        onClick={handleMenuClick}
        onThemeSelect={setTheme}
      />
      <Gameboard menuOpen={menuOpen !== null} theme={theme} />
    </div>
  );
}
