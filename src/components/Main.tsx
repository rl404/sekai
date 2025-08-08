import { useReducer } from 'react';
import { Context, DispatchContex, defaultCtx, reducer } from '@/src/components/context';
import AnimeDrawer from '@/src/components/drawers/AnimeDrawer';

export default function Main({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, dispatch] = useReducer(reducer, defaultCtx);

  const onOpen = (animeID: number) => {
    dispatch({ type: 'drawerAnimeID', value: animeID });
    dispatch({ type: 'drawerOpen', value: true });
  };

  const onClose = () => {
    dispatch({ type: 'drawerAnimeID', value: 0 });
    dispatch({ type: 'drawerOpen', value: false });
  };

  return (
    <Context.Provider
      value={{
        ...state,
        onOpenDrawer: onOpen,
        onCloseDrawer: onClose,
      }}
    >
      <DispatchContex.Provider value={dispatch}>
        <main>{children}</main>
        <AnimeDrawer animeID={state.drawerAnimeID} open={state.drawerOpen} onClose={onClose} />
      </DispatchContex.Provider>
    </Context.Provider>
  );
}
