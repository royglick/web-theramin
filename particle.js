
let noiseScale=12
class Particle {
    constructor(x, y) {
      this.redGrad = map(y, height, 0, 142, 70);
      this.greenGrad = map(y, height, 0, 0, 38);
      this.blueGrad = map(y, height, 0, 51, 253);
      this.trailLength = 20;
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = 4;
      this.size = map(y, height, 0, 10, 2); 
      this.color = color(this.redGrad, this.greenGrad, this.blueGrad);
      this.lifespan = 200;
      this.trail = [];
    }
  
    update() {
      // Perlin noise movement
      let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale) * TWO_PI * 4;
      this.acc.set(cos(angle), sin(angle));
      this.acc.mult(0.1);
  
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
  
      // Add current position to trail
      this.trail.push(this.pos.copy());
      
      // Remove old trail points
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
  
      // Decrease lifespan
      this.lifespan -= 1;
    }
  
    display() {
    // Draw trail
    push();

    noFill();
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, this.lifespan);
      stroke(this.redGrad, this.greenGrad, this.blueGrad, alpha);
      strokeWeight(this.size);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
    pop();
  
    }
  
    isDead() {
      return this.lifespan < 0;
    }
  }
  