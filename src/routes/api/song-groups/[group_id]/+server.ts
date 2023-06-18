import type { RequestHandler } from "./$types";

export const DELETE = (async ({ locals, params }) => {
    locals.connection.execute(`
        DELETE FROM song_groups WHERE id = ?;
    `, [params.group_id]);

    locals.connection.execute(`
        DELETE FROM songs_order WHERE song_group_id = ?;
    `, [params.group_id]);

    return new Response;
}) satisfies RequestHandler;