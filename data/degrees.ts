import { Degree } from '@/types/degree';
import { GiDiploma } from '@react-icons/all-files/gi/GiDiploma';
import { IoMdSchool } from '@react-icons/all-files/io/IoMdSchool';

const degrees: Degree[] = [
  {
    title: 'DUT Networks and Telecommunications (two-year university degree)',
    date: '2020-2021',
    location: 'IUT Châlons (Châlons-en-Champagne, France)',
    icon: IoMdSchool,
    details: ['First year'],
  },
  {
    title: 'Scientific Baccalaureate (A level equivalent)',
    date: '2019-2020',
    location: 'Lycée Jean Talon (Châlons-en-Champagne, France)',
    icon: GiDiploma,
    details: [
      'Specialised in ISN (Computer and digital sicences)',
      'With distinctions',
    ],
  },
];

export default degrees;
