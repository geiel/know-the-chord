<script>
	import OrderInput from '../../../components/OrderInput.svelte';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { editMode, songsOrder, selectedDayId, day } from '$lib/songsStore';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;
	songsOrder.set(data.selectedDaySong.songsOrder);

	onMount(() => {
		selectedDayId.set(data.dayId);
		editMode.set(true);
		day.set(data.selectedDaySong.day);
	});

	// @ts-ignore
	async function reorder({ detail }) {
		let newOrder = parseInt(detail.newOrder);

		if ($songsOrder.length < newOrder) {
			$songsOrder = $songsOrder;
			return;
		}

		let songToChangeOrder = $songsOrder.find(
			(/** @type {{ title: any; }} */ song) => song.title === detail.title
		);

		$songsOrder = $songsOrder.map((/** @type {{ order: number; title: string }} */ song) => {
			if (song.title === songToChangeOrder.title) {
				return { ...song, order: newOrder };
			} else if (song.order === newOrder) {
				return { ...song, order: songToChangeOrder.order };
			} else {
				return song;
			}
		});

		// @ts-ignore
		$songsOrder = $songsOrder.sort((a, b) => a.order - b.order);

		await fetch(`${env.PUBLIC_SERVER}/day_song_order/${data.dayId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify($songsOrder)
		});
	}

	async function deleteDaySong() {
		await fetch(`${env.PUBLIC_SERVER}/day_songs/${data.dayId}`, {
			method: 'DELETE'
		});
		goto('/');
	}
</script>

<div class="pt-3">
	<div class="rounded-xl border border-gray-100 p-4 shadow-md sm:p-6 lg:p-8">
		<div class="text-gray-500">
			<h3 class="text-lg font-bold text-gray-900 sm:text-xl pb-3">{$day}</h3>

			{#each $songsOrder as song (song.order)}
				<OrderInput
					title={song.title}
					chord={song.dayChord}
					order={song.order}
					on:orderList={reorder}
				/>
			{/each}
		</div>
	</div>
</div>

{#if $songsOrder.length > 0}
	<div class="flex flex-row-reverse pt-2">
		<button
			on:click={deleteDaySong}
			class="inline-block rounded-full border border-red-600 bg-red-600 p-3 text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-trash"
				viewBox="0 0 16 16"
			>
				<path
					d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
				/>
				<path
					fill-rule="evenodd"
					d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
				/>
			</svg>
		</button>
	</div>
{/if}
