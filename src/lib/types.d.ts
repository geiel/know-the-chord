import type { RowDataPacket } from "mysql2"

export interface Song extends RowDataPacket {
    id: number,
    title: string,
    artist: string
}

export interface SongGroup extends RowDataPacket {
    id: number,
    day: string,
    title: string
}

export interface Chord extends RowDataPacket {
    id: number,
    song_id: number,
    value: string,
    type: string
}

export interface SongsOrder extends RowDataPacket {
    position: number,
    song_id: number,
    song_group_id: number
    song_group_chord: string
}

