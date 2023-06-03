<script>
	// @ts-nocheck

	import { songTitle, selectedChord } from '$lib/songsStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let order = 1;
	export let title = '';
	export let chord = '';

	/**
	 * @type {HTMLInputElement}
	 */
	let orderInput;

	$: width = order ? order.toString().length ?? 1 : 1;

	function refactorOrder() {
		if (!/^\d+$/.test(order)) {
			order = order.replace(/\D/g, '');
		}

		dispatch('orderList', {
			newOrder: order,
			title
		});
	}

	function focusOrderInput() {
		songTitle.set(title);
		selectedChord.set('');
	}
</script>

<div class="text-md">
	{#if title}
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#" on:click={focusOrderInput}>
			<input
				type="text"
				bind:value={order}
				bind:this={orderInput}
				on:blur={refactorOrder}
				size={width}
				maxlength="4"
				pattern="[0-9]*"
				inputmode="numeric"
				class="border-transparent focus:border-transparent focus:ring-0"
			/>
			{title} - {chord}
		</a>
	{:else}
		Write the song
	{/if}
</div>
