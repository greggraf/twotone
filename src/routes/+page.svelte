<script>
	import '../app.scss';
	import Histogram from '$lib/Histogram.svelte';
	import ProcessedImage from '$lib/ProcessedImage.svelte';
	import ImageUpload from '$lib/ImageUpload.svelte';
	import ColorSlider from '$lib/ColorSlider.svelte';
	import { transformToGreyscale, makeThreeColors, applyMedianFilter } from '$lib/filters';

	const thirdcolors = [
		[161, 119, 193],
		[255, 204, 204],
		[100, 230, 20],
		[20, 70, 180],
		[180, 201, 90],
		[50, 150, 250],
		[90, 180, 20],
		[204, 180, 20],
		[240, 179, 105],
		[14, 122, 255],
		[255, 204, 0],
		[128, 0, 128],
		[255, 105, 180],
		[0, 128, 0],
		[220, 245, 245],
		[165, 42, 42],
		[255, 215, 0],
		[102, 205, 170],
		[128, 128, 128],
		[240, 230, 140],
		[0, 0, 255],
		[255, 165, 0],
		[105, 105, 105],
		[205, 92, 92],
		[150, 255, 150],
		[255, 192, 203],
		[60, 179, 113],
		[220, 190, 255]
	];

	let canvasWidth = $state(120);
	let canvasHeight = $state(120);

	let colorIndices = $state([0, 1]);
	let colorRanges = $state([78, 110, 180]);

	let hexColors = $derived(colorIndices.map((pos) => rgbToHex(thirdcolors[pos])));

	let greyscaleImagedata = $state.raw([]);

	let reducedColorImagedata = $derived.by(() => {
		console.time('reducedColorImagedata');

		const _reducedColorImagedata = makeThreeColors(
			Uint8ClampedArray.from(greyscaleImagedata),
			thirdcolors,
			colorIndices,
			colorRanges
		);

		console.timeEnd('reducedColorImagedata');
		return _reducedColorImagedata;
	});

	function changeColor(index = 0) {
		if (index > 0) {
			const correctedIndex = index - 1;
			return () => {
				colorIndices[correctedIndex] =
					colorIndices[correctedIndex] + 1 >= thirdcolors.length
						? 0
						: colorIndices[correctedIndex] + 1;
			};
		}
		return null;
	}

	/**
	 * @param {{ toString: (arg0: number) => string; }[]} rgb
	 */
	function rgbToHex(rgb) {
		return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
	}

	/**
	 * @param {CanvasImageSource} image
	 * @param {number} width
	 * @param {number} height
	 */
	function getGreyscale(image, width, height) {
		const grayscaleCanvas = document.createElement('canvas');
		grayscaleCanvas.width = width;
		grayscaleCanvas.height = height;
		const context = grayscaleCanvas.getContext('2d');
		if (context) {
			context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
			const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
			//const hmm = applyMedianFilter(imageData, 2);
			return transformToGreyscale(imageData.data);
		}
	}

	/**
	 * @param {HTMLImageElement} image
	 */
	function handleImageLoad(image) {
		canvasWidth = image.width < 900 ? image.width : 900;
		canvasHeight = image.height * (canvasWidth / image.width);
		greyscaleImagedata = getGreyscale(image, canvasWidth, canvasHeight);
	}
</script>

<main>
	<h1>Toner</h1>
	<ImageUpload imageLoaded={handleImageLoad} />
	<div class="container">
		<section>
			<ProcessedImage imageData={reducedColorImagedata} width={canvasWidth} height={canvasHeight} />
		</section>
		<section class="controls">
			<div>
				{#each colorRanges as color, index}
					<ColorSlider
						bind:value={colorRanges[index]}
						min={index === 0 ? 0 : colorRanges[index - 1]}
						max={index === colorRanges.length - 1 ? 256 : colorRanges[index + 1]}
						color={index === 0 ? 'black' : hexColors[index - 1]}
						onclick={changeColor(index)}
					/>
				{/each}
			</div>
			<Histogram greyscaleImageData={greyscaleImagedata} {colorRanges} {hexColors} />
		</section>
	</div>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;

		@media (min-width: 768px) {
			flex-direction: row;
		}
	}
	.controls {
		display: flex;
		flex-direction: row;
		border: 1px red solid;
		margin: 0 0.5em;
		padding: 0.5em;
		flex-direction: column;
	}
	main {
		min-width: 375px;
	}
</style>
