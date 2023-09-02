import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import KeyboardInputs from "./keyboardInputs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { boidAgent } from "./boidAgent";
import { boidSize } from "./types";

interface ThreeCanvasProps {
  width: number;
  height: number;
}

const BoidsComponent: React.FC<ThreeCanvasProps> = ({ width, height }) => {
  // Standard global constants and variables
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keyboardInput = useRef<KeyboardInputs | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  // Custom constants and variables
  const firstBoid = useRef<boolean>(true); // <------------ Special red boid
  const allign = useRef<boolean>(true); // <------------- Turns on allignment principle
  const cohesion = useRef<boolean>(true); // < ----------------------------- Turns on cohesian principle
  const seperation = useRef<boolean>(true); // <---------------------------- Turns on seperation principle
  const boidsCanMove = useRef<boolean>(true); //<------ boids can move
  const boidArea = useRef<{ x: number; z: number }>({ x: 400, z: 400 }); //< --------- Area which boids can fly in
  const boidArray = useRef<boidAgent[]>([]); // <------------- Array to keep tabs on all boids generated
  const numberOfBoids = useRef<number>(600);

  useEffect(() => {
    // RENDERER
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    // Attach renderer's DOM element
    if (rendererRef.current) {
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (mountRef.current) {
        mountRef.current.appendChild(rendererRef.current.domElement);
      }
    }
    rendererRef.current.setClearColor(0x000000, 0); // Transparent background

    // SCENE
    sceneRef.current = new THREE.Scene();

    // CAMERA
    // Camera variables
    var VIEW_ANGLE = 75,
      ASPECT = width / height,
      NEAR = 0.1,
      FAR = 20000;
    // First Camera
    cameraRef.current = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR,
    );
    cameraRef.current.position.set(14, -114, 311.7);

    // EVENTS
    const handleResize = () => {
      /* // update sizes
      width = window.innerWidth;
      height = window.innerHeight;

      if(cameraRef.current) {
        // Update CAMERA
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }

      if(rendererRef.current) {
        // Update RENDERER
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      } */
    };
    window.addEventListener("resize", () => handleResize);

    // KEYBAORD
    keyboardInput.current = new KeyboardInputs();

    // CONTROLS
    controls.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement,
    );
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = 0.5;
    controls.current.enableZoom = false;
    controls.current.enableDamping = true;
    controls.current.rotateSpeed = 0.2;
    //var setPolarVal = controls.current.getPolarAngle();
    controls.current.maxPolarAngle = 1.9210958205953366;
    controls.current.minPolarAngle = 1.9210958205953366;

    // Set initial useRef hook values
    firstBoid.current = true;
    allign.current = true;
    cohesion.current = true;
    seperation.current = false;
    boidsCanMove.current = true;
    boidArea.current = {
      x: 400,
      z: 400,
    };
    boidArray.current = [];
    numberOfBoids.current = 600;

    // Function that creates boids
    const createboid = (scene: THREE.Scene): boidAgent => {
      // Choose random spawn loaction for boid
      let posX = boidArea.current.x - Math.random() * boidArea.current.x * 2;
      let posZ = boidArea.current.z - Math.random() * boidArea.current.z * 2;
      const position = new THREE.Vector3(posX, 0, posZ);

      // Choose random rotation value for boid
      const rotation = Math.random() * Math.PI;

      // Boid size
      const boidSize: boidSize = {
        radius: 1,
        height: 4,
        radialSegment: 32,
      };

      // Create boid
      const boid = firstBoid.current
        ? new boidAgent(
            boidSize,
            position,
            rotation,
            0xff0000,
            scene,
            boidArea.current,
          )
        : new boidAgent(
            boidSize,
            position,
            rotation,
            0xffff00,
            scene,
            boidArea.current,
          );

      firstBoid.current = false;
      return boid;
    };

    const moveBoid = (boid: boidAgent) => {
      if (boidsCanMove) {
        boid.step();
        if (allign.current === true) {
          boid.allign(boidArray.current);
        }
        if (cohesion.current === true) {
          boid.cohesion(boidArray.current);
        }
        if (seperation.current === true) {
          // bugged
          //boid.seperation(boidArray)
        }
      }
    };

    // Spawn Boids
    for (let i = 0; i < numberOfBoids.current; i++) {
      const newBoid = createboid(sceneRef.current);
      boidArray.current.push(newBoid);
    }

    // Animation loop
    const animate = () => {
      // For each boid call function to move it
      boidArray.current.forEach(moveBoid);
      // Update your scene and camera here
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
      //update()
      //console.log(cameraRef.current?.position)
      controls.current?.update();
      requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Clean-up logic
    return () => {
      window.removeEventListener("resize", handleResize);

      // Dispose of Three.js components
      rendererRef.current?.dispose();
    };
  }, [width, height]);

  return (
    <div
      className="h-full w-full bg-transparent overflow-hidden"
      ref={mountRef}
    ></div>
  );
};

export default BoidsComponent;
