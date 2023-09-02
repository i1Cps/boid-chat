import * as THREE from "three";
import { boidSize } from "./types";

export class boidAgent {
  private scene: THREE.Scene;
  private radius: number;
  private height: number;
  private boidArea: { x: number; z: number };
  private radialSegment: number;
  private colour: number;
  private agentObject: THREE.Mesh;
  private linearVelocity: number;

  private angularVelocity: number;
  private avChangeWeight: number;
  private angularVelocityDecayRate: number;

  private allignWeight: number;
  private seperationWeight: number;

  private direction: THREE.Vector3;
  private rotation: number;
  private objectPosition: THREE.Vector3;
  private myBoid: boolean;
  private xx: boolean;

  constructor(
    size: boidSize,
    position: THREE.Vector3,
    rotation: number,
    colour: number,
    scene: THREE.Scene,
    boidArea: { x: number; z: number },
  ) {
    this.scene = scene;
    this.radius = size.radius;
    this.height = size.height;
    this.boidArea = boidArea;
    this.radialSegment = size.radialSegment;
    this.colour = colour;
    this.agentObject = new THREE.Mesh();
    this.linearVelocity = 0.7;

    this.angularVelocity = 0.0;
    this.avChangeWeight = 0.1;
    this.angularVelocityDecayRate = 0.99;

    this.allignWeight = 0.1;
    this.seperationWeight = 0;

    this.direction = new THREE.Vector3();
    this.rotation = rotation;
    this.objectPosition = position;
    this.myBoid = false;
    this.xx = true;
    this.create();
  }
  // Create Boid and add to scene
  create() {
    const geometry = new THREE.ConeGeometry(
      this.radius,
      this.height,
      this.radialSegment,
    );
    const material = new THREE.MeshBasicMaterial({ color: this.colour });
    this.agentObject = new THREE.Mesh(geometry, material);

    this.agentObject.position.set(
      this.objectPosition.x,
      this.objectPosition.y,
      this.objectPosition.z,
    );
    this.agentObject.rotateX(Math.PI / 2);
    this.agentObject.rotateZ(this.rotation);

    if (this.colour === 0xff0000) {
      this.myBoid = true;
    }
    this.scene.add(this.agentObject);
  }

  // Every time step, this function will be called on the boids (Everything in this function needs to be fast)
  step() {
    this.applyLinearVelocity();
    this.applyAngularVelocity();
    this.keepBoidInGrid();
    this.keepBoid2D();
  }

  applyLinearVelocity() {
    const dir = this.getDirection();
    this.agentObject.position.addScaledVector(
      dir.normalize(),
      this.linearVelocity,
    );
  }

  applyAngularVelocity() {
    this.changeBoidAngle();
    this.adjustAngularVelocity();
    this.angularVelocityDecay();
  }

  // Rotate boid based on angular velocity
  changeBoidAngle() {
    // This returns direction vector e.g. (x=0.48, y=0.0, z=0.48)
    let currentDirection = this.getDirection();
    // Angle increment
    let angleIncrement = this.angularVelocity;
    // Calculate sin and cos theta
    let sinTheta = Math.sin(angleIncrement);
    let cosTheta = Math.cos(angleIncrement);
    // New direction vector
    let newXDirection =
      currentDirection.x * cosTheta - currentDirection.z * sinTheta;
    let newZDirection =
      currentDirection.x * sinTheta + currentDirection.z * cosTheta;
    let newDirection = new THREE.Vector3(newXDirection, 0, newZDirection);
    this.setDirection(newDirection);
  }

  // Use normal distrubution to adjust angular velocity
  adjustAngularVelocity() {
    // Randomly samples a normal dsitrubuted number to add to angular velocity
    let adjustAV = this.randn_normal_dist(-0.1, 0.1);

    //console.log(dirWeight);
    this.angularVelocity += adjustAV * this.avChangeWeight;
  }

  // Decay the angular velocity back to 0.0 (make boid face straight) over time
  angularVelocityDecay() {
    let av = this.angularVelocity;
    let sign = Math.sign(av);
    av = sign * Math.abs(av) * this.angularVelocityDecayRate;
    this.angularVelocity = av;
  }

  keepBoidInGrid() {
    if (this.agentObject.position.y > 20) {
      this.agentObject.position.setY(20);
    }
    if (this.agentObject.position.y < -5) {
      this.agentObject.position.setY(-5);
      if (this.myBoid) {
        console.log("mad mad");
      }
    }

    if (this.agentObject.position.x > this.boidArea.x) {
      this.agentObject.position.setX(-this.boidArea.x);
    } else if (this.agentObject.position.x < -this.boidArea.x) {
      this.agentObject.position.setX(this.boidArea.x);
    }

    if (this.agentObject.position.z > this.boidArea.z) {
      this.agentObject.position.setZ(-this.boidArea.z);
    } else if (this.agentObject.position.z < -this.boidArea.z) {
      this.agentObject.position.setZ(this.boidArea.z);
    }
  }

  // function to fix stupid flying issues. not even a fix tbh but gotta do what you gotta do
  keepBoid2D() {
    let boidDir = this.getDirection();
    boidDir.setComponent(1, 0);
    this.setDirection(boidDir);
  }

