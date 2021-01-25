// global variables
let isPressed = false;
let width = 1;
let color = '#000000';
let drawArray = [];
let index = -1;

const startDrawing = document.getElementById('start');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const widthEl = document.getElementById('width');
const colorEl = document.getElementById('color');
const undo = document.getElementById('undo');
const clear = document.getElementById('clear');
const download = document.getElementById('download');
const print = document.getElementById('print');


// responsive canvas
const resizeCanvas = () => {
	canvas.width = window.innerWidth - (window.innerWidth * 0.1);
	canvas.height = window.innerHeight - (window.innerHeight * 0.2);
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// HTML DOM event listeners
// start button
startDrawing.addEventListener('click', () => {
    document.querySelector('.menu')
        .classList.toggle('start');
});

// pen width input
widthEl.addEventListener('input', () => {
	width = widthEl.value;
});

// color range input
colorEl.addEventListener('input', () => {
	color = colorEl.value;
});

// undo button
undo.addEventListener('click', () => {
    if (index <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawArray = [];
        index--;
    } else {
        drawArray.pop();
        index--;
        ctx.putImageData(drawArray[index], 0, 0);
    }
});

// clear button
clear.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawArray = []
    index = -1;
});

// download button
download.addEventListener('click', () => {
	const imgURL = canvas.toDataURL('image/png');
	const a = document.createElement('a');
	    
	document.body.appendChild(a);
	a.href = imgURL;
	a.download = 'my-canvas.png';
	a.click();
	document.body.removeChild(a);    
});

// print button
print.addEventListener('click', () => {
	const imgURL = canvas.toDataURL('image/png');
	const myCanvas = `
				<html>
				<head>
				    <title>My Canvas</title>
				</head>
				<body>
				    <img src="${imgURL}">
				</body>
				</html>
			    `
	const win = window.open();
	win.document.write(myCanvas);

	win.document.addEventListener('load', () => {
	win.focus();
	win.print();
	win.document.close();
	win.close();  
	}, true);
});


// start drawing
const start = (e) => {
	isPressed = true;
	ctx.beginPath();
	ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	draw(e);
};

// drawing
const draw = (e) => {
	if(isPressed) {
	drawLine(e);
	}
};

// stop drawing
const stop = (e) => {
    isPressed = false;
    drawArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index++;
};

// start drawing for mobile
const touchStart = (e) => {
	start(e.touches[0])
}

// drawing for mobile
const touchDraw = (e) => {
	draw(e.touches[0]);
}

// stop drawing for mobile
const touchStop = (e) => {
	stop(e.touches[0]);
}

// draw line function
const drawLine = (e) => {
	ctx.lineCap = 'round';
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop)
	ctx.stroke();
};

// canvas event listeners
canvas.addEventListener('mousedown', start);
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('mousemove', draw);

// canvas event listeners for mobile
canvas.addEventListener('touchmove', touchDraw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('touchend', touchStop);