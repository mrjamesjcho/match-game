export enum BackgroundColor {
  PINK = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-pink-500',
  CYAN = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-cyan-500',
  BLUE = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-blue-500',
  GREEN = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-green-500',
  YELLOW = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-yellow-500',
  GRAY = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-gray-500',
}

export const getRandomBackgroundColor = () => {
  const keys = Object.keys(BackgroundColor);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return randomKey;
};
