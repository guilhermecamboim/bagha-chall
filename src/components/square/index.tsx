import * as S from './styles';
import tigerImg from '../../assets/tiger.png';
import goatImg from '../../assets/goat.png';

interface ISquareProps {
  value: string;
  onClick: () => void;
  coordinateTigerSelected: [number, number] | null;
  coordinateEach: [number, number] | null;
}

const Square = ({ value, onClick, coordinateTigerSelected, coordinateEach }: ISquareProps) => {
  function validateTigerSelected() {
    if (coordinateTigerSelected && coordinateEach) {
      if (
        coordinateTigerSelected[0] === coordinateEach[0] &&
        coordinateTigerSelected[1] === coordinateEach[1]
      ) {
        return true;
      }
    }
    return false;
  }

  return (
    <S.SquareButton onClick={onClick}>
      {value && (
        <S.GoatOrTiger
          src={value === 'T' ? tigerImg : goatImg}
          $isTigerSelected={validateTigerSelected()}
        />
      )}
    </S.SquareButton>
  );
};

export default Square;
