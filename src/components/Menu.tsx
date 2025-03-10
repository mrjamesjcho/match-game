import { MenuIconStyle, Theme } from '@/utils/style';
import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Rules from './Rules';
import Settings from './Settings';
import React from 'react';

interface MenuProps {
  menuOpen: 'help' | 'settings' | null;
  theme: Theme;
  onClick: React.Dispatch<React.SetStateAction<'help' | 'settings' | null>>;
  onThemeSelect: React.Dispatch<React.SetStateAction<Theme>>;
}

export default function Menu({
  menuOpen,
  theme,
  onClick,
  onThemeSelect,
}: MenuProps) {
  const getHelpIconClassname = () => {
    return menuOpen === 'help' ? MenuIconStyle.OPEN : MenuIconStyle.CLOSED;
  };

  const getSettingsIconClassname = () => {
    return menuOpen === 'settings' ? MenuIconStyle.OPEN : MenuIconStyle.CLOSED;
  };

  return (
    <>
      <div className="flex justify-between min-w-[394px] min-h-fit p-2">
        <div className="font-bold">Matchy Matchy</div>
        <div className="flex items-center justify-between min-w-[50px]">
          <FontAwesomeIcon
            className={getHelpIconClassname()}
            icon={faQuestion}
            onClick={() => onClick(menuOpen === 'help' ? null : 'help')}
          />
          <FontAwesomeIcon
            className={getSettingsIconClassname()}
            icon={faGear}
            onClick={() => onClick(menuOpen === 'settings' ? null : 'settings')}
          />
        </div>
      </div>
      {menuOpen === 'settings' && (
        <Settings theme={theme} onThemeSelect={onThemeSelect} />
      )}
      {menuOpen === 'help' && <Rules />}
    </>
  );
}
