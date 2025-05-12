<script>
	import { onMount } from 'svelte';
	let { imageData = [], width = 120, height = 120 } = $props();

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;

	/**
	 * @type {CanvasRenderingContext2D | null}
	 */
	let ctx;

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
	$effect(() => {
		if (ctx && imageData.length > 0) {
			const foo = new Uint8ClampedArray(imageData);
			const newImageData = new ImageData(foo, width, height);
			ctx.putImageData(newImageData, 0, 0);
		}
	});
</script>

<canvas bind:this={canvas} {width} {height} class="outputCanvas" id="outputCanvas">
	this will be the image.
</canvas>

<style>
	.outputCanvas {
		border: 1px solid black;
		max-width: 100%;
		max-height: 80vh;
	}
</style>
