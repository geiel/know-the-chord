import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals, url }) => {
    const query = url.searchParams.get("query");

    const [songs] = await locals.connection.execute(`
        SELECT id, title, artist
        FROM songs
        WHERE title LIKE ?;
    `, [`%${query}%`]);

    return json(songs);
}) satisfies RequestHandler;