import { env } from '$env/dynamic/public';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    if (params.day_id === 'new') {
        const day = new Date().toLocaleString("default", {weekday: "long"});
        return {
            dayId: uuidv4(),
            selectedDaySong: {
                day,
                songsOrder: []
            }
        };
    }
    const response = await fetch(`${env.PUBLIC_SERVER}/day_songs/${params.day_id}`)
    const selectedDaySong = await response.json();
   
    selectedDaySong.songsOrder.sort((/** @type {{ order: number; }} */ a, /** @type {{ order: number; }} */ b) => a.order - b.order);
    return {
        dayId: params.day_id,
        selectedDaySong
    };
}