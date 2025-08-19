import React, { useCallback, useContext, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';

type Logger = (...data: any[]) => void;

const CasContext = React.createContext<{  
  logCasInfo: Logger;
  setCasLogger: (logger: Logger) => void;
}>({  
  logCasInfo: () => ({}),
  setCasLogger: () => ({}),
});

export const useCasContext = () => useContext(CasContext);

export const CasProvider = (props: PropsWithChildren<any>) => {  
  const logger = useRef<Logger>();

  const logCasInfo = useCallback((...data: any[]) => {
    logger.current?.('CAS: ', ...data);
  }, []);

  return (
    <CasContext.Provider
      value={{        
        logCasInfo,
        setCasLogger: (l) => (logger.current = l),
      }}
    >
      {props.children}
    </CasContext.Provider>
  );
};