import * as THREE from 'three';
import { svgExport } from './svg-export.js';
import styles from './index.scss';

let scene;
let camera;
let renderer;
let boxy;


function init() {
	const container = document.getElementsByClassName('container')[0];
	const w = container.offsetWidth;
	const h = container.offsetHeight;

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(w, h);
	renderer.setClearColor(0xEFEFEF);
	// renderer.setClearColor(0x47B6A5);
	// renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setPixelRatio(1);
	console.log(renderer);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
	camera.position.set(10, 5, 5);
	camera.lookAt(scene.position);

	const hemilight = new THREE.HemisphereLight(0xFFFFFF, 0xFAFAFA, 2);
	scene.add(hemilight);

	boxy = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshNormalMaterial()
	);
	scene.add(boxy);

	scene.add(camera);

	render();
	console.log('asf')
}

function render() {
	// window.requestAnimationFrame(render);
	renderer.render(scene, camera);
	document.body.appendChild(svgExport(boxy, camera, renderer));
	// console.log(svgExport(boxy, camera, renderer.context.canvas));
	// controls.update();
}

document.addEventListener('click', function(e) {
	console.log(e.pageX, e.pageY);
})

init();
