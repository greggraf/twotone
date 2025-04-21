<script>
	import { onMount } from 'svelte';
	import logo from '$lib/assets/IMG_0608small.jpeg';

	let { source = $bindable(),  } = $props();

	/**
	 * @type {HTMLInputElement}
	 */
	let fileInput;

	onMount(() => {
		const image = new Image();
		image.src = logo;

		fileInput.addEventListener('change', function () {
			var reader = new FileReader();

			reader.addEventListener('loadend', function (arg) {
				image.src = this.result;
			});
			console.time('reading');
			reader.readAsDataURL(this.files[0]);
			console.timeEnd('reading');
		});
	});
</script>

<input bind:this={fileInput} type="file" accept="image/*" capture="user" id="input" />

<style>
</style>
