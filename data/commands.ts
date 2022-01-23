import { Command } from '@/types/command';
import { BsMoon } from '@react-icons/all-files/bs/BsMoon';
import { FcCloseUpMode } from '@react-icons/all-files/fc/FcCloseUpMode';
import { FcEditImage } from '@react-icons/all-files/fc/FcEditImage';
import { FcFeedback } from '@react-icons/all-files/fc/FcFeedback';
import { FcHome } from '@react-icons/all-files/fc/FcHome';
import { RiGithubFill } from '@react-icons/all-files/ri/RiGithubFill';
import { RiInstagramFill } from '@react-icons/all-files/ri/RiInstagramFill';
import { RiLinkedinFill } from '@react-icons/all-files/ri/RiLinkedinFill';
import { RiTwitterFill } from '@react-icons/all-files/ri/RiTwitterFill';
import { WiDaySunny } from '@react-icons/all-files/wi/WiDaySunny';
import { LINKEDIN } from 'src/constants';
import { GITHUB, INSTAGRAM, TWITTER } from './../src/constants';

const commands: Command[] = [
  {
    title: 'Home',
    icon: FcHome,
    href: '/',
    isExternal: false,
  },
  {
    title: 'Portfolio',
    icon: FcEditImage,
    href: '/portfolio',
    isExternal: false,
  },
  {
    title: 'Blog',
    icon: FcFeedback,
    href: '/blog',
    isExternal: false,
  },
  {
    title: 'About',
    icon: FcCloseUpMode,
    href: '/about',
    isExternal: false,
  },
  {
    title: 'Linkedin',
    icon: RiLinkedinFill,
    href: LINKEDIN,
    isExternal: true,
  },
  {
    title: 'Github',
    icon: RiGithubFill,
    href: GITHUB,
    isExternal: true,
  },
  {
    title: 'Twitter',
    icon: RiTwitterFill,
    href: TWITTER,
    isExternal: true,
  },
  {
    title: 'Instagram',
    icon: RiInstagramFill,
    href: INSTAGRAM,
    isExternal: true,
  },
  {
    title: 'Dark Theme',
    icon: BsMoon,
  },
  {
    title: 'Light Theme',
    icon: WiDaySunny,
  },
];

export default commands;
