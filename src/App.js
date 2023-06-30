import { useRef, useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Cookies from "js-cookie";
import { auth } from "./firebase-config";
import { signOut } from "firebase/auth";
require("./css/App.css");

function App() {
  const [isLogin, setisLogin] = useState(Cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomRef = useRef(null);
  const handleLogin = () => {
    setisLogin(Cookies.get("auth-token"));
  };

  if (!isLogin) {
    return (
      <>
        <Login login={handleLogin} />
      </>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    Cookies.remove("auth-token");
    handleLogin();
    setRoom(null);
  };

  return (
    <div className="main-container">
      {room ? (
        <Chat room={room} login={handleLogin} setRoom={setRoom} />
      ) : (
        <div className="room-container">
          <input type="text" placeholder="Room-Key" ref={roomRef} />
          <button onClick={(e) => setRoom(roomRef.current.value)}>
            Enter Room
          </button>
        </div>
      )}
      <div className="signout">
        <button onClick={handleLogout}>Signout</button>
      </div>
    </div>
  );
}

export default App;
