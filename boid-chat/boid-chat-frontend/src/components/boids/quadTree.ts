import { boidProperties } from "./types";

export class AABB {
  private center: { x: number; z: number };
  private halfDimension: { w: number; h: number };

  constructor(
    _center: { x: number; z: number },
    _halfDimension: { w: number; h: number }
  ) {
    this.center = _center;
    this.halfDimension = _halfDimension;
  }

  // Checks if AABB contains a given point
  containsPoint(point: { x: number; z: number }): boolean {
    if (
      point.x > this.center.x - this.halfDimension.w &&
      point.x <= this.center.x + this.halfDimension.w
    ) {
      if (
        point.z > this.center.z - this.halfDimension.h &&
        point.z <= this.center.z + this.halfDimension.h
      ) {
        return true;
      }
    }
    return false;
  }

  // basic intersection function, compares top compare top right and bottom left of each boundry
  intersectsAABB(other: AABB) {
    const thisTRX = this.center.x + this.halfDimension.w;
    const thisTRZ = this.center.z + this.halfDimension.h;

    const thisBLX = this.center.x - this.halfDimension.w;
    const thisBLZ = this.center.z - this.halfDimension.h;

    const otherTRX = other.center.x + other.halfDimension.w;
    const otherTRZ = other.center.z + other.halfDimension.h;

    const otherBLX = other.center.x - other.halfDimension.w;
    const otherBLZ = other.center.z - other.halfDimension.h;

    if (thisTRX > otherBLX && thisTRZ > otherBLZ) {
      if (otherTRX > thisBLX && otherTRZ > thisBLZ) {
        return true;
      }
    }
    return false;
  }

  getCenter(){
    return this.center;
  }

  setCenter(x:number,z:number){
    this.center.x = x;
    this.center.z = z;
  }

  getHalfDimension(){
    return this.halfDimension;
  }
}

export class QuadTree {
  private boundry:AABB;
  private capacity:number;
  private objectArray: boidProperties[];
  private northEast:QuadTree | null;
  private southEast:QuadTree | null;
  private southWest:QuadTree | null;
  private northWest:QuadTree | null;

  constructor(_boundry:AABB, n:number) {
// The boundry represents the position and dimensions of the quadtree
        this.boundry = _boundry;
        // Number of items per quad tree
        this.capacity = n;
        // Array of items we are storing
        this.objectArray = [];
        // Children quad tree
        this.northEast = null;
        this.southEast = null;
        this.southWest =null;
        this.northWest= null;
  }

  // Check if object position is within the quad tree perimeter
  contains(posX: number, posZ:number){
    return this.boundry.containsPoint({x:posX, z:posZ});
  }

  // Divide into four new quad trees keeping reference to its parent
  subdivide(){
    let x = this.boundry.getCenter().x;
    let z = this.boundry.getCenter().z;
    let w = this.boundry.getHalfDimension().w; 
    let h = this.boundry.getHalfDimension().h;

    // Quad Tree class takes a AABB as an argument, AABB class takens center and position objects as arguments
    let NEBoundry = new AABB({x:x+(w/2), z:z-(h/2)}, {w:w/2,h:h/2});
    this.northEast = new QuadTree(NEBoundry, this.capacity);
    let SEBoundry = new AABB({x:x+(w/2), z:z+(h/2)}, {w:w/2,h:h/2});
    this.southEast = new QuadTree(SEBoundry, this.capacity);
    let SWBoundry = new AABB({x:x-(w/2), z:z+(h/2)}, {w:w/2,h:h/2});
    this.southWest = new QuadTree(SWBoundry, this.capacity);
    let NWBoundry = new AABB({x:x-(w/2), z:z-(h/2)}, {w:w/2,h:h/2});
    this.northWest = new QuadTree(NWBoundry, this.capacity);
  }

  // Insert objects into the tree, expect 
  insert(objectProperties:boidProperties){
    let position = objectProperties.position;
    // Check if objects position is within the quadtree
    if(!this.contains(position.x, position.z)){
        return false; 
    }
    // Check quadtree has the capactiy for this object
    if(this.objectArray.length < this.capacity){
        this.objectArray.push(objectProperties);
        return true;
    } 

    // Explore children quadtree's
    if(this.northEast == null){
        // Unless width of current quadtree is 1 (we dont want quadtree perimeters to be less than a unit vector)
        /* if(this.x <=1 && this.z <= 1){
            return false;
        } else{
            this.subdivide();
        } */
        this.subdivide()
    }
    
    // Try to insert object into children quadtree's
    if(this.northEast?.insert(objectProperties)){
        return true;
    } else if(this.southEast?.insert(objectProperties)){
        return true;        
    } else if(this.southWest?.insert(objectProperties)){
        return true;
    } else if(this.northWest?.insert(objectProperties)){
        return true;
    } else{
        return false;
    }
  }

  // Returns a list of objects in a given boundry
  find(range:AABB): boidProperties["object"][]{
    let resultList:boidProperties["object"][] = [];
    // Automatically abort if the range does not intersect this quad
    if (!this.boundry.intersectsAABB(range)){
        return resultList; // empty list
    }
    
    // Check objects at this quad level
    for (let p = 0; p < this.objectArray.length; p++){
        if (range.containsPoint(this.objectArray[p].position)) {
            // Returns the Three js object itself
            resultList.push(this.objectArray[p].object);
        }
    }

    // Terminate here, if there are no children
    if (this.northWest == null){return resultList;}

    // Otherwise, add the points from the children
    if(this.northEast !== null){resultList.push(...this.northEast.find(range));}
    if(this.southEast !== null){resultList.push(...this.southEast.find(range));}
    if(this.southWest !== null){resultList.push(...this.southWest.find(range));}
    if(this.northWest !== null){resultList.push(...this.northWest.find(range));}
    
    return resultList;
}

}
