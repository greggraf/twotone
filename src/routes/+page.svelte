<script>
	import { onMount } from 'svelte';
	import '../app.scss';
	import logo from '$lib/assets/crw_7086c_std.jpg';

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

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;

	/**
	 * @type {CanvasRenderingContext2D}
	 */
	let ctx;

	let canvasWidth = $state(0);
	let canvasHeight = $state(0);

	let histogram = $state(new Array(256).fill(0));
	let newhistogram = $derived(scaleValues(histogram));
	let fill = $state('black');
	let blackpoint = $state(78);
	let whitepoint = $state(110);
	let colorChoice = $state(0);
	let hexColor = $derived(rgbToHex(thirdcolors[colorChoice]));
	let greyscaleImagedata = $state([]);
	let waitingForGreyscale = $derived(greyscaleImagedata.length === 0);

	$effect(() => {
		if (waitingForGreyscale) {
			return;
		}

		console.time('reducedColorImagedata');

		const reducedColorImagedata = makeFewColors(
			Uint8ClampedArray.from(greyscaleImagedata),
			blackpoint,
			whitepoint,
			thirdcolors[colorChoice]
		);
		console.timeEnd('reducedColorImagedata');

		console.time('extract new datat');

		const newImageData = new ImageData(
			new Uint8ClampedArray(reducedColorImagedata),
			canvasWidth,
			canvasHeight
		);

		console.timeEnd('extract new datat');

		console.time('put image on canvas');
		ctx.putImageData(newImageData, 0, 0);
		console.timeEnd('put image on canvas');
	});

	function changeColor() {
		colorChoice = colorChoice + 1 >= thirdcolors.length ? 0 : colorChoice + 1;
	}

	function rgbToHex(rgb) {
		return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
	}

	function scaleValue(value, max) {
		return Math.floor((value / max) * 255);
	}

	function scaleValues(numbers) {
		const max = Math.max(...numbers);
		return numbers.map((value) => scaleValue(value, max));
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
			console.time('image load event');
			canvasWidth = image.width < 900 ? image.width : 900;
			canvasHeight = image.height * (canvasWidth / image.width);
			console.log('canvasWidth', canvasWidth);
			ctx = canvas.getContext('2d');
			canvas.height = canvasHeight;
			canvas.width = canvasWidth;
			ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
			const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
			console.timeEnd('image load event');
			console.time('create grey scale');

			greyscaleImagedata = makeGreyscale(Uint8ClampedArray.from(imageData.data));
			console.timeEnd('create grey scale');
			for (let i = 0; i < greyscaleImagedata.length; i += 4) {
				const grayscale = greyscaleImagedata[i];
				histogram[grayscale]++;
			}
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
			<canvas
				bind:this={canvas}
				width="120"
				height="120"
				style="border: 1px solid black; max-width: 800px; width: 100%"
				id="outputCanvas"
			>
				this will be the image.
			</canvas>
		</section>
		<section style="display: flex">
			{#if !waitingForGreyscale}
				<svg
					width="256"
					height="256"
					style="border: 1px solid black; box-sizing: content-box; margin: 1em; background-color: #eee"
				>
					<g style="isolatation: isolate">
						<g {fill}>
							{#each newhistogram as bar, i}
								{console.log(bar)}
								<rect x={i * 1} y={256} width="1" height={1} />
							{/each}
						</g>
						<g fill="black">
							<rect
								x="0"
								y="0"
								width={blackpoint}
								height="256"
								fill="black"
								style="mix-blend-mode: multiply; opacity: .5"
							/>
						</g>
						<g fill={hexColor}>
							<rect
								x={blackpoint}
								y="0"
								width={whitepoint - blackpoint}
								height="256"
								style="mix-blend-mode: multiply; opacity: .5"
							/>
						</g>
						<g fill="#fff">
							<rect
								x={whitepoint}
								y="0"
								width={256 - whitepoint}
								height="256"
								style="mix-blend-mode: multiply; opacity: .5"
							/>
						</g>
					</g>
				</svg>
			{/if}
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
