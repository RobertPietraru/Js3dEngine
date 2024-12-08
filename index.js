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
		const zproj = 8;
		const scale = 10;
		for (let i = 0; i< entity.vertices.length;i++){
			const v = entity.vertices[i];
			const xprime = v.x * (zproj/v.z), yprime= v.y * (zproj/v.z)
			console.log(xprime, yprime);
			const px = scale * (xprime - xmin) / (xmax-xmin);
			const py = scale * (yprime - ymin) / (ymax-ymin);

			if (i < 4){
				this.ctx.fillStyle = "orange";

				this.ctx.fillRect(100 + px, 100 + py, 1,1)
			} else {
				this.ctx.fillStyle = "blue";

				this.ctx.fillRect(100 + px, 100 + py, 1,1)
			}
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

	const shape = new Entity3d([
		new Point3d(-s, -s,3-s),
		new Point3d(-s,s,3-s),
		new Point3d(s,s,3-s),
		new Point3d(s,-s,3+s),
		new Point3d(-s, -s,3+s),
		new Point3d(-s,s, 3+s),
		new Point3d(s,s,3+s),
		new Point3d(s,-s,3+s),
	]);
	shape.goto(0,5,0);
	const engine = new Engine(ctx, base_element.width, base_element.height);
	engine.render(shape);

	//shape.goto(shape.x, shape.y, shape.z);
	//await delay(1);
	//console.log("WHY");
}
