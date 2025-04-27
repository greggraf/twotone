<script>
	const histogramHeight = 116;

	function scaleValue(value, max = 255) {
		return Math.floor((value / max) * histogramHeight);
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
		return scaleValues(histogram);
	});
</script>

{#if greyscaleImageData.length > 0}
	<div>
		<svg
			width="100%"
			height="100%"
			x="0"
			y="0"
			preserveAspectRatio="none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 {histogramHeight}"
			class="container"
		>
			<g class="isolator">
				<g fill="black">
					{#each histogram as bar, i}
						<rect x={i * 1} y={histogramHeight - bar} width="1" height={bar} />
					{/each}
				</g>
				<g fill="black">
					<rect
						x="0"
						y="0"
						width={blackpoint}
						height={histogramHeight}
						fill="black"
						class="overlay"
					/>
				</g>
				<g fill={hexColor}>
					<rect
						x={blackpoint}
						y="0"
						width={whitepoint - blackpoint}
						height={histogramHeight}
						class="overlay"
					/>
				</g>
				<g fill="#fff">
					<rect
						x={whitepoint}
						y="0"
						width={256 - whitepoint}
						height={histogramHeight}
						class="overlay"
					/>
				</g>
			</g>
		</svg>
	</div>
{/if}

<style>
	.overlay {
		mix-blend-mode: multiply;
		opacity: 0.5;
	}
	.container {
		border: 1px solid black;
		box-sizing: content-box;
		background-color: #eee;
	}
	.isolator {
		isolatation: isolate;
	}
	svg {
		width: 100%;
	}
</style>
