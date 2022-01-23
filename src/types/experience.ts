import { IconType } from '@react-icons/all-files/lib';

export type Experience = {
  title: string;
  company: string;
  date: string;
  location: string;
  tasks: ExperienceTask[];
};

export type ExperienceTask = {
  task: string;
  icon: IconType;
};
