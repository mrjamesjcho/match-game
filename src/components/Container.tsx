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

  const handleUpdateHighscore = () => {
    if (score > highscore) {
      setHighscore(score);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Menu
        menuOpen={menuOpen}
        theme={theme}
        onClick={setMenuOpen}
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
