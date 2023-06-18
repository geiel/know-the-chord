import { writable } from 'svelte/store';
import type { SongGroup } from './types';

export const editMode = writable(false);

//DAO properties
export const selectedSongGroup = writable<SongGroup>();

//Search properties
export const searchedChordValue = writable('');
export const searchedSongTitle = writable('');