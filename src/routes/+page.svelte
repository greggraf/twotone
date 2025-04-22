<script>
	import '../app.scss';
	import Histogram from '$lib/Histogram.svelte';
	import ProcessedImage from '$lib/ProcessedImage.svelte';
	import ImageUpload from '$lib/ImageUpload.svelte';
	import ColorSlider from '$lib/ColorSlider.svelte';

	const thirdcolors = [
		[255, 204, 204],
		[100, 230, 20],
		[20, 70, 180],
		[180, 201, 90],
		[50, 150, 250],
		[90, 180, 20],
		[204, 180, 20]
	];

	let canvasWidth = $state(120);
	let canvasHeight = $state(120);
	let blackpoint = $state(78);
	let whitepoint = $state(110);
	let colorChoice = $state(0);

	let hexColor = $derived(rgbToHex(thirdcolors[colorChoice]));

	let greyscaleImagedata = $state.raw([]);

	let reducedColorImagedata = $derived.by(() => {
		console.time('reducedColorImagedata');

		const _reducedColorImagedata = makeFewColors(
			Uint8ClampedArray.from(greyscaleImagedata),
			blackpoint,
			whitepoint,
			thirdcolors[colorChoice]
		);
		console.timeEnd('reducedColorImagedata');
		return _reducedColorImagedata;
	});

	function changeColor() {
		colorChoice = colorChoice + 1 >= thirdcolors.length ? 0 : colorChoice + 1;
	}

	function rgbToHex(rgb) {
		return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
	}

	export function transformToGreyscale(data) {
		for (let i = 0; i < data.length; i += 4) {
			const grayscale = 0.21 * data[i] + 0.72 * data[i + 1] + 0.07 * data[i + 2];
			data[i] = grayscale;
			data[i + 1] = grayscale;
			data[i + 2] = grayscale;
		}
		return data;
	}

	export function makeFewColors(data, black = 62, white = 170, thirdcolor = [204, 190, 255]) {
		for (let i = 0; i < data.length; i += 4) {
			if (data[i] > white) {
				data[i] = 255;
				data[i + 1] = 255;
				data[i + 2] = 255;
			} else if (data[i] > black && data[i] < white) {
				data[i] = thirdcolor[0];
				data[i + 1] = thirdcolor[1];
				data[i + 2] = thirdcolor[2];
			} else {
				data[i] = 0;
				data[i + 1] = 0;
				data[i + 2] = 0;
			}
		}

		return data;
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
				<ColorSlider bind:value={blackpoint} min={0} max={whitepoint} color="black" />
				<ColorSlider
					bind:value={whitepoint}
					min={blackpoint}
					max={256}
					color={hexColor}
					on:click={changeColor}
				/>
			</div>
			<Histogram greyscaleImageData={greyscaleImagedata} {blackpoint} {whitepoint} {hexColor} />
		</section>
	</div>
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;

		@media (min-width: 600px) {
			flex-direction: row;
		}
	}
	.controls {
		display: flex;
		flex-direction: row;
		border: 1px red solid;
		margin: 0 0.5em;
		padding: 0.5em;
	}
</style>
