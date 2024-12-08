var cx = 3;
var cz = 3;
var cy = 3;
function rx(a) {

	return [
		[1,	0,	0],
		[0,	Math.cos(a),	-Math.sin(a)],
		[0, 	Math.sin(a), 	Math.cos(a)]
	];
}

function ry(a) {
	return [
		[Math.cos(a),	0,	Math.sin(a)],
		[0,	1,	0],
		[-Math.sin(a), 	0, 	Math.cos(a)]
	];
}

function rz(a) {
	return [
		[Math.cos(a),	-Math.sin(a),	0],
		[Math.sin(a),	Math.cos(a),	0],
		[0, 	0, 	1]
	];
}
 
class Point3d {
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
class Point2d {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

class Engine {
	constructor(ctx, width, height){
		this.ctx = ctx;
		this.width = width;
		this.height = height;

	}

	render(entity){
		const xmax = 0.5, xmin = -0.5, ymax = 0.5, ymin = -0.5;
		const zproj = -10;
		const scale = 50;
		const translation  = 400;
		/// projected vertices
		const pv = entity.vertices.map((v) => {
			const xprime = v.x * (zproj/v.z), yprime= v.y * (zproj/v.z)
			console.log(xprime, yprime);
			const px = scale * (xprime - xmin) / (xmax-xmin);
			const py = scale * (yprime - ymin) / (ymax-ymin);
			return {
				x: px,
				y: py,
			};
		});
		for (let i = 0; i <pv.length ; i++){
			const px = pv[i].x;
			const py = pv[i].y;
			if (i < 4){
				this.ctx.fillStyle = "red";

				this.ctx.fillRect(translation + px, translation + py, 1,1)
			} else {
				this.ctx.fillStyle = "green";

				this.ctx.fillRect(translation + px, translation + py, 1,1)
			}
		}

		this.ctx.beginPath();

		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 2;
		for (let i = 0; i < entity.edges.length;i++){
			const edge = entity.edges[i];
			const x1 = translation + pv[edge[0]].x;
			const y1 = translation + pv[edge[0]].y;

			const x2 = translation + pv[edge[1]].x;
			const y2 = translation + pv[edge[1]].y;

			//console.log("drawing edge from", x1, y2, "to", x2, y2);
			this.ctx.moveTo(x1,y1);
			this.ctx.lineTo(x2,y2);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}
	rotateY(entity, angle) {

	}

	clear(){
		this.ctx.clearRect(0,0,this.width, this.height);


	}

}

class Entity3d {
	constructor(vertices, edges) {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.vertices = vertices;
		this.edges = edges;
	}
	goto(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

function delay(time){
	return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * This is the starting point of the engine
 * @constructor
 * @param {HTMLCanvasElement} base_element - it's the html element in which the scene is rendered*/
async function render_scene(base_element){
	if (!(typeof base_element === 'object' && base_element.constructor.name == 'HTMLCanvasElement')) {
		throw Error(`You have to provide a canvas, this is a "${typeof base_element}" with "${base_element.constructor.name}" `);
	}
	if (!base_element.getContext){
		throw Error(`Can't get canvas context`);
	}

	const ctx = base_element.getContext("2d");
	const s = 0.5;

	
	const engine = new Engine(ctx, base_element.width, base_element.height);
	while (true) {
		const shape = new Entity3d([
		/// back face counter clockwise
		new Point3d(cx-s,cy-s, cz-s),
		new Point3d(cx+s,cy-s, cz-s),
		new Point3d(cx+s,cy+s, cz-s),
		new Point3d(cx-s,cy+s, cz-s),
		/// front face counter clockwise
		new Point3d(cx-s,cy+s, cz+s),
		new Point3d(cx+s,cy+s, cz+s),
		new Point3d(cx+s,cy-s, cz+s),
		new Point3d(cx-s,cy-s, cz+s),
	], [
		/// connections inside the back face
		[0,1],
		[1,2],
		[2,3],
		[0,3],


		/// connections inside the front face
		[4+0,4+1],
		[4+1,4+2],
		[4+2,4+3],
		[4+0,4+3],

		/// connections between the 2 edges
		[0, 7-0],
		[1, 7-1],
		[2, 7-2],
		[3, 7-3],
	]);
		engine.render(shape);
		await delay(1);
		engine.clear();

	}

}

document.onkeypress = function (e){
}

document.addEventListener("keydown", function onEvent(event) {
	const w = 'w';
	const a = 'a';
	const s = 's';
	const d = 'd';
	const e2 = 'e';
	const q = 'q';
	const diff = 0.1;
	console.log(event.key);
	switch(event.key){
		case e2:
			cy+=diff;
			break;
		case q:
			cy-=diff;
			break;
		case w:
			cz+=diff;
			break;
		case a:
			cx+=diff;
			break;
		case s:
			cz-=diff;
			break;
		case d:
			cx-=diff;
			break;
	}

});
