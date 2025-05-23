import { ReactNode, useReducer } from 'react';
import { Context, DispatchContex, defaultCtx, reducer } from './context';

export default function Main({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultCtx);

  return (
    <Context.Provider value={state}>
      <DispatchContex.Provider value={dispatch}>
        <main>{children}</main>
      </DispatchContex.Provider>
    </Context.Provider>
  );
}
