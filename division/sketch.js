let pg;
let theShader;
let points = [];
let size;
let cutAmount;
let pieces = [];

let colors = [["#EBEBD3", "#3C3C3B", "#F5D547", "#DB3069", "#1446A0"], 
			  ["#1B1B1E", "#A26769", "#58A4B0", "#A9BCD0", "#D8DBE2"], 
			  ["#19323C", "#F3F7F0", "#F2545B", "#A93F55", "#8C5E58"], 
			  ["#FCF6B1", "#4B7F52", "#E3170A", "#F7B32B", "#2D1E2F"]];

let off; //a random offset for shader

function preload(){
	theShader = new p5.Shader(this.renderer, vert, frag);
}

function setup() {
	off = random(1000);

	let pal = random(colors);

    createCanvas(600, 600, WEBGL);
	background(0);
	
    pg = createGraphics(600, 600);
	
	size = pg.width*0.8;
	cutAmount = 8;

	pg.background(pal[0]);
	pg.strokeWeight(8);
	pg.stroke(pal[0]);

	/* initial four corners */
	points.push([0, 0]);
	points.push([1, 0]);
	points.push([1, 1]);
	points.push([0, 1]);

	/* cutting the cake */
	pieces.push([0, 1, 0, 1]);

	for(let i=0; i<cutAmount; i++){
		let d = floor(random(pieces.length)); //index for the dart
		let dart = pieces[d];
		
		let cut;
		let chance = random(100);
		if(chance<40){
			cut = random(dart[2], dart[3]);
			points.push([dart[0], cut]);
			points.push([dart[1], cut]);

			pieces.push([dart[0], dart[1], dart[2], cut]);
			pieces.push([dart[0], dart[1], cut, dart[3]]);

			pieces.splice(d, 1);
		}
		else if(chance<80){
			cut = random(dart[0], dart[1]);
			points.push([cut, dart[2]]);
			points.push([cut, dart[3]]);

			pieces.push([dart[0], cut, dart[2], dart[3]]);
			pieces.push([cut, dart[1], dart[2], dart[3]]);

			pieces.splice(d, 1);
		}
	}

	/* drawing the rectangles */
	for(let p=0; p<points.length; p++){
		if(points[p][0]==1 || points[p][1]==1){
			continue;
		}
		
		let ydist = 2;
		let xdist = 2;
		let b; //bottom
		let r; //right
		let c; //corner
		let foundCorner = false;
		for(let i=0; i<points.length; i++){
			if(i==p)  continue;
			if(points[i][0]==points[p][0] && abs(points[i][1]-points[p][1])<ydist && points[i][1]>points[p][1]){
				ydist = abs(points[i][1]-points[p][1]);
				b = i;
			}
			if(points[i][1]==points[p][1] && abs(points[i][0]-points[p][0])<xdist && points[i][0]>points[p][0]){
				xdist = abs(points[i][0]-points[p][0]);
				r = i;
			}
			if(typeof b!=="undefined"&&typeof r!=="undefined"){
				for(let j=0; j<points.length; j++){
					if(j==p)  continue;
					if(points[b][1]==points[j][1] && points[r][0]==points[j][0]){
						c = j;
						foundCorner = true;
					}
				}
			}
			if(foundCorner)  break;
		}

		if(foundCorner){ //straight up not draw anything if no corner is found
			pg.push();
			pg.translate(pg.width*0.1, pg.width*0.1);
			pg.fill(pal[floor(random(4))+1]);
			pg.quad(points[p][0]*size, points[p][1]*size, 
				points[r][0]*size, points[r][1]*size, 
				points[c][0]*size, points[c][1]*size, 
				points[b][0]*size, points[b][1]*size);
			pg.pop();
		}
	}
}

function draw() {
	shader(theShader);
	theShader.setUniform("noise_offset", off);
	theShader.setUniform("u_resolution", [pg.width, pg.height]);
	theShader.setUniform("u_time", millis()/1000);
	theShader.setUniform("tex0", pg);
	
	quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

const vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

void main() {
	vec4 positionVec4 = vec4(aPosition, 1.0);
	positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

	gl_Position = positionVec4;
}
`;

const frag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex0;
uniform float noise_offset;

// ripped off from the book of shaders, ill read it thoroughly tomorrow ok
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main(){
	vec2 uv = gl_FragCoord.xy/u_resolution;
	uv*=0.5;
	
	vec4 tex = texture2D(tex0,vec2(uv.x, 1.0-uv.y));
	vec3 bg = texture2D(tex0,vec2(0,0)).rgb; //the color at the most corner pixel

	float on = step(noise(uv*64.0 + noise_offset),0.95);

	vec3 col = vec3(tex.rgb);

	gl_FragColor = vec4(mix(bg, col, on), 1.0);
}`

// save jpg
let lapse = 0;    // mouse timer
function mousePressed(){
  // prevents mouse press from registering twice
  if (millis() - lapse > 400){
    save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".png");
    lapse = millis();
  }
}