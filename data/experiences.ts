import { Experience } from '@/types/experience';
import { DiJava } from '@react-icons/all-files/di/DiJava';
import { DiLinux } from '@react-icons/all-files/di/DiLinux';
import { FaPeopleCarry } from '@react-icons/all-files/fa/FaPeopleCarry';
import { FaRaspberryPi } from '@react-icons/all-files/fa/FaRaspberryPi';
import { FiMonitor } from '@react-icons/all-files/fi/FiMonitor';
import { GiServerRack } from '@react-icons/all-files/gi/GiServerRack';
import { GiWifiRouter } from '@react-icons/all-files/gi/GiWifiRouter';
import { RiCalendarEventLine } from '@react-icons/all-files/ri/RiCalendarEventLine';
import { RiUserVoiceFill } from '@react-icons/all-files/ri/RiUserVoiceFill';
import { SiGnubash } from '@react-icons/all-files/si/SiGnubash';

const experiences: Experience[] = [
  {
    title: 'CEO',
    company: 'Association of students of Networks and Telecommunications',
    date: 'Since 2021',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'Event organizer',
        icon: RiCalendarEventLine,
      },
      {
        task: 'Management of a team of 5 collaborators',
        icon: FaPeopleCarry,
      },
    ],
  },
  {
    title: 'Pizza Delivery',
    company: 'La Boîte à Pizza',
    date: 'July 2021 - August 2021',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'Contact with customers',
        icon: RiUserVoiceFill,
      },
    ],
  },
  {
    title: 'Project Manager',
    company: 'HeavenMoon',
    date: 'April 2020 - February 2021',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'System administrator (implementation of services and maintenance)',
        icon: FiMonitor,
      },
      {
        task: 'Development of JAVA applications',
        icon: DiJava,
      },
      {
        task: 'Management of a team of 7 employees',
        icon: FaPeopleCarry,
      },
    ],
  },
  {
    title: 'National competition on computer challenges',
    company: 'Capture The Flag',
    date: 'February 2020',
    location: 'IUT Châlons (Châlons-en-Champagne, France)',
    tasks: [
      {
        task: 'Puzzle solving mainly linux oriented',
        icon: DiLinux,
      },
      {
        task: 'Bash scripts',
        icon: SiGnubash,
      },
    ],
  },
  {
    title: 'Discovery of computer and network professions - Discovery workshop',
    company: 'ENSAM (Arts et métiers)',
    date: 'February 2017',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'Installation of computer racks',
        icon: GiServerRack,
      },
      {
        task: 'Use of Raspberry PI',
        icon: FaRaspberryPi,
      },
      {
        task: 'Switches, Routers and Wi-Fi Terminals',
        icon: GiWifiRouter,
      },
    ],
  },
];

export default experiences;
