import { Command } from '@/types/command';
import { BsMoon } from 'react-icons/bs';
import { FcCloseUpMode, FcEditImage, FcHome, FcNews } from 'react-icons/fc';
import {
  RiGithubFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiTwitterFill
} from 'react-icons/ri';
import { WiDaySunny } from 'react-icons/wi';
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
    icon: FcNews,
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
