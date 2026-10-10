export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // defaults to true for seamless self-contained sandbox demo

export const ORDER_STATUS_FLOW = [
  'OPEN',
  'LOCKED',
  'ORDERED',
  'DELIVERED',
  'SETTLING',
  'COMPLETED',
] as const;

export const DEMO_USERS = [
  {
    id: 1,
    name: 'Karim Mostafa',
    email: 'karim@office.com',
    role: 'Creator & Colleague',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    instapayHandle: 'karim@instapay',
    phoneNumber: '01011112222',
  },
  {
    id: 2,
    name: 'Sara Ahmed',
    email: 'sara@office.com',
    role: 'Participant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    instapayHandle: 'sara@instapay',
    phoneNumber: '01055556666',
  },
  {
    id: 4,
    name: 'Tarek Zaki',
    email: 'tarek@office.com',
    role: 'Pickup Hero',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    instapayHandle: 'tarek@instapay',
    phoneNumber: '01033334444',
  },
  {
    id: 3,
    name: 'Omar Farouk',
    email: 'omar@office.com',
    role: 'Front Payer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    instapayHandle: 'omar@instapay',
    phoneNumber: '01099990000',
  },
];
