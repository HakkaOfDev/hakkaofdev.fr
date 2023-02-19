import { Experience } from '@/types/experience';
import { BsFillHddNetworkFill } from 'react-icons/bs';
import { DiJava, DiLinux } from 'react-icons/di';
import { FaDocker, FaPeopleCarry, FaRaspberryPi } from 'react-icons/fa';
import { FiMonitor } from 'react-icons/fi';
import { GiServerRack, GiWifiRouter } from 'react-icons/gi';
import { IoIosGitNetwork } from 'react-icons/io';
import { MdDeveloperMode, MdEngineering } from 'react-icons/md';
import { RiCalendarEventLine, RiUserVoiceFill } from 'react-icons/ri';
import { SiGnubash, SiHiveBlockchain } from 'react-icons/si';

const experiences: Experience[] = [
  {
    title: 'Freelance',
    company: 'Alexandre GOSSARD',
    date: 'Since July 2022',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'Software Engineer',
        icon: MdDeveloperMode,
      },
      {
        task: 'System Administrator (implementation of services and maintenance)',
        icon: BsFillHddNetworkFill,
      },
      {
        task: 'Networks & Telecommunications Technician',
        icon: IoIosGitNetwork,
      },
    ],
  },
  {
    title: 'Lead Front-end Developers',
    company: 'Kabila App',
    date: 'Since June 2022',
    location: 'Madrid, Spain',
    tasks: [
      {
        task: 'Software Engineer',
        icon: MdEngineering,
      },
      {
        task: 'Blockchain Developer (Hedera Hashgraph)',
        icon: SiHiveBlockchain,
      },
      {
        task: 'Management of a team of 2 developers',
        icon: FaPeopleCarry,
      },
    ],
  },
  {
    title: 'Apprenticeship',
    company: 'Arche MC2',
    date: 'Since September 2022',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'System Administrator',
        icon: BsFillHddNetworkFill,
      },
      {
        task: 'Docker',
        icon: FaDocker,
      },
    ],
  },
  {
    title: 'Internship',
    company: 'Efficience-Informatique',
    date: 'March 2022 - June 2022',
    location: 'Châlons-en-Champagne, France',
    tasks: [
      {
        task: 'System Administrator',
        icon: BsFillHddNetworkFill,
      },
    ],
  },
  {
    title: 'CEO',
    company: 'Association of students of Networks and Telecommunications',
    date: 'March 2021 - March 2022',
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
        task: 'System Administrator',
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
