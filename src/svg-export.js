import * as THREE from 'three';

export function svgExport(obj, camera, renderer) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const canvas = renderer.context.canvas;
	const raycaster = new THREE.Raycaster();
	const cameraPosition = camera.position.clone();
	const vertices = obj.geometry.vertices
	let svgPolys = [];
	svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
	obj.updateMatrixWorld();

	obj.geometry.faces.map(face => {
		face.centroid = faceCentroid(face, vertices);
		face.distance = face.centroid.distanceTo(cameraPosition);
		return face;
	})
	.sort(dynamicSort("distance"))
	.forEach(face => {
		let coords = {};
		let polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');

		coords.a = coordsFromVertex(vertices[face.a], camera, canvas);
		coords.b = coordsFromVertex(vertices[face.b], camera, canvas);
		coords.c = coordsFromVertex(vertices[face.c], camera, canvas);
		polygon.setAttribute("points", `${coords.a.x},${coords.a.y} ${coords.b.x},${coords.b.y} ${coords.c.x},${coords.c.y}`);
		polygon.style.fill = colorAtPoint(face.centroid, camera, canvas, renderer);
		svg.appendChild(polygon);
	});

	return svg;
}

function coordsFromVertex(vertex, camera, canvas) {
	const widthHalf = 0.5 * canvas.width;
	const heightHalf = 0.5 * canvas.height;
	const coord = vertex.clone().project(camera);
	coord.x = ( coord.x * widthHalf ) + widthHalf;
	coord.y = - ( coord.y * heightHalf ) + heightHalf;
	return coord;
}

function faceCentroid(face, vertices) {
	const v1 = vertices[ face.a ];
	const v2 = vertices[ face.b ];
	const v3 = vertices[ face.c ];

	// calculate the centroid
	const centroid = new THREE.Vector3();
	centroid.x = ( v1.x + v2.x + v3.x ) / 3;
	centroid.y = ( v1.y + v2.y + v3.y ) / 3;
	centroid.z = ( v1.z + v2.z + v3.z ) / 3;
	// console.log(centroid);
	return centroid;
}

function dynamicSort(property) {
    var sortOrder = -1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function colorAtPoint(vector, camera, canvas, renderer) {
	const coord = vector.clone().project(camera);
	const widthHalf = 0.5 * canvas.width;
	const heightHalf = 0.5 * canvas.height;
	const gl = renderer.getContext();
	// let pixels = new Uint8Array(4 * canvas.width * canvas.height);
	let pixel = new Uint8Array(4);

	// coord.x = Math.abs( ( coord.x * widthHalf ) + widthHalf );
	// coord.y = Math.abs( -( coord.y * heightHalf ) + heightHalf );
	coord.x = ( coord.x * widthHalf ) + widthHalf;
	coord.y = -( coord.y * heightHalf ) + heightHalf;
	// let fb = gl.createFramebuffer();
	gl.readPixels(coord.x, coord.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

	let hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
	console.log(coord);
	console.log(hex);
	return hex;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
    	console.error("Invalid color component");
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}

