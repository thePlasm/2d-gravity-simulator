//Canvas initialisation
var canvas = document.getElementById("canvas");
canvas.width = Math.floor((window.innerWidth-80)/16)*16;
canvas.height = Math.floor((window.innerHeight-80)/16)*16;
var ctx = canvas.getContext("2d");
var fps = 80;
var delta = [0, 0];
var r = 0;
var acc = 0;
var unitv = [0, 0];
var mousePos = {x: 0, y: 0};
var oldMousePos = {x: 0, y: 0};
var colid = 0;
var restitution = 0.5;
var entities = [ 
];
function updateRestitution() {
	restitution = Number(document.getElementById('restitutioninput').value);
}
function getMousePos(evt) {
    return {
        x: evt.clientX - (window.innerWidth - canvas.width)/2,
        y: evt.clientY - (window.innerWidth - canvas.width) + 48
    };
}
canvas.addEventListener('mousemove', function(evt) {
    mousePos = getMousePos(evt);
}, false);
canvas.addEventListener('mousedown', function(evt) {
    oldMousePos = getMousePos(evt);
}, false);
canvas.addEventListener('mouseup', function() {
	if (mousePos.x >= Number(document.getElementById('radiusinput').value) && mousePos.y >= Number(document.getElementById('radiusinput').value) && mousePos.x <= (canvas.width - Number(document.getElementById('radiusinput').value)) && mousePos.y <= (canvas.height - Number(document.getElementById('radiusinput').value)) && testCol(document.getElementById('radiusinput').value, mousePos.x, mousePos.y) && !isNaN(+(document.getElementById('massinput').value)) && !isNaN(+(document.getElementById('radiusinput').value))) {
		entities.push([[mousePos.x, mousePos.y], [(oldMousePos.x-mousePos.x)/fps, (oldMousePos.y-mousePos.y)/fps], +(document.getElementById('massinput').value), +(document.getElementById('radiusinput').value)]);
	}
}, false);
function testCol(id, x, y) {
	for (var d = 0; d < entities.length; d++) {
		if ((typeof id) == 'number') {
			if (d != id && id > -1) {
				if (Math.abs(Math.sqrt(Math.pow(entities[d][0][0] - x, 2) + Math.pow(entities[d][0][1] - y, 2))) < (entities[d][3] + entities[id][3])) {
					return false;
				}
			}
		}
		if ((typeof id) == 'string') {
			if (Math.abs(Math.sqrt(Math.pow(entities[d][0][0] - x, 2) + Math.pow(entities[d][0][1] - y, 2))) < (entities[d][3] + Number(id))) {
				return false;
			}
		}
	}
	return true;
}
function findCol(id, x, y) {
	for (var e = 0; e < entities.length; e++) {
		if (e != id && id > -1) {
			if (Math.abs(Math.sqrt(Math.pow(entities[e][0][0] - x, 2) + Math.pow(entities[e][0][1] - y, 2))) < (entities[e][3] + entities[id][3])) {
				return e;
			}
		}
	}
	return true;
}
function update() {
	for (var a = 0; a < entities.length; a++) {
		for (var b = 0; b < entities.length; b++) {
			if (a != b) {
				delta[0] = entities[b][0][0] - entities[a][0][0];
				delta[1] = entities[b][0][1] - entities[a][0][1];
				r = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
				acc = Math.pow(10, -11) * 6.67 * (entities[b][2] / Math.pow(r, 2));
				unitv[0] = delta[0] / r;
				unitv[1] = delta[1] / r;
				entities[a][1][0] += (acc * unitv[0]) / fps;
				entities[a][1][1] += (acc * unitv[1]) / fps;
			}
		}
		if ((entities[a][0][0] + entities[a][1][0] >= 5) && (entities[a][0][1] + entities[a][1][1] >= 5) && (entities[a][0][0] + entities[a][1][0] <= canvas.width-5) && (entities[a][0][1] + entities[a][1][1] <= canvas.height-5) && testCol(a, entities[a][0][0] + entities[a][1][0], entities[a][0][1] + entities[a][1][1])) {
			entities[a][0][0] += entities[a][1][0];
			entities[a][0][1] += entities[a][1][1];
		}
		else {
			if ((entities[a][0][0] + entities[a][1][0]) < entities[a][3]) {
				console.log(1);
				entities[a][0][0] = entities[a][3];
				entities[a][1][0] = -restitution * entities[a][1][0];
			}
			if ((entities[a][0][1] + entities[a][1][1]) < entities[a][3]) {
				entities[a][0][1] = entities[a][3];
				entities[a][1][1] = -restitution * entities[a][1][1];
			}
			if ((entities[a][0][0] + entities[a][1][0]) > (canvas.width-entities[a][3])) {
				entities[a][0][0] = canvas.width-entities[a][3];
				entities[a][1][0] = -restitution * entities[a][1][0];
			}
			if ((entities[a][0][1] + entities[a][1][1]) > (canvas.height-entities[a][3])) {
				entities[a][0][1] = canvas.height-entities[a][3];
				entities[a][1][1] = -restitution * entities[a][1][1];
			}
			if (!testCol(a, entities[a][0][0] + entities[a][1][0], entities[a][0][1] + entities[a][1][1])) {
				colid = findCol(a, entities[a][0][0] + entities[a][1][0], entities[a][0][1] + entities[a][1][1]);
				if (entities[a][2] == entities[colid][2]) {
					entities[colid][1][0] += entities[a][1][0];
					entities[colid][1][1] += entities[a][1][1];
					entities[a][1][0] = 0;
					entities[a][1][1] = 0;
				}
				if (entities[a][2] > entities[colid][2]) {
					entities[colid][1][0] = 2 * entities[a][1][0];
					entities[colid][1][1] = 2 * entities[a][1][1];
				}
				if (entities[a][2] < entities[colid][2]) {
					entities[a][1][0] = -1 * entities[a][1][0];
					entities[a][1][1] = -1 * entities[a][1][1];
				}
				entities[a][0][0] += entities[a][1][0];
				entities[a][0][1] += entities[a][1][1];
				entities[colid][0][0] += entities[colid][1][0];
				entities[colid][0][1] += entities[colid][1][1];
			}
			else {
				entities[a][0][0] += entities[a][1][0];
				entities[a][0][1] += entities[a][1][1];
			}
		}
	}
}
function draw() {
	ctx.fillStyle="#FFFFFF";
	ctx.fillRect(0, 0 , canvas.width, canvas.height);
	for (var c = 0; c < entities.length; c++) {
		ctx.beginPath();
		ctx.arc(entities[c][0][0], entities[c][0][1], entities[c][3], 0, 2 * Math.PI);
		ctx.stroke();
	}
}

setInterval(function() {
	update();
	draw();
}, 1000/fps);