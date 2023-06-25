<script lang="ts">
	import { selectedSongGroup } from '$lib/songsStore';
	import type { PageData } from './$types';
	import type { SQLSongOrders } from './+page.server';
	import OrderInput from '../../../components/OrderInput.svelte';

	export let data: PageData;

	if (data.songGroup) {
		selectedSongGroup.set(data.songGroup);
	}

	$: songs = data.songsOrders;

	async function swapPosition(song: SQLSongOrders, newPosition: number) {
		if (newPosition > data.songsOrders.length) {
			return;
		}

		const swappedSong = data.songsOrders.find((sSong) => sSong.position === newPosition);

		if (!swappedSong) {
			return;
		}

		data.songsOrders = data.songsOrders.map((mSong) => {
			if (mSong.songId === song.songId) {
				return { ...mSong, position: newPosition };
			} else if (mSong.position === newPosition) {
				return { ...mSong, position: song.position };
			} else {
				return mSong;
			}
		});

		data.songsOrders.sort((a, b) => a.position - b.position);

		await fetch(`/api/songs-order?groupId=${data.songGroup.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				newSongId: song.songId,
				newSongPosition: newPosition,
				oldSongId: swappedSong.songId,
				oldSongPosition: song.position
			})
		});
	}
</script>

{#each songs as song (song.songId)}
	<OrderInput
		songTitle={song.songTitle}
		chord={song.chordValue}
		position={song.position.toString()}
		on:changePosition={(event) => swapPosition(song, event.detail.newPosition)}
	/>
{/each}
