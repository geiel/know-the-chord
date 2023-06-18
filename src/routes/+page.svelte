<script lang="ts">
	import { editMode, searchedSongTitle, searchedChordValue } from '$lib/songsStore';
	import { onMount } from 'svelte';

	editMode.set(false);
	searchedChordValue.set('');
	searchedSongTitle.set('');

	let songGroups = [] as SQLSongGroup[];

	const fetchSongGroups = async () => {
		const response = await fetch('/api/song-groups');
		const jsonReponse = await response.json();
		songGroups = jsonReponse.rows;
	};

	onMount(() => {
		fetchSongGroups();
	});
</script>

<a
	class="fixed z-50 bottom-10 right-8 rounded-full border border-indigo-600 bg-indigo-600 p-4 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
	href="/groups"
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
	{#each songGroups as songGroup}
		<a
			class="relative flex items-start justify-between rounded-xl border border-gray-100 p-4 shadow-md sm:p-6 lg:p-8"
			href={`/groups/${songGroup.id}`}
		>
			<div class="text-gray-500">
				<h3 class="text-lg font-bold text-gray-900 sm:text-xl">{songGroup.sgTitle}</h3>

				<p class="text-sm sm:block">
					{songGroup.songTitle} - {songGroup.chordValue}
				</p>
			</div>
		</a>
	{/each}
</div>
