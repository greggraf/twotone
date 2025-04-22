<script>
	import { onMount } from 'svelte';
	import logo from '$lib/assets/radish2.jpg';

    let { imageLoaded } = $props();

	/**
	 * @type {HTMLInputElement}
	 */
	let fileInput;

	onMount(() => {
		const image = new Image();
		image.onload = () => imageLoaded(image);

		image.src = logo;


		fileInput.addEventListener('change', function () {
			var reader = new FileReader();

			reader.addEventListener('loadend', function (arg) {
				image.src = this.result;
				imageLoaded(image);
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
