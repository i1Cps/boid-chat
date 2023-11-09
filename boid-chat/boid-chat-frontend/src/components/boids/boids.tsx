import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import KeyboardInputs from "./keyboardInputs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { boidAgent } from "./boidAgent";
import { boidSize } from "./types";
import { QuadTree, AABB } from './quadTree';

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
  const numberOfBoids = useRef<number>(600);
  const AREA = useRef<number>(3600);
  const quadTreeCap = useRef<number>(4);

  const firstBoid = useRef<boolean>(true); // <------------ Special red boid
  const allign = useRef<boolean>(true); // <------------- Turns on allignment principle
  const cohesion = useRef<boolean>(true); // < ----------------------------- Turns on cohesian principle
  const seperation = useRef<boolean>(true); // <---------------------------- Turns on seperation principle
  const boidsCanMove = useRef<boolean>(true); //<------ boids can move

  //const boidArea = useRef<{ x: number; z: number }>({ x: 400, z: 400 }); //< --------- Area which boids can fly in
  const boidArray = useRef<boidAgent[]>([]); // <------------- Array to keep tabs on all boids generated
  const QTBoundry = useRef<AABB | null>(null);
  const QT = useRef<QuadTree | null>(null);

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
    controls.current.autoRotate = false;
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
    seperation.current = true;
    boidsCanMove.current = true;
    AREA.current = 250;
    boidArray.current = [];
    numberOfBoids.current = 1000;
    QTBoundry.current = new AABB({x:0, z:0}, {w: AREA.current, h:AREA.current})
    QT.current  = new QuadTree(QTBoundry.current, quadTreeCap.current)


    // Function that creates boids
    const createboid = (scene: THREE.Scene)  => {
      // Choose random spawn loaction for boid
      let posX = AREA.current - Math.random() * AREA.current * 2;
      let posZ = AREA.current - Math.random() * AREA.current * 2;
      const position = new THREE.Vector3(posX*2, 0, posZ);

      // Choose random rotation value for boid
      const rotation = Math.random() * (2*Math.PI);

      // Boid size
      const boidSize: boidSize = {
        radius: 1,
        height: 4,
        radialSegment: 32,
      };

      const boidArea = {
        x:AREA.current*2,
        z:AREA.current
      }

      // Create boid
      const boid = firstBoid.current
        ? new boidAgent(
            boidSize,
            position,
            rotation,
            //0xff0000,
            0xc3469d,
            scene,
            boidArea,
            boidArray.current.length
          )
        : new boidAgent(
            boidSize,
            position,
            rotation,
            //0xffff00,
            0xccccff,
            scene,
            boidArea,
            boidArray.current.length
          );

      firstBoid.current = false;
      boidArray.current.push(boid)
    };

    const moveBoid = (boid: boidAgent) => {
      if (boidsCanMove.current) {
        boid.step();
        // Apply principles every time step if turned on
        if(allign.current === true) {boid.allign(QT.current!)}
        if(cohesion.current === true) {boid.cohesion(QT.current!)}
        if(seperation.current === true){boid.seperation(QT.current!)}
      }
    };

    // Spawn Boids
    for (let i = 0; i < numberOfBoids.current; i++) {
      createboid(sceneRef.current);
      //boidArray.current.push(newBoid);
    }

    // Inserts all boids into quad tree
    function insertAll(boidArray: boidAgent[], _QT:QuadTree){
      for(let boid of boidArray){
        let position = boid.agentObject.position;
        _QT.insert({object: boid, position: position})
      }
    }

    // Animation loop
    const animate = () => {
      // Create new quad tree
      QT.current = new QuadTree(QTBoundry.current!, quadTreeCap.current)
      // Insert every boid in boid array into new quad tree
      insertAll(boidArray.current, QT.current)
      // For each boid call function to move it
      boidArray.current.forEach(moveBoid);
      // Update your scene and camera here
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
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
