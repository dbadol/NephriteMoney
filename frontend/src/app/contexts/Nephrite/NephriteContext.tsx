import React, { createContext, useContext, useState } from "react";

type NephriteContextValue = {
  config: any;
  nephrite: any;
};

const NephriteContext = createContext<NephriteContextValue | undefined>(undefined);

type NephriteProviderProps = {
};

export const NephriteProvider: React.FC<NephriteProviderProps> = ({
  children,
}) => {

  const [config, setConfig] = useState();


  const nephrite = {};

  return (
    <NephriteContext.Provider value={{ config, nephrite }}>
      {children}
    </NephriteContext.Provider>
  );
};

export const useNephrite = () => {
  const nephriteContext = useContext(NephriteContext);

  if (!nephriteContext) {
    throw new Error("You must provide a NephriteContext via NephriteProvider");
  }

  return nephriteContext;
};
