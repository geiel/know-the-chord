import type { RequestHandler } from "@sveltejs/kit";
export const PUT = (async ({ request, locals, url }) => {
    const body = await request.json() as UpdatePositionRequest;
    const groupId = Number(url.searchParams.get('groupId'));

    locals.connection.execute(`
        UPDATE songs_order SET position = ? WHERE song_id = ? AND song_group_id = ?;
    `, [body.newSongPosition, body.newSongId, groupId]);

    locals.connection.execute(`
        UPDATE songs_order SET position = ? WHERE song_id = ? AND song_group_id = ?;
    `, [body.oldSongPosition, body.oldSongId, groupId]);
    
    return new Response();
}) satisfies RequestHandler;