import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Menu() {
  return (
    <div className="flex justify-end min-w-[394px] min-h-fit p-2">
      <div className="font-bold">Matchy Matchy</div>
      <div className="flex items-center">
        <FontAwesomeIcon
          className="h-[20px] mr-4 cursor-pointer hover:opacity-50"
          icon={faQuestion}
        />
        <FontAwesomeIcon
          className="h-[20px] cursor-pointer hover:opacity-50"
          icon={faGear}
        />
      </div>
    </div>
  );
}
