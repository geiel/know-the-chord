<script>
	import {
		editMode,
		songTitle,
		songsOrder,
		selectedDayId,
		day,
		selectedChord
	} from '../lib/songsStore';
	import { env } from '$env/dynamic/public';
	/**
	 * @type {any[]}
	 */
	let chords = [];
	/**
	 * @type {any[]}
	 */
	let songs = [];

	$: {
		if ($songTitle) {
			fetch(`${env.PUBLIC_SERVER}/autocomplete?song=${$songTitle}`)
				.then((response) => response.json())
				.then((data) => {
					songs = [...data];
				});
		}
	}

	$: chordMain = {
		value: $selectedChord,
		type: 'main'
	};

	/**
	 * @param {KeyboardEvent} event
	 */
	function onSearch(event) {
		if (event.key !== 'Enter') {
			return;
		}
	}

	function searchChords() {
		const song = songs.find((song) => song.title === $songTitle);
		if (song) {
			selectedChord.set(song.chords[0].value);
			chords = song.chords;
		}
	}

	async function addDaySong() {
		const chordRepeated = chords.find((chord) => chord.value === chordMain.value);
		if (!chordRepeated) {
			chords.unshift(chordMain);
		}

		await fetch(`${env.PUBLIC_SERVER}/songs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: $songTitle,
				chords
			})
		});

		if (!$songsOrder.find((songOrder) => songOrder.title === $songTitle)) {
			$songsOrder = [
				...$songsOrder,
				{
					title: $songTitle,
					order: $songsOrder.length + 1,
					dayChord: $selectedChord,
					chords
				}
			];
		} else {
			$songsOrder = $songsOrder.map((songOrder) =>
				songOrder.title === $songTitle ? { ...songOrder, dayChord: $selectedChord } : songOrder
			);
		}

		await fetch(`${env.PUBLIC_SERVER}/day_songs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				_id: $selectedDayId,
				day: $day,
				songsOrder: $songsOrder
			})
		});

		songTitle.set('');
		selectedChord.set('');
	}
</script>

<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Search</h1>
<div class="flex flex-row gap-2">
	<div class="basis-4/5">
		<div class="relative">
			<input
				bind:value={$songTitle}
				on:keydown={onSearch}
				list="Songs"
				type="text"
				id="SongSearch"
				placeholder="Search a song"
				class="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
			/>

			{#if $editMode}
				<span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
					<button
						on:click={addDaySong}
						type="button"
						class="rounded-full bg-green-600 p-0.5 text-white hover:bg-green-700"
					>
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
			bind:value={$selectedChord}
			on:focus={searchChords}
			on:keydown={onSearch}
			list="Chords"
			type="text"
			class="h-full w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
		/>
	</div>

	<datalist id="Chords">
		{#each chords as chord}
			<option value={chord.value}>{chord.type}</option>
		{/each}
	</datalist>

	<datalist id="Songs">
		{#each songs as song}
			<option value={song.title} />
		{/each}
	</datalist>
</div>
