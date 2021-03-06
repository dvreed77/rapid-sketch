import { canvasSketch } from "rapid-sketch";
import { random, color } from "rapid-sketch-utils";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { RedIntegerFormat } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import vertexShader from './vert-shader.glsl';
import fragmentShader from "./shaders/frag-shader.6.glsl";

canvasSketch(
  ({ context, width, height, viewportWidth, viewportHeight, pixelRatio }) => {
    const renderer = new THREE.WebGLRenderer({
      context,
    });

    renderer.setClearColor("white");

    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(3, 3, -5);
    camera.lookAt(new THREE.Vector3());

    const controls = new OrbitControls(
      camera,
      context.canvas as HTMLCanvasElement
    );

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const baseGeometry = new THREE.IcosahedronGeometry(1, 1);

    const points = baseGeometry.vertices;

    const vertexShader = /* glsl */ `
      varying vec3 vPosition;
      void main () {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      defines: {
        POINT_COUNT: points.length,
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        color: {
          value: new THREE.Color("tomato"),
        },
        points: { value: points },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewportWidth, viewportHeight);

    camera.updateProjectionMatrix();

    // renderer.render(scene, camera);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    return ({ frame }) => {
      material.uniforms.time.value = frame * 0.01;
      renderer.render(scene, camera);
    };
  },
  {
    dimensions: [800, 800],
    name: "sketch1",
    context: "webgl",
    animation: true,
    totalFrames: 500,
  }
);
