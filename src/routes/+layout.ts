import type { SongGroup } from "$lib/types";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const res = await fetch('/api/song-groups');
    const jsonResponse = await res.json();
    const songGroups: SQLSongGroup[] = jsonResponse.rows;

    const today = new Date().toLocaleString('default', { weekday: 'long' });
    return {
        songGroups,
        songGroup: {
            id: 0,
            day: today,
            title: today
        } as SongGroup,
        songsOrders: [],
    };
}) satisfies LayoutLoad;