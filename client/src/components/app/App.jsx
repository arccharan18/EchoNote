import "./App.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const App = (props) => {
  const { data } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Check if data is available before accessing its properties
  const profileImg = data ? data.img : '';

  return (
    <div className="app">
      <div className="app__nav">
        <div className="app__nav__history">
          <div className="app__nav__history-icon">
            <RiArrowLeftSLine onClick={() => navigate(-1)} />
          </div>
          <div className="app__nav__history-icon">
            <RiArrowRightSLine onClick={() => navigate(1)} />
          </div>
        </div>
        <div className="app__nav__profile">
          {/* Render profile image if available */}
          {profileImg && (
            <img
              crossOrigin="anonymous"
              src={profileImg}
              alt=""
              className="app__nav__profile--img"
            />
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
};

export default App;
