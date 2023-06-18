<script lang="ts">
	import '../app.css';

	import { enhance } from '$app/forms';
	import { editMode, searchedSongTitle, searchedChordValue } from '../lib/songsStore';
	import { page } from '$app/stores';
	import type { Chord, Song } from '$lib/types';
	import type { ActionData } from './groups/[group_id]/$types';

	export let form: ActionData;

	let queryChords: Chord[];
	let querySongs: Song[];
	let formElement: HTMLFormElement;
	let selectedSongGroup = 0;

	page.subscribe((pageData) => {
		if (pageData.data.songGroup) {
			selectedSongGroup = pageData.data.songGroup.id;
		}
	});

	$: {
		if (form?.addSongSucess) {
			searchedChordValue.set('');
			searchedSongTitle.set('');
			queryChords = [];
		}
	}

	$: {
		if ($searchedSongTitle) {
			fetch(`/api/songs?query=${$searchedSongTitle}`)
				.then((response) => response.json())
				.then((data) => {
					querySongs = data;
				});
		}
	}

	function onSearch(event: KeyboardEvent): void {
		if (event.key !== 'Enter') {
			return;
		}

		formElement.requestSubmit();
	}

	async function searchChords(): Promise<void> {
		const song = querySongs.find((song) => song.title === $searchedSongTitle);
		if (song) {
			const response = await fetch(`/api/chords/?songId=${song.id}`);
			queryChords = await response.json();
		}
	}
</script>

<main class="container mx-auto px-4 pt-10">
	<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Search</h1>
	<form
		class="flex flex-row gap-2"
		method="POST"
		action="/groups/{selectedSongGroup}?/addSong"
		use:enhance
		bind:this={formElement}
	>
		<div class="basis-4/5">
			<div class="relative">
				<input
					bind:value={$searchedSongTitle}
					on:keydown={onSearch}
					list="Songs"
					name="songTitle"
					type="text"
					id="SongSearch"
					placeholder="Search a song"
					class="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
				/>

				{#if $editMode}
					<span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
						<button class="rounded-full bg-green-600 p-0.5 text-white hover:bg-green-700">
							<span class="sr-only" />
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="h-4 w-4"
							>
								<path
									d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
								/>
							</svg>
						</button>
					</span>
				{/if}
			</div>
		</div>
		<div class="basis-2/6 lg:basis-1/5">
			<input
				bind:value={$searchedChordValue}
				on:focus={searchChords}
				on:keydown={onSearch}
				name="chordValue"
				list="Chords"
				type="text"
				class="h-full w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
			/>
		</div>

		{#if queryChords}
			<datalist id="Chords">
				{#each queryChords as chord}
					<option value={chord.value}>{chord.type}</option>
				{/each}
			</datalist>
		{/if}

		{#if querySongs}
			<datalist id="Songs">
				{#each querySongs as song}
					<option value={song.title} />
				{/each}
			</datalist>
		{/if}
	</form>

	<slot />
</main>
