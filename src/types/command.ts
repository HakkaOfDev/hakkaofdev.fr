import { IconType } from 'react-icons';

export type Command = {
  title: string;
  icon: IconType;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
};
