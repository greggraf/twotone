<script>
	let { value = $bindable(), min, max, color } = $props();
</script>

<label
	><button class="swatch" style="--color: {color};" on:click>
		{value}
	</button>
	<input class="sliders" bind:value type="range" {min} {max} step="1" /></label
>

<style>
	.swatch {
		padding: 2px;
		height: 2em;
		width: 2.5em;
		background-color: var(--color);
		color: white;
		margin: .2em;
	}
	.sliders {
		width: 200px;
	}
	label {
		display: flex;
		margin: 0;
	}
</style>
