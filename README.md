# Two Tone

Take an image and make it greyscale, then add a third color for highlight

## in progress
- write a basic test and run it, see about jest also

## To Do

Put these in order

- Figure out testing - read svelte docs
- Make clicking on the image toggle a large version and a small version
- Make the mobile layout
- Make CSS not styles - maybe as part of creating components
- create comonpents for
  - histogram
  - image upload stuff
  - maybe the sliders - or the slider with the color changer
- is there a reason that the image takes so long to load some times
- is there a memory leak?
- configure the build situation and deploy
- test on an actual phone
- provide the ability to add new color sliders
- long press to update color swatch (store swatches in local storage?)


```
[Debug] reading: 0.242ms (+page.svelte, line 209)
[Log] canvasWidth – 900 (+page.svelte, line 180)
[Debug] image load event: 71.590ms (+page.svelte, line 188)
[Debug] create grey scale: 10.609ms (+page.svelte, line 191)
[Debug] reducedColorImagedata: 9.863ms (+page.svelte, line 105)
[Debug] extract new datat: 1.144ms (+page.svelte, line 110)
[Debug] put image on canvas: 0.452ms (+page.svelte, line 113)
```