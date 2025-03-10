import { getThemeEnum, Theme } from '@/utils/style';

interface SettingsProps {
  theme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

export default function Settings({ theme, onThemeSelect }: SettingsProps) {
  const getMenuClassname = (menuItemTheme: Theme) => {
    return menuItemTheme === theme
      ? 'flex justify-between mb-4 w-1/2 cursor-pointer hover:scale-105 duration-200'
      : 'flex justify-between mb-4 w-1/2 cursor-pointer brightness-50 hover:scale-105 hover:brightness-100 duration-200';
  };

  const handleThemeSelect = (theme: Theme) => {
    onThemeSelect(theme);
  };

  const renderMenu = () =>
    Object.values(Theme).map((theme) => {
      return (
        <div
          key={theme}
          className={getMenuClassname(theme)}
          onClick={() => handleThemeSelect(theme)}
        >
          <div className="mr-2">{theme}</div>
          <div className="flex border opacity-100">
            {Object.values(getThemeEnum(theme)).map((themeColor) => (
              <div
                key={themeColor}
                className={`${themeColor} menu-color-option`}
              ></div>
            ))}
          </div>
        </div>
      );
    });
  return (
    <div className="absolute min-w-[394px] min-h-[394px] z-40 p-4">
      {renderMenu()}
    </div>
  );
}
