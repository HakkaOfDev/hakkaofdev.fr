import { IconType } from 'react-icons';

export type Degree = {
  title: string;
  date: string;
  location: string;
  icon: IconType;
  details?: string[];
};