  // One method to get direction could be to rotate it upright again  ( do the reverse of the original rotation)
  getDirection() {
    // points boid back upright because thats the only way to get worlddirection for some stupid reason
    let vector = new THREE.Vector3();
    this.agentObject.rotateX(-Math.PI / 2);
    var dir = this.agentObject.getWorldDirection(vector);
    this.agentObject.rotateX(Math.PI / 2);
    return dir;
  }

  // sets new direction on object
  setDirection(newDirection: THREE.Vector3) {
    this.agentObject.rotateX(-Math.PI / 2);
    var pos = new THREE.Vector3();
    pos.addVectors(this.agentObject.position, newDirection);
    this.agentObject.lookAt(pos);
    this.agentObject.rotateX(Math.PI / 2);
  }

  /* distanceFromBoid(thisBoid, otherBoid) {
        let thisBoidPos = thisBoid.agentObject.position;
        let otherBoidPos = otherBoid.agentObject.position;
        return thisBoidPos.distanceTo(otherBoidPos);
    } */

  // Alignment Principle...
  // Alignment: steer towards the average heading of local boids
  allign(boids: boidAgent[]) {
    let boidNearby = false;
    const visableDistance = 20;
    var total = 0;
    let avgDirection = new THREE.Vector3();

    // Loop through each boid and check whether its in the visable range
    for (let boid of boids) {
      let currentBoidPos = this.agentObject.position;
      let otherBoidPos = boid.agentObject.position;
      // If boid is visable store its direction
      if (
        boid !== this &&
        currentBoidPos.distanceTo(otherBoidPos) < visableDistance
      ) {
        let boidDirection = boid.getDirection();
        avgDirection.add(boidDirection);
        boidNearby = true;
        total++;
      }
    }

    if (boidNearby) {
      // Get average direction of all visable boids
      avgDirection.divideScalar(total);

      let currentDirection = this.getDirection();
      let allignedDirection = new THREE.Vector3();
      // Get weighted average between current boid direction and average direction of local boid
      allignedDirection.addVectors(
        currentDirection,
        avgDirection.multiplyScalar(this.allignWeight),
      );
      this.setDirection(allignedDirection);
    }
  }

  // Cohesion Principle...
  // Cohesion: steer to move towards the average position (center of mass) of local flockmates
  cohesion(boids: boidAgent[]) {
    let boidNearby = false;
    const visableDistance = 50;
    var total = 0;
    let avgPosition = new THREE.Vector3();

    // Loop through each boid and check whether its in the visable range
    for (let boid of boids) {
      let currentBoidPos = this.agentObject.position;
      let otherBoidPos = boid.agentObject.position;

      // If boid is visable store its position
      if (
        boid !== this &&
        currentBoidPos.distanceTo(otherBoidPos) < visableDistance
      ) {
        avgPosition.add(otherBoidPos);
        boidNearby = true;
        total++;
      }
    }

    if (boidNearby) {
      // Get average position of all visable boids
      avgPosition = avgPosition.divideScalar(total);
      // get direction to center of the flock by subtracting position of current boid from average position flock mates.
      // this will give a direction vector which will tell our boid where to go
      let centerDirection = new THREE.Vector3();
      centerDirection.subVectors(avgPosition, this.agentObject.position);

      // get a average direction from current direction of boid and new direction calculated
      let currentDirection = this.getDirection();
      let newDirection = new THREE.Vector3();
      // get a weighted final direction for boid
      newDirection.addVectors(
        currentDirection,
        centerDirection.multiplyScalar(0.0005),
      );
      // get average from adding them
      newDirection.multiplyScalar(0.5);

      // get weighted average between current boid direction and new direction
      //al.addVectors(currentDirection, newDirection);
      this.setDirection(newDirection);
    }
  }

  // Seperation Principle...
  // Seperation: steer to avoid crowding local boids ---- not working
  seperation(boids: boidAgent[]) {
    //let boidNearby = false;
    const visableDistance = 50;
    //const scaler = 1;
    //var total = 0;
    //let avgPosition = new THREE.Vector3();

    // loop through each flockmate and check whether its visable
    for (let boid of boids) {
      let currentBoidPos = this.agentObject.position;
      let otherBoidPos = boid.agentObject.position;
      // if flockmate is visable calculate its distance to this.boid and its direction
      if (
        boid !== this &&
        currentBoidPos.distanceTo(otherBoidPos) < visableDistance
      ) {
        // get distance and direction of boid from this.boid
        // further away the smaller the force of seperation
        // use visable distance to calculate percentages
        //let distanceFromBoid = currentBoidPos.distanceTo(otherBoidPos);
        /* let directionFromBoid = new THREE.Vector3().subVectors(
          otherBoidPos,
          currentBoidPos,
        ); */
        //let newDirection = directionFromBoid.negate();
        //let force = (visableDistance - directionFromBoid) * scaler
        //boidNearby = true;
        //total++;
      }
    }
  }

  // Function to get random normal distribution
  randn_normal_dist(min: number, max: number) {
    let u = 0,
      v = 0;
    while (u === 0) {
      u = Math.random(); //Converting [0,1) to (0,1)
    }
    while (v === 0) {
      v = Math.random();
    }
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    // Translate to 0 -> 1
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0)
      // resample between 0 and 1 if out of range
      num = this.randn_normal_dist(min, max);
    else {
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
    }
    return num;
  }
}
