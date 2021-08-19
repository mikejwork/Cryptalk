import React, { useState, useEffect, createContext } from "react";
import { Auth } from "aws-amplify";

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, [])

  async function checkUser() {
    try {
      await Auth.currentAuthenticatedUser().then((result) => {
        setUser(result);
        setLoading(false);
        console.log(result)
      });
    } catch (e) {
      setUser(null);
      setLoading(false);
      console.log(e)
    }
  }

  if (loading) {
    return <div className="form-container"><h2>Loading..</h2></div>;
  }
  return (
    <AuthContext.Provider value={{ user: user, updateUser: setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
