<script>
	import OrderInput from '../../../components/OrderInput.svelte';
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { editMode, songsOrder, selectedDayId, day } from '$lib/songsStore';

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
