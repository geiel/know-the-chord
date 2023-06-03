<script>
	import '../app.css';
	import SearchBar from '../components/SearchBar.svelte';
</script>

<main class="container mx-auto px-4 pt-10">
	<SearchBar />
	<slot />
</main>
