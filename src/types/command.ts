import { IconType } from '@react-icons/all-files/lib';

export type Command = {
  title: string;
  icon: IconType;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
};
