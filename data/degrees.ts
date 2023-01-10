import { Degree } from '@/types/degree';
import { IoMdSchool } from 'react-icons/io';

const degrees: Degree[] = [
  {
    title: 'System Administration and Security (vocational degree)',
    date: '2022-2023',
    location: 'IUT Châlons (Châlons-en-Champagne, France)',
    icon: IoMdSchool,
  },
  {
    title: 'DUT Networks and Telecommunications (two-year university degree)',
    date: '2020-2022',
    location: 'IUT Châlons (Châlons-en-Champagne, France)',
    icon: IoMdSchool,
    details: ['Vice-Major of the class'],
  },
  {
    title: 'Scientific Baccalaureate (A level equivalent)',
    date: '2019-2020',
    location: 'Lycée Jean Talon (Châlons-en-Champagne, France)',
    icon: IoMdSchool,
    details: [
      'Specialised in ISN (Computer and digital sicences)',
      'With distinctions',
    ],
  },
];

export default degrees;
