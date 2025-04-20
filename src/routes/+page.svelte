<script>
	import { onMount } from 'svelte';
	import '../app.scss';
	import logo from '$lib/assets/IMG_0608small.jpeg';
	import Histogram from '$lib/Histogram.svelte';
	import ProcessedImage from '$lib/ProcessedImage.svelte';

	let { _greyscaleImageData = [] } = $props();

	const thirdcolors = [
		[255, 204, 204],
		[100, 230, 20],
		[20, 70, 180],
		[180, 201, 90],
		[50, 150, 250],
		[90, 180, 20],
		[204, 180, 20]
	];

	/**
	 * @type {HTMLInputElement}
	 */
	let fileInput;

	let canvasWidth = $state(0);
	let canvasHeight = $state(0);

	let blackpoint = $state(78);
	let whitepoint = $state(110);
	let colorChoice = $state(0);
	let hexColor = $derived(rgbToHex(thirdcolors[colorChoice]));
	let greyscaleImagedata = $state.raw(_greyscaleImageData);
	let waitingForGreyscale = $derived(greyscaleImagedata.length === 0);
	let reducedColorImagedata = $state.raw([]);

	$effect(() => {
		if (waitingForGreyscale) {
			return;
		}
		console.time('reducedColorImagedata');

		reducedColorImagedata = makeFewColors(
			Uint8ClampedArray.from(greyscaleImagedata),
			blackpoint,
			whitepoint,
			thirdcolors[colorChoice]
		);
		console.timeEnd('reducedColorImagedata');
	});

	function changeColor() {
		colorChoice = colorChoice + 1 >= thirdcolors.length ? 0 : colorChoice + 1;
	}

	function rgbToHex(rgb) {
		return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
	}

	export function makeGreyscale(data) {
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

	onMount(() => {
		const image = new Image();
		image.src = logo;

		image.onload = function () {
			const grayscaleCanvas = document.createElement('canvas');

			console.time('image load event');
			canvasWidth = image.width < 900 ? image.width : 900;
			canvasHeight = image.height * (canvasWidth / image.width);
			grayscaleCanvas.height = canvasHeight;
			grayscaleCanvas.width = canvasWidth;

			const foo = grayscaleCanvas.getContext('2d');

			foo.drawImage(image, 0, 0, canvasWidth, canvasHeight);
			const imageData = foo.getImageData(0, 0, canvasWidth, canvasHeight);
			console.timeEnd('image load event');

			console.time('create grey scale');
			greyscaleImagedata = makeGreyscale(Uint8ClampedArray.from(imageData.data));
			console.timeEnd('create grey scale');


			console.time('reducedColorImagedata');

			reducedColorImagedata = makeFewColors(
				Uint8ClampedArray.from(greyscaleImagedata),
				blackpoint,
				whitepoint,
				thirdcolors[colorChoice]
			);
			console.timeEnd('reducedColorImagedata');
		};

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

<main>
	<h1>Toner</h1>

	<input bind:this={fileInput} type="file" accept="image/*" capture="user" id="input" />
	<div style="display: flex">
		<section>
			<ProcessedImage imageData={reducedColorImagedata} width={canvasWidth} height={canvasHeight} />
		</section>
		<section style="display: flex">
			<Histogram greyscaleImageData={greyscaleImagedata} {blackpoint} {whitepoint} {hexColor} />

			<div style="display: flex">
				<label for="blackpoint"
					><div style="padding: 2px;height:2em; width:2.5em; background-color:black; color:white ">
						{blackpoint}
					</div>
					<input
						class="sliders"
						bind:value={blackpoint}
						type="range"
						min="0"
						max={whitepoint}
						step="1"
					/></label
				>
				<label for="whitepoint"
					><div
						style="padding: 2px;height:2em; width:2.5em; background-color:{hexColor}; color:white "
						on:click={changeColor}
					>
						{whitepoint}
					</div>
					<input
						class="sliders"
						bind:value={whitepoint}
						type="range"
						min={blackpoint}
						max="256"
						step="1"
					/></label
				>
			</div>
		</section>
	</div>
</main>

<style>
	label {
		width: 3em;
	}
	.sliders {
		writing-mode: vertical-rl;
		width: initial;
		height: 206px;
	}
</style>
