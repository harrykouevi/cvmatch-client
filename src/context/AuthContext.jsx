import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {API_URL }from "../components/Routes";



const saveIfExists = (firstKey ,secondKey) => {
  const value = localStorage.getItem(secondKey);
  if (value !== null) {
    localStorage.setItem(firstKey, value);
  }
};

export function trackMeta(eventName, params = {}, isCustom = true) {
  if (typeof window !== "undefined" && window.fbq) {
    if (isCustom) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("track", eventName, params);
    }
  }

  if(typeof window !== "undefined" && window.gtag){
    window.gtag( "event", eventName, params );
  }
}



const AuthContext = createContext();

const isBrowser = typeof window !== "undefined";
const safeStorage = {
  getItem: (k) => (isBrowser ? window.localStorage.getItem(k) : null),
  setItem: (k, v) => { if (isBrowser) window.localStorage.setItem(k, v); },
  removeItem: (k) => { if (isBrowser) window.localStorage.removeItem(k); },
};

export function AuthProvider({ children }) {
  const pathname = isBrowser ? window.location.pathname : "/";
  const params = new URLSearchParams(isBrowser ? window.location.search : "");

  const [mode, setMode] = useState(() => {
    if(pathname === "/auth/callback") return "callback" ;
     
    const newmode = safeStorage.getItem("changemode") ;
    if(newmode){
      return newmode ;
    }else{
      const redirect = safeStorage.getItem("redirect") ;
      if(redirect){ return redirect ; }
    }

    if (pathname === "/" && params.get("from") === "email_checkout" && ["dashboard", "app"].includes(params.get("to"))){  return  params.get("to")} 
    return  "landing";
  });
  
  const [user, setUser] = useState(() => {
    try {
      const storedUser = safeStorage.getItem("connected_user");
      if (!storedUser || storedUser === "undefined") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      return null;
    }
  });

  const [credits, setCredits] = useState({
    total: 0,
    used: 0,
    remaining: 0,
  });

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(
          `${API_URL}/v1/auth/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
      }

      
      // CLEAR STORAGE
      localStorage.removeItem("selected_plan");
      localStorage.removeItem("redirect");
      localStorage.removeItem("token");
      localStorage.removeItem("connected_user");
      localStorage.removeItem("guest_token");
      localStorage.removeItem("analysisId");
      localStorage.removeItem("cvmatch_resume_id");
      localStorage.removeItem("cvmatch_job_text");
      localStorage.removeItem("cvmatch_resume_name");
      localStorage.removeItem("cvmatch_current");

      // RESET STATE
      setUser(null);

    } catch (error) {
      console.error("logout error:", error);
    }


    setCredits({
      total: 0,
      used: 0,
      remaining: 0,
    });

    setMode("landing");

    // REDIRECT
    window.location.href = "/";
  };

  const connectWithGoogle = (expiredToken = null) => {
    const guestToken = localStorage.getItem("guest_token");

    const url = guestToken
      ? `${API_URL}/auth/google?guest_token=${guestToken}`
      : `${API_URL}/auth/google`;

    
    const userId =  user?.id
    if(expiredToken){
      localStorage.setItem(`expiredToken_${userId}`, expiredToken);
      saveIfExists(`temp_selected_plan_${userId}`, "selected_plan");
      saveIfExists(`temp_redirect_${userId}`, "redirect");
      saveIfExists(`temp_analysisId_${userId}`, "analysisId");
      saveIfExists(`temp_cvmatch_resume_id_${userId}`, "cvmatch_resume_id");
      saveIfExists(`temp_cvmatch_job_text_${userId}`, "cvmatch_job_text");
      saveIfExists(`temp_cvmatch_resume_name_${userId}`, "cvmatch_resume_name");
      saveIfExists(`temp_cvmatch_current_${userId}`, "cvmatch_current");

      localStorage.removeItem("selected_plan");
      localStorage.removeItem("redirect");
      localStorage.removeItem("token");
      localStorage.removeItem("connected_user");
      localStorage.removeItem("analysisId");
      localStorage.removeItem("cvmatch_resume_id");
      localStorage.removeItem("cvmatch_job_text");
      localStorage.removeItem("cvmatch_resume_name");
      localStorage.removeItem("cvmatch_current");
    }
    
    trackMeta("StartRegistration", { method: "google", location: "site_header_or_landing" }, true);
    window.location.href = url;
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem( "connected_user",  JSON.stringify(user));
      const total = user?.credits?.total || 0;
      const used = user?.credits?.used || 0;
      setCredits({
        total,
        used,
        remaining: total - used,
      });
    }
  }, [user]);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    const guestToken = localStorage.getItem("guest_token");

    try {
      
      if (!token && !guestToken) {
        return null;
      }
      const headers = { Accept: "application/json", };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else if (guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      const response = await fetch( `${API_URL}/v1/auth/me`,
        { headers, }
      );

      if ( response.status === 401 ) {
        if (token)  connectWithGoogle(token);
        return;
      }

      const data = await response.json();
      const updatedUser = data?.data || null;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem( "connected_user", JSON.stringify(updatedUser));

        const userId  = updatedUser?.id ;
        const expiredToken = localStorage.getItem(`expiredToken_${userId}`);
        if(expiredToken){
          localStorage.removeItem(`expiredToken_${userId}`);
          saveIfExists("selected_plan", `temp_selected_plan_${userId}`);
          saveIfExists("redirect", `temp_redirect_${userId}`);
          saveIfExists("analysisId", `temp_analysisId_${userId}`);
          saveIfExists("cvmatch_resume_id", `temp_cvmatch_resume_id_${userId}`);
          saveIfExists("cvmatch_job_text", `temp_cvmatch_job_text_${userId}`);
          saveIfExists("cvmatch_resume_name", `temp_cvmatch_resume_name_${userId}`);
          saveIfExists("cvmatch_current", `temp_cvmatch_current_${userId}`);
          

          localStorage.removeItem(`temp_selected_plan_${userId}`);
          localStorage.removeItem(`temp_redirect_${userId}`);
          localStorage.removeItem(`temp_analysisId_${userId}`);
          localStorage.removeItem(`temp_cvmatch_resume_id_${userId}`);
          localStorage.removeItem(`temp_cvmatch_job_text_${userId}`);
          localStorage.removeItem(`temp_cvmatch_resume_name_${userId}`);
          localStorage.removeItem(`temp_cvmatch_current_${userId}`);
        
        }
      }
    } catch (err) {
      console.error("refreshUser error:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        mode,
        setMode,
        user,
        setUser,
        credits,
        connectWithGoogle,
        handleLogout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}