<script lang="ts">
	import '../app.css';

	import { searchedSongTitle, searchedChordValue } from '$lib/songsStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let editMode = false;

	$: {
		if ($page.route.id === '/groups/[group_id]' || $page.route.id === '/groups') {
			editMode = true;
		} else {
			editMode = false;
		}
	}
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

<main class="dark:bg-black min-h-screen">
	<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Know The Chord</h1>
	<div class="md:flex md:flex-row px-4 pt-10 gap-2">
		<div class="flex flex-col gap-2 basis-1/3 md:overflow-auto md:c-screen" class:hide={editMode}>
			{#each songGroups as songGroup}
				<a
					class="relative flex items-start justify-between rounded-lg border border-gray-100 dark:border-gray-600 p-4 shadow-md sm:p-6 lg:p-8"
					href={`/groups/${songGroup.id}`}
				>
					<div class="text-gray-500">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
							{songGroup.sgTitle}
						</h3>

						<p class="text-sm sm:block">
							{songGroup.songTitle} - {songGroup.chordValue}
						</p>
					</div>
				</a>
			{/each}
		</div>
		<div class="basis-4/5">
			<slot />
		</div>
	</div>
</main>

<style>
	.hide {
		display: none;
	}

	@media (min-width: 640px) {
		.hide {
			display: flex;
		}
	}
</style>
