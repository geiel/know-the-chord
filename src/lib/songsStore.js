import { writable } from 'svelte/store';

export const editMode = writable(false);
export const songTitle = writable('');
export const songsOrder = writable([]);
export const selectedDayId = writable('');
export const selectedChord = writable('');
export const day = writable('');
