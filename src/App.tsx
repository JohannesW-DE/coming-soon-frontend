import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation} from "react-router-dom";

import { Grommet, Main } from "grommet";
import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import ListView from "./list/ListView";
import ComingSoon from "./comingSoon/ComingSoon";
import TermsOfService from "./misc/TermsOfService";
import PrivacyPolicy from "./misc/PrivacyPolicy";
import Login from "./Login";
import { theme } from "./theme";
import Header from "./Header";

export const GQL_GET_CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      _id
      username
      email
      lists {
        _id
        name
      }
      bookmarks {
        list {
          _id
          name
        }
        added_at
        favourite
        own
      }
      settings {
        key
        value
        values
      }
    }
  }
`;


const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [checked, setChecked] = useState(false);

  const getCurrentUser = useQuery(GQL_GET_CURRENT_USER);

  useEffect(() => {
    if (getCurrentUser.data) {
      setUser(getCurrentUser.data.currentUser);
    } else {
      setUser(null);
    }
  }, [getCurrentUser])

  useEffect(() => {
    setChecked(true);
  }, [user]);

  const refresh = (callback: VoidFunction) => {
    getCurrentUser.refetch().then(() => {
      callback();
    });
  };

  const signout = (callback: VoidFunction) => {
    if (process.env.REACT_APP_LOGOUT_URL) {
      setChecked(false);
      axios.get(process.env.REACT_APP_LOGOUT_URL, { withCredentials: true }).then(() => {
        getCurrentUser.refetch().then(() => {
          callback();
        });     
      })    
    };
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = { user, checked, signout, refresh };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth?.checked) {
    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <></>
    )
  }
  
  if (!auth?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    children
  )
  
}

function App() {
  return (
    <AuthProvider>
      <Grommet theme={theme} full="min">
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="terms-of-service" element={<TermsOfService />} />             
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="list/:id" element={<ListView />} />                                   
          
            <Route
              path="/coming-soon"
              element={
                <RequireAuth>
                  <ComingSoon />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />    
          </Routes>
        </Main>          
      </Grommet>
    </AuthProvider>
  )
}

interface IBookmark {
  list: {
    _id: string;
    name: string;
  };
  added_at: string;
  favourite: boolean;
  own: boolean;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  lists: [{
    _id: string;
    name: string;
  }],
  bookmarks: IBookmark[];
  settings: [{
    key: string;
    value: string;
    values: string[];
  }];
}


interface AuthContextType {
  user: IUser | null;
  checked: boolean;
  signout: (callback: VoidFunction) => void;
  refresh: (callback: VoidFunction) => void;  
}


export default App;