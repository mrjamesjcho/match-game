import { faGear, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Menu() {
  return (
    <div className="flex flex-row items-center justify-center min-h-[40px]">
      <FontAwesomeIcon icon={faQuestion} />
      <FontAwesomeIcon icon={faGear} />
    </div>
  );
}
