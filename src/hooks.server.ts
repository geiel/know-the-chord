import connection from '$lib/server/db/connection';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({event, resolve}) => {
    
    event.locals.connection = connection;
    return resolve(event);

}) satisfies Handle;