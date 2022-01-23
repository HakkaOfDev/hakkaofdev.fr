import { Extra } from '@/types/extra';
import { BiDumbbell } from '@react-icons/all-files/bi/BiDumbbell';
import { GiGears } from '@react-icons/all-files/gi/GiGears';
import { GiHammerDrop } from '@react-icons/all-files/gi/GiHammerDrop';
import { GiPalette } from '@react-icons/all-files/gi/GiPalette';
import { RiLightbulbFlashLine } from '@react-icons/all-files/ri/RiLightbulbFlashLine';
import { RiTeamLine } from '@react-icons/all-files/ri/RiTeamLine';

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
