import { signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { GoogleAuthProvider } from "firebase/auth";

function Login() {

  const login = async () => {

    const provider = new GoogleAuthProvider();

    try {

      await signInWithPopup(auth, provider);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="container">

      <h1 className="heading">
        AI Career Roadmap 🚀
      </h1>

      <p className="subtext">
        Login to continue
      </p>

      <button
        className="roadmapButton"
        onClick={login}
      >
        Login with Google
      </button>

    </div>

  );

}

export default Login;