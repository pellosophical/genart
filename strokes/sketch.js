let amp = 15;
let rough = 3;
let freq = 0.8;

let dv = [4, 8];
let step = [];

let sw = [5, 20]; //stroke widthS, there's two, the original work is probably done with chiseled pen

let palettes = [
	["#0c2046", "#fffaf2", "#f67e7d"],
	["#42033D", "#680E4B", "#7C238C"],
	["#586BA4", "#324376", "#F5DD90"],
	["#46351D", "#646F4B", "#839D9A"],
];
let pal;
function setup() {
	pal = random(palettes);
	shuffle(pal, true);
	
	createCanvas(400, 600);
	noLoop();
	
	step.push(width/dv[0]);step.push(height/dv[1]);
	
	noStroke();
}

function draw() {
	background(pal[0]);
	
	translate(step[0]/2, step[1]/2);
	
	for(let x=-1; x<dv[0]; x++){
		for(let y=-1; y<dv[1]; y++){
			if((x+1)%2==(y+1)%2){ //checker board pattern can be made with if(x%2==y%2), so (0,4) would have different color from (1, 2)
				fill(pal[1]);    //but I had to +1 here because -1%2 and 1%2 don't equal despite the checkerboard pattern needing them to
				wigglyCluster(x*step[0], y*step[1]);
			}
		}
	}
	//I wanted one of the color to be on top of the other
	for(let x=-1; x<dv[0]; x++){
		for(let y=-1; y<dv[1]; y++){
			if((x+1)%2!=(y+1)%2){
				let off = step[0]/12;
				fill(pal[2]);
				wigglyCluster(x*step[0]+off, y*step[1]+off);
			}
		}
	}
}

function wigglyCluster(x, y){
	let i = y;
	while(i<y+step[1]-sw[0]){
		let thiccness = random(sw);
		
		wigglyRect(x, i, x+step[0], i+thiccness, i+x);
		
		i+=thiccness+amp/2;
	}
}

function wigglyRect(x1, y1, x2, y2, off=0){ //top left and bottom right corners
	let xlen = x2-x1; let ylen = y2-y1;
	beginShape();
	for(let i=x1+rough; i<x2-rough; i+=rough) vertex(i+noise(off+(i/xlen)*freq)*amp, y1+noise(off+50+(i/xlen)*freq)*amp);//top
	for(let i=y1+rough; i<y2-rough; i+=rough) vertex(x2+noise(off+(i/ylen)*freq)*amp, i+noise(off+200+(i/ylen)*freq)*amp);//right
	for(let i=x2-rough; i>x1+rough; i-=rough) vertex(i+noise(off+(i/xlen)*freq)*amp, y2+noise(off+50+(i/xlen)*freq)*amp);//bottom
	for(let i=y2-rough; i>y1+rough; i-=rough) vertex(x1+noise(off+(i/ylen)*freq)*amp, i+noise(off+200+(i/ylen)*freq)*amp);//left
	endShape(CLOSE);
}
// save jpg
let lapse = 0;    // mouse timer
function mousePressed(){
  // prevents mouse press from registering twice
  if (millis() - lapse > 400){
    save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".png");
    lapse = millis();
  }
}