import "./SquareList.scss";
import { Link } from "react-router-dom";
import { replaceQueue } from "../../store/reducers/queue.js";
import { useDispatch } from "react-redux";
import { RiPlayCircleFill } from "react-icons/ri";
import PropTypes from 'prop-types'; // Import PropTypes

const SquareList = ({ list, type = "song" }) => {
  const dispatch = useDispatch();

  const handlePlaySong = (e, song) => {
    if (type !== 'song') return;
    e.preventDefault();

    dispatch(replaceQueue({ songs: [song], i: 0, id: song.id }));
  }

  return (
    <div className="square-list">
      {/* Check if list is an array before mapping */}
      {Array.isArray(list) && list.map((el) => (
        <Link
          key={el.id}
          to={
            type === "artist" || type === "playlist" ? `/${type}/${el.id}` : ""
          }
          className={`square-card ${type === "artist" ? 'square-card--artist' : ''}`}
          onClick={(e) => handlePlaySong(e, el)}
        >
          <img src={el.img} alt={el.name}/>
          <div className="square-card__name">{el.name}</div>
          <span>{type}</span>

          {/* Ensure el object has necessary properties for conditional rendering */}
          {type === "song" && el.id && el.name && el.img && <RiPlayCircleFill className="square-card__btn"/>}
        </Link>
      ))}
    </div>
  );
};

// Define PropTypes
SquareList.propTypes = {
  list: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['song', 'artist', 'playlist']), // Validate type prop
};

export default SquareList;
