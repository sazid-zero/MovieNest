import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../services/appwrite";

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  region: string;
  setRegion: (region: string) => Promise<void>;
  includeAdult: boolean;
  setIncludeAdult: (val: boolean) => Promise<void>;
  refetchUser: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Preferences
  const [language, setLanguageState] = useState("en-US");
  const [region, setRegionState] = useState("US");
  const [includeAdult, setIncludeAdultState] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      if (res) {
        setIsLogged(true);
        setUser(res);
      } else {
        setIsLogged(false);
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setIsLogged(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const savedLang = await AsyncStorage.getItem("language");
      const savedRegion = await AsyncStorage.getItem("region");
      const savedAdult = await AsyncStorage.getItem("includeAdult");

      if (savedLang) setLanguageState(savedLang);
      if (savedRegion) setRegionState(savedRegion);
      if (savedAdult) setIncludeAdultState(savedAdult === "true");
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      if (AsyncStorage) {
        await AsyncStorage.setItem("language", lang);
      }
      setLanguageState(lang);
    } catch (error) {
      console.error("AsyncStorage Error (setLanguage):", error);
    }
  };

  const setRegion = async (reg: string) => {
    try {
      if (AsyncStorage) {
        await AsyncStorage.setItem("region", reg);
      }
      setRegionState(reg);
    } catch (error) {
      console.error("AsyncStorage Error (setRegion):", error);
    }
  };

  const setIncludeAdult = async (val: boolean) => {
    try {
      if (AsyncStorage) {
        await AsyncStorage.setItem("includeAdult", String(val));
      }
      setIncludeAdultState(val);
    } catch (error) {
      console.error("AsyncStorage Error (setIncludeAdult):", error);
    }
  };

  useEffect(() => {
    fetchUser();
    loadPreferences();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        language,
        setLanguage,
        region,
        setRegion,
        includeAdult,
        setIncludeAdult,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
