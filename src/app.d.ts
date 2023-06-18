// See https://kit.svelte.dev/docs/types#app

import type { SongGroup } from '$lib/types';
import type { SQLSongOrders } from './routes/groups/[group_id]/+page.server';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			connection: import('mysql2/promise').Connection
		}
		interface PageData {
			songGroup: SongGroup,
			songsOrders: SQLSongOrders[]
		}
		// interface Platform {}
	}
}

export {};
