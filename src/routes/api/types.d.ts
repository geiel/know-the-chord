interface UpdatePositionRequest {
    newSongId: number,
    newSongPosition: number,
    oldSongId: number,
    oldSongPosition: number
}

interface AddChordRequest {
    songId: number,
    value: string,
    type: string
}

interface SQLSongGroup {
    id: number,
    sgTitle: string,
    songTitle: string,
    chordValue: string | null
}

interface AddSongOrderRequest {
    songId: number,
    songGroupId: number,
    position: number
}