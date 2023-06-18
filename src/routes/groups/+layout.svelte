<script lang="ts">
	import { enhance } from '$app/forms';
	import TransparentInput from '../../components/TransparentInput.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let groupTitle = new Date().toLocaleString('default', { weekday: 'long' });
	let songsOrders = [];
	let groupId = 0;

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

		goto('/');
	}
</script>

<div class="pt-3">
	<div class="rounded-xl border border-gray-100 p-4 shadow-md sm:p-6 lg:p-8">
		<div class="text-gray-500">
			<h3 class="text-2xl font-bold text-gray-900 sm:text-xl pb-3">
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
