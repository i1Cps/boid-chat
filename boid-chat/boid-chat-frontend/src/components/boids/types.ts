import { boidAgent } from "./boidAgent";

export interface boidSize {
  radius: number;
  height: number;
  radialSegment: 32;
}

export interface boidProperties {
  object:boidAgent,
  position:THREE.Vector3
}
