# Three.js SVG Exporter
Exports your three.js scenes to svg!

## Problems
* A bit innaccurate. Scale up le demo cube and you'll see some faces get the background color. Pull color from the fragment shader?
* colors are a bit dark, no idea why

## TODO - colors
* Render to main render target
* Render to wireframe render target: set material to all black except for bright pink (or whatever) wireframe. see multimaterialobject here https://github.com/mrdoob/three.js/blob/master/src/extras/SceneUtils.js
* Get pixel data on main render target
* Get pixel data on wireframe render target
* For each face
	* Identify face centroid (this is done already)
	* Flood fill from face centroid on wireframe target: if the pixel is black, record the color of the same pixel on the main render target, push that pixel to a face color array
	* Average (median?) the face color array
	* Set that color to the color of the svg polygon

