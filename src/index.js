import * as THREE from 'three';
import { svgExport } from './svg-export.js';
import styles from './index.scss';

const container = document.getElementsByClassName('container')[0];;
let renderScene;
let faceScene;
let camera;
let renderer;
let renderTarget;
let faceTarget;
let boxy;
let faceBox;


function init() {
	const w = container.offsetWidth;
	const h = container.offsetHeight;

	renderer = new THREE.WebGLRenderer({antialias: false, preserveDrawingBuffer: true});
	renderer.setSize(w, h);
	renderer.setClearColor(0xEFEFEF);
	// renderer.setClearColor(0x47B6A5);
	// renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setPixelRatio(1);
	console.log(renderer);
	container.appendChild(renderer.domElement);

	renderScene = new THREE.Scene();
	faceScene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, w/h, 1, 1000);
	camera.position.set(10, 5, 5);
	camera.lookAt(renderScene.position);

	const hemilight = new THREE.HemisphereLight(0xFFFFFF, 0xFAFAFA, 2);
	renderScene.add(hemilight);

	boxy = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshNormalMaterial()
	);
	faceBox = THREE.SceneUtils.createMultiMaterialObject( new THREE.BoxGeometry(5,5,5), [
		new THREE.MeshLambertMaterial( { color: 0x000000} ),
		new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true, wireframeLinewidth: 3} )
	]);
	renderScene.add(boxy);
	faceScene.add(faceBox);

	renderScene.add(camera);

	render();
	console.log('asf')
}

function render() {
	// window.requestAnimationFrame(render);
	renderer.render(renderScene, camera);
	document.body.appendChild(svgExport(boxy, camera, renderer));
	// controls.update();
}

document.addEventListener('click', function(e) {
	console.log(e.pageX, e.pageY);
})

init();
