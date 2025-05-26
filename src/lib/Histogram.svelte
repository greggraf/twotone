<script>
	const histogramHeight = 116;

	function scaleValue(value, max = 255) {
		return Math.floor((value / max) * histogramHeight);
	}

	function scaleValues(numbers = []) {
		const max = Math.max(...numbers);
		return numbers.map((value) => scaleValue(value, max));
	}

	function figureoutoverlays(colorRanges, hexColors) {
		const overlays = [];
		for (let i = 0; i < colorRanges.length; i++) {
			if (i === 0) {
				overlays.push({
					start: 0,
					end: colorRanges[i],
					color: '#000'
				});
			}
			if (i != colorRanges.length - 1) {
				overlays.push({
					start: colorRanges[i],
					end: colorRanges[i + 1],
					color: hexColors[i]
				});
			}

			overlays.push({
				start: colorRanges[i],
				end: 256,
				color: '#fff'
			});
		}
		return overlays;
	}

	let { greyscaleImageData = [], colorRanges = [], hexColors } = $props();

	let histogram = $derived.by(() => {
		const histogram = new Array(256).fill(0);
		for (let i = 0; i < greyscaleImageData.length; i += 4) {
			const grayscale = greyscaleImageData[i];
			histogram[grayscale]++;
		}
		return scaleValues(histogram);
	});

	let overlays = $derived.by(() => figureoutoverlays(colorRanges, hexColors));
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

				{#each overlays as props, index}
					<g fill={props.color}>
						<rect
							x={props.start}
							y="0"
							width={props.end - props.start}
							height={histogramHeight}
							class="overlay"
						/>
					</g>
				{/each}
				<!-- <g fill="black">
					<rect
						x="0"
						y="0"
						width={colorRanges[0]}
						height={histogramHeight}
						fill="black"
						class="overlay"
					/>
				</g>
				<g fill={hexColors[0]}>
					<rect
						x={colorRanges[0]}
						y="0"
						width={colorRanges[1] - colorRanges[0]}
						height={histogramHeight}
						class="overlay"
					/>
				</g>
				<g fill="#fff">
					<rect
						x={colorRanges[1]}
						y="0"
						width={256 - colorRanges[1]}
						height={histogramHeight}
						class="overlay"
					/>
				</g> -->
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
