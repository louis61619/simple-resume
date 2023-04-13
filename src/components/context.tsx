import React from "react";

export const GlobalContext = React.createContext({});

export const GlobalProvider: React.FC = () => {
  return <GlobalContext.Provider value={{}}></GlobalContext.Provider>;
};
