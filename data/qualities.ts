import { Extra } from '@/types/extra';
import { BiDumbbell } from 'react-icons/bi';
import { GiGears, GiHammerDrop, GiPalette } from 'react-icons/gi';
import { RiLightbulbFlashLine, RiTeamLine } from 'react-icons/ri';

const qualities: Extra[] = [
  {
    icon: GiHammerDrop,
    text: 'Persistent',
  },
  {
    icon: RiTeamLine,
    text: 'Teamwork',
  },
  {
    icon: BiDumbbell,
    text: 'Athletic',
  },
  {
    icon: RiLightbulbFlashLine,
    text: 'Quick-Witted',
  },
  {
    icon: GiPalette,
    text: 'Creative',
  },
  {
    icon: GiGears,
    text: 'Adaptability',
  },
];

export default qualities;
