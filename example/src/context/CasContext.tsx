import React, { createContext, useRef, useCallback, useContext, PropsWithChildren } from 'react';

type Logger = (...parts: any[]) => void;
type Ctx = { log: Logger; setLogger: (l: Logger) => void };

const Context = createContext<Ctx>({ log: () => {}, setLogger: () => {} });
export const useCas = () => useContext(Context);

export const CasProvider = ({ children }: PropsWithChildren) => {
  const ref = useRef<Logger>();
  const log = useCallback<Logger>((...p) => ref.current?.(...p), []);
  const setLogger = useCallback((l: Logger) => { ref.current = l; }, []);
  return <Context.Provider value={{ log, setLogger }}>{children}</Context.Provider>;
};
