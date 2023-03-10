let col = ["#f9edd4", "#fca39c", "#ee3e3e", "#fbc569", "#6163ba", "#559272"];
let col2 = ["#2C2C2C", "#dcc9bb"];

function setup() {
	w = min(windowWidth, windowHeight);
  createCanvas(w, w);
  m = width/4;
  offset = width-m;
  grid = random([4, 8, 10, 12, 15]);
  size = offset/grid;
  rectMode(CENTER);
  noLoop();
  noStroke();

  background(random(col2));
  b = random([1, 2, 3, 4, 5, 6, 10]);
  mess = random(1);
  //Main GRID
  for (let i=0; i < grid; i++) {
    for (let j=0; j < grid; j++) {
      x = size * i + m/2 + size/2;
      y = size * j + m/2 + size/2;
      if (j % b === 0) {
        fill(random(col));
      }
      if (mess <= 0.1) {
      push();
      rotate(random(0.1,-0.1));
      rect(x, y, size+1, size+1);
      pop();
      } else {
        rect(x, y, size+1, size+1);
      }
    }
  }
  
  // STRIPES
  for (let i=0; i < grid; i++) {
    for (let j=0; j < grid; j++) {
      x = size * i + m/2 + size/2;
      y = size * j + m/2 + size/2;
      if (j % b === 0) {
        fill(random(col2));
      }
      rect(x, y, size+1, size/10);
      rect(x, y+size/2, size+1, size/10);
    }
  }

   // DOTS
	dots = random(1);
	if (dots < 0.75) {
  for (let i=0; i < grid; i++) {
    for (let j=0; j < grid; j++) {
      x = size * i + m/2 + size/2;
      y = size * j + m/2 + size/2;
      if (j % b === 0) {
        fill(random(col2));
      }
      rect(x, y, size/10, size/10);
      rect(x+size/4, y, size/10, size/10);
      rect(x-size/4, y, size/10, size/10);
    }
  }

  // OFF CUTS
  cuts = random(1);
  if (cuts < 0.4) {
    for (let i=0; i < grid*2; i++) {
      for (let j=0; j < grid; j++) {
        x = size * i + m/2 + size/2;
        y = size * j + m/2 + size/2;
        if (j % b === 0) {
          fill(random(col));
        }
        push();
        rotate(random(-5, 5));
        rect(x, y, size, size/10);
        pop();
				if (dots < 0.75) {
        push();
        rotate(random(-5, 5));
        rect(x, y, size/10, size/10);
        pop();
      	}
    		}
			}
		}
	}
}