import type { Chord, Song, SongGroup, SongsOrder } from '$lib/types';
import type { OkPacket, RowDataPacket } from 'mysql2/promise';
import type { Actions, PageServerLoad } from './$types';

export type SQLSongOrders = {
    position: number,
    songTitle: string,
    songId: number,
    chordValue: string
}

export const load = (async ({ params, locals }) => {
    const [[songGroup]] = await locals.connection.execute<SongGroup[]>(`
        SELECT id, day, title FROM song_groups
        WHERE id = ?
    `, [params.group_id]);

    const [sqlSongOrders] = await locals.connection.execute(`
        SELECT so.position, s.title AS songTitle, so.song_id AS songId, so.song_group_chord AS chordValue
        FROM song_groups sg
        INNER JOIN songs_order so ON sg.id = so.song_group_id
        INNER JOIN songs s ON s.id = so.song_id
        WHERE sg.id = ?
        ORDER BY so.position;
    `, [params.group_id])

    return {
        songGroup: songGroup as SongGroup, 
        songsOrders: sqlSongOrders as SQLSongOrders[]
    };
}) satisfies PageServerLoad;

export const actions = {
    addSong: async ({ locals, request, params }) => {
        const data = await request.formData();
        const parseRequest = addSongRequest(data);

        if (parseRequest) {
            const songId = await saveOrUpdateSong(locals, parseRequest.songTitle);
            await Promise.all([
                saveOrUpdateChord(locals, parseRequest.chordValue, "main", songId),
                addNewSongToSongsGroup(locals, songId, Number(params.group_id), parseRequest.chordValue)
            ]);
        }

        return { addSongSucess: true }
    },
    updateGroupTitle: async ({ locals, params, request }) => {
        const data = await request.formData();

        const title = data.get("transparent-input");
        if (title) {
            await locals.connection.execute(`
                UPDATE song_groups SET title = ?, updateAt = CURRENT_TIMESTAMP WHERE id = ?
            `, [title.toString(), params.group_id])
        }
    }
} satisfies Actions;

const addSongRequest = (data: FormData) => {
    const songTitle = data.get('songTitle');
    const chordValue = data.get('chordValue');

    if (songTitle && chordValue) {
        return {
            songTitle: songTitle.toString(),
            chordValue: chordValue.toString()
        }
    }

    return null;
}

async function saveOrUpdateSong(locals: App.Locals, songTitle: string): Promise<number> {
    const [[song]] = await locals.connection.execute<Song[]>(`
        SELECT * FROM songs WHERE title = ? LIMIT 1;
    `, [songTitle]);

    if (!song) {
        const [addedSong] = await locals.connection.execute<OkPacket>(`
            INSERT INTO songs (title) VALUES (?);
        `, [songTitle]);

        return addedSong.insertId;
    }

    return song.id;
}

async function saveOrUpdateChord(locals: App.Locals, chordValue: string, chordType: string, songId: number): Promise<number> {
    const [[chord]] = await locals.connection.execute<Chord[]>(`
        SELECT * FROM chords WHERE value = ? AND song_id = ? LIMIT 1;
    `, [chordValue, songId]);

    if (!chord) {
        const [addedChord] = await locals.connection.execute<OkPacket>(`
            INSERT INTO chords (song_id, value, type)
            VALUES (?, ?, ?);
        `, [songId, chordValue, chordType]);
        
        return addedChord.insertId;
    }

    locals.connection.execute(`
        UPDATE chords SET value = ?, type = ? WHERE id = ?;
    `, [chordValue, chordType, chord.id]);

    return chord.id;
}

async function addNewSongToSongsGroup(locals: App.Locals, songId: number, groupId: number, chordValue: string): Promise<void> {
    const [songOrder] = await locals.connection.execute<RowDataPacket[]>(`
        SELECT * FROM songs_order WHERE song_id = ? AND song_group_id = ?
    `, [songId, groupId]);

    if (!songOrder || !songOrder.length) {
        const [newPosition] = await locals.connection.execute<RowDataPacket[]>(`
            SELECT (position + 1) AS position FROM songs_order 
            WHERE song_group_id = ?
            ORDER BY position 
            DESC LIMIT 1;
        `, [groupId]);

        let position = 1;
        if (newPosition && newPosition.length) {
            position = newPosition[0]?.position;
        }

        locals.connection.execute("INSERT INTO songs_order VALUES (?, ?, ?, ?);", 
            [position, songId, groupId, chordValue]);

        return;
    }

    locals.connection.execute(`
        UPDATE songs_order SET song_group_chord = ? 
        WHERE song_id = ? 
        AND song_group_id = ?
    `, [chordValue, songId, groupId]);
}

