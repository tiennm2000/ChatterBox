import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = [
  'bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006eaa]',
  'bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]',
  'bg-[#00d6a02a] text-[#00d6a0] border-[1px] border-[#00d6a0bb]',
  'bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]',
];

export const getColor = (color: number) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};
