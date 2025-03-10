'use client';

import { Theme } from '@/utils/style';
import { useState } from 'react';
import Gameboard from './Gameboard';
import Menu from './Menu';
import Score from './Score';

export default function Container() {
  const [menuOpen, setMenuOpen] = useState<'help' | 'settings' | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.DEFAULT);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);

  const handleMenuClick = (menu: 'help' | 'settings' | null) => {
    setMenuOpen(menu);
  };

  const handleUpdateHighscore = () => {
    if (score > highscore) {
      setHighscore(score);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Menu
        open={menuOpen}
        theme={theme}
        onClick={handleMenuClick}
        onThemeSelect={setTheme}
      />
      <Gameboard
        menuOpen={menuOpen !== null}
        theme={theme}
        onScoreUpdate={setScore}
        onHighScoreUpdate={handleUpdateHighscore}
      />
      <Score score={score} highscore={highscore} />
    </div>
  );
}
