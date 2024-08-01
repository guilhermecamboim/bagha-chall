import './styles.css';

interface ISquareProps {
  value: number;
  onClick: () => void;
}

const Square = ({ value, onClick }: ISquareProps) => {
    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );
};

export default Square;
