<script lang="ts">
	import { enhance } from '$app/forms';
	import TransparentInput from '../../components/TransparentInput.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Chord, Song } from '$lib/types';
	import { searchedChordValue, searchedSongTitle } from '$lib/songsStore';

	let groupTitle = '';
	let songsOrders = [];
	let groupId = 0;
	let queryChords: Chord[];
	let querySongs: Song[];
	let formElement: HTMLFormElement;
	let addSongLoading = false;

	$: {
		if ($searchedSongTitle) {
			fetch(`/api/songs?query=${$searchedSongTitle}`)
				.then((response) => response.json())
				.then((data) => {
					querySongs = data;
				});
		}
	}

	page.subscribe((pageData) => {
		const songGroup = pageData.data.songGroup;
		const songsOrder = pageData.data.songsOrders;
		if (songGroup) {
			groupTitle = songGroup.title;
			groupId = songGroup.id;
		}

		if (songsOrder) {
			songsOrders = songsOrder;
		}
	});

	async function deleteSongGroup() {
		await fetch(`/api/song-groups/${groupId}`, {
			method: 'DELETE'
		});

		await goto('/', { invalidateAll: true });
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

	function addOrUpdateSongSucess() {
		searchedChordValue.set('');
		searchedSongTitle.set('');
		queryChords = [];
		addSongLoading = false;
	}
</script>

<div>
	<form
		class="flex flex-row gap-1"
		method="POST"
		action="/groups/{groupId}?/addSong"
		use:enhance={() => {
			addSongLoading = true;

			return async ({ result, update }) => {
				await update();

				if (result.status === 200) {
					addOrUpdateSongSucess();
				}
			};
		}}
		bind:this={formElement}
	>
		<div class="basis-[70%]">
			<input
				bind:value={$searchedSongTitle}
				on:keydown={onSearch}
				list="Songs"
				name="songTitle"
				type="text"
				id="SongSearch"
				placeholder="Search a song"
				class="h-full w-full rounded-md border-gray-200 dark:border-gray-600 shadow-sm sm:text-sm dark:bg-black dark:text-white"
			/>
		</div>
		<div class="basis-[30%]">
			<input
				bind:value={$searchedChordValue}
				on:focus={searchChords}
				on:keydown={onSearch}
				name="chordValue"
				list="Chords"
				type="text"
				class="h-full w-full rounded-md border-gray-200 dark:border-gray-600 shadow-sm sm:text-sm dark:bg-black dark:text-white"
			/>
		</div>
		<div class="basis-[10%]">
			<button
				class="rounded-md bg-green-600 p-3 text-white hover:bg-green-700"
				disabled={addSongLoading}
			>
				{#if addSongLoading}
					<div role="status">
						<svg
							aria-hidden="true"
							class="w-6 h-6 animate-spin dark:text-gray-300 fill-white"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Loading...</span>
					</div>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
						/>
					</svg>
				{/if}
			</button>
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

	<div class="pt-3">
		<div class="rounded-lg border border-gray-100 dark:border-gray-600 p-4 shadow-md sm:p-6 lg:p-8">
			<div class="text-gray-500">
				<h3 class="font-bold pb-3">
					<form
						method="POST"
						action={groupId ? `/groups/${groupId}?/updateGroupTitle` : '/groups'}
						use:enhance={() => {
							return async ({ result, update }) => {
								if (!groupId && result && result.type === 'success') {
									goto(`/groups/${result.data}`);
									return;
								}

								update({ reset: false });
							};
						}}
					>
						<TransparentInput value={groupTitle} maxlength={20} inputmode="text" />
					</form>
				</h3>
				<slot />
			</div>
		</div>
	</div>

	{#if songsOrders.length > 0}
		<div class="flex flex-row-reverse pt-2">
			<button
				on:click={deleteSongGroup}
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
</div>
