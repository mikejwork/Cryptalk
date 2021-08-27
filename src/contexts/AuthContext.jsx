import React, { useState, useEffect, createContext } from "react";
import { Auth, Hub } from "aws-amplify";

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkUser() {
    try {
      await Auth.currentAuthenticatedUser().then((result) => {
        setUser(result);
        setLoading(false);
      });
    } catch (e) {
      setUser(null);
      setLoading(false);
    }
  }

  // Creates a listener that will trigger on auth events
  async function setAuthListener() {
    Hub.listen("auth", (data) => {
      switch(data.payload.event) {
        case "signIn":
          checkUser()
          break;
        case "signOut":
          checkUser()
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    checkUser();
    setAuthListener();

    return () => {
      Hub.remove("auth");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    // TODO, make something nicer, maybe a loading gif?
    return <div className="form-container"><h2>Loading..</h2></div>;
  }
  return (
    <AuthContext.Provider value={{ user: user, updateUser: setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
