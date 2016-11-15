import * as THREE from 'three';

export function svgExport(obj, camera, canvas) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const raycaster = new THREE.Raycaster();
	const cameraPosition = camera.position.clone();
	const vertices = obj.geometry.vertices
	let svgPolys = [];
	svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
	obj.updateMatrixWorld();

	const sortedFaces = obj.geometry.faces.map(face => {
		face.distance = faceCentroid(face, vertices).distanceTo(cameraPosition);
		return face;
	}).sort(dynamicSort("distance"));


	sortedFaces.forEach(face => {
		let coords = {};
		let polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');

		coords.a = coordsFromVertex(vertices[face.a], camera, canvas);
		coords.b = coordsFromVertex(vertices[face.b], camera, canvas);
		coords.c = coordsFromVertex(vertices[face.c], camera, canvas);
		polygon.setAttribute("points", `${coords.a.x},${coords.a.y} ${coords.b.x},${coords.b.y} ${coords.c.x},${coords.c.y}`);
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

// function faceIsVisible(face, raycaster, cameraPosition) {
// 	raycaster.set();
// }

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
