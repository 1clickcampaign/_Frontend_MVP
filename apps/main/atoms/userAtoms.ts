import { atom } from 'jotai';
import { User, List } from '@/types/database';

export const userAtom = atom<User | null>(null);
export const listsAtom = atom<List[]>([]);
