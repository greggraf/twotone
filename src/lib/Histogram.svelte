<script>
	function scaleValue(value, max = 255) {
		return Math.floor((value / max) * 255);
	}

	function scaleValues(numbers = []) {
		const max = Math.max(...numbers);
		return numbers.map((value) => scaleValue(value, max));
	}

	let { greyscaleImageData = [], blackpoint, whitepoint, hexColor } = $props();

	let histogram = $derived.by(() => {
        const histogram = new Array(256).fill(0);
		for (let i = 0; i < greyscaleImageData.length; i += 4) {
			const grayscale = greyscaleImageData[i];
			histogram[grayscale]++;
		}
        return(scaleValues(histogram))
    });

</script>

{#if greyscaleImageData.length > 0}
	<svg width="256" height="256" class="container">
		<g class="isolator">
			<g fill="black">
				{#each histogram as bar, i}
					<rect x={i * 1} y={256 - bar} width="1" height={bar} />
				{/each}
			</g>
			<g fill="black">
				<rect x="0" y="0" width={blackpoint} height="256" fill="black" class="overlay" />
			</g>
			<g fill={hexColor}>
				<rect x={blackpoint} y="0" width={whitepoint - blackpoint} height="256" class="overlay" />
			</g>
			<g fill="#fff">
				<rect x={whitepoint} y="0" width={256 - whitepoint} height="256" class="overlay" />
			</g>
		</g>
	</svg>
{/if}

<style>
	.overlay {
		mix-blend-mode: multiply;
		opacity: 0.5;
	}
	.container {
		border: 1px solid black;
		box-sizing: content-box;
		margin: 1em;
		background-color: #eee;
	}
	.isolator {
		isolatation: isolate;
	}
</style>
