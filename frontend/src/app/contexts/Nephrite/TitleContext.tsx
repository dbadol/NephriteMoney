import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";

type TitleContextValue = {
  currentTitle: string,
  setCurrentTitle: Function,
  titleConfig: object
};

const TitleContext = createContext<TitleContextValue | undefined>(undefined);

type TitleProviderProps = {
};

export const TitleProvider: React.FC<TitleProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const match = useMatch('/editable/:action/:view');
  const [currentTitle, setCurrentTitle] = useState<string>();

  const titleConfig = {};

  useEffect(() => {
    if (!match) {
      setCurrentTitle(null)
    }
  }, [match]);

  return (
    <TitleContext.Provider value={{ currentTitle, setCurrentTitle, titleConfig }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const titleContext = useContext(TitleContext);

  if (!titleContext) {
    throw new Error("You must provide a TitleContext via TitleProvider");
  }

  return titleContext;
};
