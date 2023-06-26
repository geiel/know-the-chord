<script lang="ts">
	import '../app.css';
	import { searchedSongTitle, searchedChordValue } from '$lib/songsStore';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let editMode = false;
	let selectedGroupId = 0;

	$: {
		if ($page.route.id === '/groups/[group_id]' || $page.route.id === '/groups') {
			editMode = true;
		} else {
			editMode = false;
		}

		if ($page.params.group_id) {
			selectedGroupId = parseInt($page.params.group_id);
			console.log(selectedGroupId);
		} else {
			selectedGroupId = 0;
		}
	}

	searchedChordValue.set('');
	searchedSongTitle.set('');
</script>

<main class="dark:bg-black min-h-screen">
	<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Know The Chord</h1>
	<div class="md:flex md:flex-row px-4 pt-10 gap-2 pb-3">
		<div class="flex flex-col gap-2 basis-1/3 md:overflow-auto md:c-screen" class:hide={editMode}>
			<div>
				<a
					class="inline-block w-full text-center rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
					href="/groups"
				>
					Add list
				</a>
			</div>
			{#each data.songGroups as songGroup (songGroup.id)}
				<a
					class="relative flex items-start justify-between rounded-lg border p-4 shadow-md sm:p-6 lg:p-8 dark:bg-black"
					class:dark:border-gray-100={songGroup.id === selectedGroupId}
					class:dark:border-gray-600={songGroup.id !== selectedGroupId}
					class:bg-gray-200={songGroup.id === selectedGroupId}
					class:bg-gray-100={songGroup.id !== selectedGroupId}
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
