import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import { useFamilyStore } from "../stores/useFamilyStore";
// import { useChildStore } from "../stores/useChildStore";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  // const { fetchFamilies, families, selectedFamilyId } = useFamilyStore();
  // const { fetchChildren } = useChildStore();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChildId, setCurrentChildId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchInfo(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchInfo(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInfo = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .eq("state", "active")
        .single();

      if (error) throw error;
      setUser(data);
      // console.log(data, "user");

      // const currentFamilyId = await fetchFamilies(userId);

      // console.log(families, "families");
      // console.log(currentFamilyId, "familyId");
      // const dd = await fetchChildren(currentFamilyId);
      // console.log(dd, "child");
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   navigate("/login");
  // };

  return (
    <AuthContext.Provider value={{ user, session, loading, currentChildId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
