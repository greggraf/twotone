import { describe, test, expect } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';
  
describe('/+page.svelte', () => {
	test('should render h1', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
	});

	const page = mount(Page, {
		target: document.body, // `document` exists because of jsdom
		props: { _greyscaleImaddgeData: [] }
	});

	flushSync();

	expect(document.body.innerHTML).toBe(
		'<main><h1>Toner</h1> <input type="file" accept="image/*" capture="user" id="input"> <div style="display: flex"><section><canvas width="120" height="120" style="border: 1px solid black; max-width: 800px; width: 100%" id="outputCanvas">this will be the image.</canvas></section> <section style="display: flex"><!----> <div style="display: flex"><label for="blackpoint" class="svelte-142w866"><div style="padding: 2px;height:2em; width:2.5em; background-color:black; color:white ">78</div> <input class="sliders svelte-142w866" type="range" min="0" step="1" max="110"></label> <label for="whitepoint" class="svelte-142w866"><div style="padding: 2px; height: 2em; width: 2.5em; background-color: rgb(255, 204, 204); color: white;">110</div> <input class="sliders svelte-142w866" type="range" max="256" step="1" min="78"></label></div></section></div></main>'
	);

	unmount(page);
});
