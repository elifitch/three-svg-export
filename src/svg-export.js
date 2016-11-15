import * as THREE from 'three';

export function svgExport(obj, camera, canvas) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	let svgPolys = [];
	svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
	obj.updateMatrixWorld();

	obj.geometry.faces.forEach(face => {
		const coords = {};
		const polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		coords.a = coordsFromVertex(obj.geometry.vertices[face.a], camera, canvas);
		coords.b = coordsFromVertex(obj.geometry.vertices[face.b], camera, canvas);
		coords.c = coordsFromVertex(obj.geometry.vertices[face.c], camera, canvas);
		polygon.setAttribute("points", `${coords.a.x},${coords.a.y} ${coords.b.x},${coords.b.y} ${coords.c.x},${coords.c.y}`);
		svg.appendChild(polygon);
	});

	console.log(svg);
	return svg;
}

function coordsFromVertex(vertex, camera, canvas) {
	const widthHalf = 0.5 * canvas.width;
	const heightHalf = 0.5 * canvas.height;
	const coord = vertex.project(camera);
	coord.x = ( coord.x * widthHalf ) + widthHalf;
	coord.y = - ( coord.y * heightHalf ) + heightHalf;
	// coord.x = coord.x * canvas.width;
	// coord.y = coord.y * canvas.height;
	return coord;

}

// function toScreenPosition(obj, camera, canvas) {
//     var vector = new THREE.Vector3();

//     var widthHalf = 0.5 * canvas.width;
//     var heightHalf = 0.5 * canvas.height;

//     vector.setFromMatrixPosition(obj.matrixWorld);
//     vector.project(camera);

//     vector.x = ( vector.x * widthHalf ) + widthHalf;
//     vector.y = - ( vector.y * heightHalf ) + heightHalf;

//     return {
//         x: vector.x,
//         y: vector.y
//     };

// }
