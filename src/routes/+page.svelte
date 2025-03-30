<script>
	import '../app.scss';
	let fill = 'black';
	let bar1 = 150;
	let bar2 = 200;

	const changeFill = () => {
		fill = 'red';
	};

	function scaleValue(value, max) {
		return Math.floor((value / max) * 255);
	}

	function scaleValues(numbers) {
		const max = Math.max(...numbers);
		return numbers.map((value) => scaleValue(value, max));
	}

	const histogram = [
		233, 381, 313, 271, 244, 240, 254, 283, 235, 247, 249, 244, 220, 225, 238, 214, 254, 208, 251,
		248, 257, 274, 269, 250, 257, 255, 271, 235, 270, 285, 288, 276, 295, 321, 309, 310, 331, 373,
		364, 407, 384, 409, 443, 444, 486, 510, 466, 532, 510, 524, 565, 585, 614, 593, 641, 610, 619,
		595, 666, 660, 674, 679, 664, 713, 697, 708, 729, 727, 748, 824, 759, 831, 773, 829, 790, 857,
		842, 927, 874, 909, 863, 811, 823, 835, 803, 824, 868, 918, 899, 928, 934, 946, 987, 994, 1005,
		1018, 1052, 979, 1005, 939, 1016, 862, 864, 899, 833, 888, 928, 866, 898, 816, 794, 802, 754,
		803, 879, 900, 940, 978, 976, 913, 880, 857, 800, 735, 727, 701, 662, 684, 655, 595, 567, 559,
		573, 573, 571, 524, 532, 468, 481, 469, 474, 500, 494, 475, 492, 487, 491, 498, 522, 490, 481,
		523, 491, 516, 569, 607, 557, 581, 611, 616, 650, 589, 599, 617, 676, 696, 723, 742, 819, 799,
		851, 800, 894, 938, 996, 1009, 974, 943, 999, 952, 903, 830, 863, 849, 806, 763, 722, 598, 673,
		590, 626, 466, 454, 445, 434, 345, 396, 339, 331, 315, 247, 274, 247, 247, 220, 226, 224, 223,
		171, 172, 172, 156, 174, 151, 157, 133, 133, 134, 127, 125, 120, 109, 118, 95, 85, 93, 102, 80,
		100, 80, 111, 92, 97, 83, 93, 86, 69, 86, 84, 85, 89, 89, 86, 86, 102, 113, 115, 120, 125, 128,
		163, 195, 265, 498, 1053, 1691
	];

	const newhistogram = scaleValues(histogram);
	console.log(newhistogram);
</script>

<main>
	<h1>Toner</h1>

	<input type="file" accept="image/*" capture="user" />
	<section>
		<canvas width="120" height="120" style="border: 1px solid black">
			this will be the image.
		</canvas>
	</section>
	<section style="display: flex">
		<svg
			width="256"
			height="256"
			style="border: 1px solid black; box-sizing: content-box; margin: 1em; background-color: #eee"
		>
			<g style="isolatation: isolate">
				<g {fill} on:click={changeFill}>
					{#each newhistogram as bar, i}
						<rect x={i * 1} y={256 - bar} width="1" height={bar} />
					{/each}
				</g>
				<g fill="black">
					<rect
						x="0"
						y="0"
						width={bar1}
						height="256"
						fill="black"
						style="mix-blend-mode: multiply; opacity: .5"
					/>
				</g>
				<g fill="green">
					<rect
						x={bar1}
						y="0"
						width={bar2 - bar1}
						height="256"
						fill="green"
						style="mix-blend-mode: multiply; opacity: .5"
					/>
				</g>
				<g fill="#fff">
					<rect
						x={bar2}
						y="0"
						width={256 - bar2}
						height="256"
						style="mix-blend-mode: multiply; opacity: .5"
					/>
				</g>
			</g>
		</svg>
        <div  style="display: flex">
		<label for="bar1"
			><div style="padding: 2px;height:2em; width:2.5em; background-color:black; color:white ">{bar1}</div>
			<input class="sliders" bind:value={bar1} type="range" min="0" max={bar2} step="1" /></label
		>
		<label for="bar2"
			><div style="padding: 2px;height:2em; width:2.5em; background-color:green; color:white ">{bar2}</div>
			<input class="sliders" bind:value={bar2} type="range" min={bar1} max="256" step="1" /></label
		></div>
	</section>
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
