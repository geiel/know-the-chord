<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let value: string;
	export let maxlength: number;
	export let pattern = '(.*?)';
	export let inputmode: 'numeric' | 'text';

	$: correctValue = value;
	$: width = correctValue ? correctValue.length ?? 1 : 1;

	$: {
		if (inputmode === 'numeric') {
			if (!/^\d+$/.test(correctValue)) {
				correctValue = correctValue.replace(/\D/g, '');
			}
		}
	}

	const dispatch = createEventDispatcher<{ focus: { value: string }; enter: { value: string } }>();

	function validateEmptyValue(event: KeyboardEvent | FocusEvent) {
		if (event instanceof KeyboardEvent) {
			if (event.key !== 'Enter') {
				return;
			}
		}

		if (!correctValue) {
			correctValue = value;
			return;
		}

		if (event instanceof KeyboardEvent) {
			dispatch('enter', { value: correctValue });
			return;
		}

		dispatch('focus', { value: correctValue });
	}
</script>

<input
	on:blur={validateEmptyValue}
	on:keydown={validateEmptyValue}
	bind:value={correctValue}
	type="text"
	size={width}
	{maxlength}
	{pattern}
	{inputmode}
	name="transparent-input"
	class="border-transparent focus:border-transparent focus:ring-0"
/>
