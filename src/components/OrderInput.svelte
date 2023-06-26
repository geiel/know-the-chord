<script lang="ts">
	import { searchedSongTitle, searchedChordValue } from '$lib/songsStore';
	import { createEventDispatcher } from 'svelte';
	import TransparentInput from './TransparentInput.svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher<{ changePosition: { newPosition: number } }>();

	export let position: string;
	export let songTitle: string;
	export let chord: string;

	function dispatchReorderSongs(event: CustomEvent<{ value: string }>) {
		if (event.detail.value !== position) {
			dispatch('changePosition', {
				newPosition: Number(event.detail.value)
			});
		}
	}

	function focusOrderInput() {
		searchedSongTitle.set(songTitle);
		searchedChordValue.set('');
	}
</script>

<div class="text-md dark:text-white">
	{#if songTitle}
		<button on:click={focusOrderInput} type="button">
			<TransparentInput
				value={position}
				maxlength={4}
				pattern="[0-9]*"
				inputmode="numeric"
				on:focus={dispatchReorderSongs}
				on:enter={dispatchReorderSongs}
			/>
			{songTitle} - {chord}
		</button>
	{:else}
		Write the song
	{/if}
</div>
