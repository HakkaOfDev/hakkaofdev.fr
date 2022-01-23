import commands from '@/data/commands';
import { Command } from '@/types/command';
import { createContext, PropsWithChildren, useState } from 'react';

type PaletteType = {
  isOpened: boolean;
  focusedIndex: number;
  open: () => void;
  close: () => void;
  setFocusedIndex: (index: number) => void;
  commands: Command[];
  filterCommands: (query: string) => void;
};

export const PaletteContext = createContext<PaletteType>({
  isOpened: false,
  focusedIndex: 0,
  open: () => {},
  close: () => {},
  setFocusedIndex: () => {},
  commands: [],
  filterCommands: () => {},
});

const PaletteProvider = ({ children }: PropsWithChildren<{}>) => {
  const [displayedCommands, setDisplayedCommands] = useState(commands);
  const [isOpened, setIsOpened] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const open = () => {
    setIsOpened(true);
    setDisplayedCommands(commands);
    setFocusedIndex(0);
  };

  const close = () => {
    setIsOpened(false);
  };

  const filterCommands = (query: string) => {
    setDisplayedCommands(
      commands.filter((command) =>
        command.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <PaletteContext.Provider
      value={{
        isOpened,
        focusedIndex,
        open,
        close,
        setFocusedIndex,
        commands,
        filterCommands,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export default PaletteProvider;
