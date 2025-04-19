<script>

	let { greyscaleImageData = [], blackpoint, whitepoint, hexColor} = $props();
	
	let histogram = new Array(256).fill(0);
	let newhistogram = $derived(scaleValues(histogram));
	

	function scaleValue(value, max) {
		return Math.floor((value / max) * 255);
	}

	function scaleValues(numbers) {
		const max = Math.max(...numbers);
		return numbers.map((value) => scaleValue(value, max));
	}

	for (let i = 0; i < greyscaleImageData.length; i += 4) {
		const grayscale = greyscaleImageData[i];
		histogram[grayscale]++;
	}

console.log('histogram', histogram.length);

</script>

{#if greyscaleImageData.length > 0 }
	<svg
		width="256"
		height="256"
		style="border: 1px solid black; box-sizing: content-box; margin: 1em; background-color: #eee"
	>
		<g style="isolatation: isolate">
			<g fill="black">
				{#each newhistogram as bar, i}
					<rect x={i * 1} y={256 - bar} width="1" height={bar} />
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

<style>
	label {
		width: 3em;
	}

</style>
