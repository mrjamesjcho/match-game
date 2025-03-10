import { Theme } from '@/utils/style';
import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Rules from './Rules';
import Settings from './Settings';

interface MenuProps {
  open: 'help' | 'settings' | null;
  theme: Theme;
  onClick: (menu: 'help' | 'settings' | null) => void;
  onThemeSelect: (theme: Theme) => void;
}

export default function Menu({
  open,
  theme,
  onClick,
  onThemeSelect,
}: MenuProps) {
  const getIconClassname = (menu: 'help' | 'settings') => {
    if (menu === 'help') {
      return open === 'help'
        ? 'h-[20px] mr-4 cursor-pointer brightness-100'
        : 'h-[20px] mr-4 cursor-pointer brightness-50 hover:brightness-100 duration-2000';
    }
    return open === 'settings'
      ? 'h-[20px] cursor-pointer brightness-100'
      : 'h-[20px] cursor-pointer brightness-50 hover:brightness-100 duration-200';
  };

  return (
    <>
      <div className="flex justify-between min-w-[394px] min-h-fit p-2">
        <div className="font-bold">Matchy Matchy</div>
        <div className="flex items-center">
          <FontAwesomeIcon
            className={getIconClassname('help')}
            icon={faQuestion}
            onClick={() => onClick(open === 'help' ? null : 'help')}
          />
          <FontAwesomeIcon
            className={getIconClassname('settings')}
            icon={faGear}
            onClick={() => onClick(open === 'settings' ? null : 'settings')}
          />
        </div>
      </div>
      {open === 'settings' && (
        <Settings theme={theme} onThemeSelect={onThemeSelect} />
      )}
      {open === 'help' && <Rules />}
    </>
  );
}
