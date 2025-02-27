import Gameboard from './Gameboard';
import Menu from './Menu';

export default function Container() {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <Menu />
      <Gameboard />
    </div>
  );
}
