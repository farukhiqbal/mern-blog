import React, {  useState,useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Logo from "../images/Logo.webp";
import { UserContext } from "../context/userContext";
// ...

const Header = () => {
  const [isNavShow, setisNavShow] = useState(
    window.innerWidth > 800 ? true : false
  );

  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setisNavShow(false);
    } else {
      setisNavShow(true);
    }
  };

  return (
    <nav>
      <div className="container  nav_container">
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          {/* <b> New Blog  </b>   */}
           <img src={Logo} alt="" />
        </Link>
        {currentUser?.id  && isNavShow && <ul className="nav_menu">
            <li>
              <Link to="/profile/sdfsdf" onClick={closeNavHandler}>
                  {currentUser.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Logout
              </Link>
            </li>
          </ul>
        }

        {!currentUser && isNavShow &&   <ul className="nav_menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Login
              </Link>
            </li>
          </ul>
        }

        <button
          className="nav_toggle-btn"
          onClick={() => setisNavShow(!isNavShow)}
        >
          {isNavShow ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
