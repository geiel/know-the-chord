<script>
	import { editMode, songTitle, selectedChord } from '$lib/songsStore';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	let page = 1;
	/**
	 * @type {any[]}
	 */
	let daySongs = [];
	/**
	 * @type {never[]}
	 */
	let newDaySongs = [];

	$: daySongs = [...daySongs, ...newDaySongs];

	onMount(() => {
		fetchDaySongs();
		editMode.set(false);
		songTitle.set('');
		selectedChord.set('');
	});

	async function fetchDaySongs() {
		const response = await fetch(`${env.PUBLIC_SERVER}/day_songs?page_numer=${page}`);
		newDaySongs = await response.json();
	}
</script>

<a
	class="fixed z-50 bottom-10 right-8 rounded-full border border-indigo-600 bg-indigo-600 p-4 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
	href="/songs/new"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="30"
		height="30"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path
			d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
		/>
	</svg>
</a>

<div class="flex flex-col gap-2 pt-3">
	{#each daySongs as daySong}
		<a
			class="relative flex items-start justify-between rounded-xl border border-gray-100 p-4 shadow-md sm:p-6 lg:p-8"
			href={`/songs/${daySong._id}`}
		>
			<div class="text-gray-500">
				<h3 class="text-lg font-bold text-gray-900 sm:text-xl">{daySong.day}</h3>

				<p class="text-sm sm:block">
					{daySong.songsOrder[0].title} - {daySong.songsOrder[0].dayChord}
				</p>
			</div>
		</a>
	{/each}
</div>
