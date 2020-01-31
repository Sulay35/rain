
// Canvas settings :
var canvas = document.querySelector("canvas");
function windowResize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight; 
}
setInterval(windowResize,10)
var c = canvas.getContext('2d');

var centery = window.innerHeight/2;
var centerx = window.innerWidth/2;

var num = 1;
var gouttes = 1;
var circleArray = [];
var sparksArray = [];

// Functions :
function random_int(min, max){
    return Math.floor(Math.random()*(max-min+1) + min);
}

function random_float(min, max){
	return Math.random()*(max-min+1) + min;
}

// Sparks 
class Sparks {
	constructor(x, y, dx, dy, radius) {
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.dx = dx;
        this.dy = dy;
        this.gravity = 0.5;
		this.gravitySpeed = 1;

		
		this.draw = function () {
			c.fillStyle = "#0099ff";
			c.beginPath();
			
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.fill();
			
		};
		this.update = function () {
			if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
				this.dx = -0.2*this.dx;
			}
			if (this.y + this.radius >= innerHeight) {
				this.dy = -this.dy;
            }
            this.gravitySpeed += this.gravity;
			this.x += this.dx;
			this.y += this.dy + this.gravitySpeed;
			
			this.draw();
		};
	}
}


// Drops
class Drop {
	constructor(x, y, dx, dy, radius) {
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.dx = dx;
        this.dy = dy;
        this.gravity = 0.05;
		this.gravitySpeed = 0;
		

		this.hasExploded = false;
		// Explode into sparks
		this.explode = function(){
			for (var i = 0; i< random_int(3,12); i++){
				let YSparksspeed = random_float(-10,-4);
				let XSparksspeed = random_float(-3,3);
				sparksArray.push(new Sparks(this.x ,this.y ,XSparksspeed,YSparksspeed,this.radius*0.45));
			}
			this.hasExploded = true;
		}
		
		this.draw = function () {
			c.fillStyle = "#0099ff";
			c.beginPath();
			
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.strokeStyle = '#4190B3';
			c.fill();
			c.stroke();
		};
		this.update = function () {

			// If the drop has touched the borders
			if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
				this.dx = -0.2*this.dx;

				if (!this.hasExploded){
					for (var i = 0; i< 3; i++){
						sparksArray.push(new Sparks(this.x ,this.y ,-5 ,0.2,this.radius*0.45));
					}
					this.hasExploded = true
				}
			}

			// If the drop has touched the ground
			if (this.y + this.radius >= innerHeight-5) {
				this.dy = -this.dy;

				if (!this.hasExploded){
					this.explode();
				}
			}

            this.gravitySpeed += this.gravity;
			this.x += this.dx;
			this.y += this.dy + this.gravitySpeed;
		
			this.draw();
		};
	}
}

function rain(){
    for(var i =0; i<num;i++){
        var radius = 5;
        //var x = Math.random()*((innerWidth/2+20)-(innerWidth/2-20))+(innerWidth/2-20) ;
        var x = Math.random()*(innerWidth-5)-5
        var y = Math.random()*(-50+3)+3;
        var dx = Math.random()*0.7;
        var dy = Math.random()*(5-2)+2;
        
        circleArray.push(new Drop(x ,y ,dx ,dy ,radius ));
        
    }
    
    num += gouttes;
    //console.log(num);
    if(num>=50){
        gouttes = -1
	}
	if(num <= -5 ){
		gouttes = 1;
	}
}

// Add drop with click and drag
var longpress = false;
var mouseX = 0;
var mouseY = 0;
canvas.addEventListener('mousedown', (event) => {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
	longpress = true;
});

// wheel control size :
canvas.addEventListener('wheel', (event) => {
	var size = Math.min(Math.max(.125, event.deltaY),-0.125);
	console.log('SIZE : ', size)
})

canvas.addEventListener('mouseup', (event) => {
	longpress = false;
})

//setInterval(rain,500)

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);

	for(var i = 0; i< circleArray.length ;i++){
		
		if(circleArray[i].hasExploded){
			circleArray.splice(i,1);
		}
		if(circleArray[i].y >= innerHeight){
			circleArray.splice(i, 1);
		}
		else{
			circleArray[i].update();
		}
	}
	
	for(var i = 0; i < sparksArray.length; i++){
		if(sparksArray[i].y >= innerHeight){
			sparksArray.splice(i, 1);
		}else{
			sparksArray[i].update();
		}
		
	}

	if(longpress){
		// drag and drop drops
		canvas.addEventListener('mousemove', (event) => {
			mouseX = event.offsetX;
			mouseY = event.offsetY;
		})
		for (var i = 0; i < 2; i++){
			var dx = random_float(-0.1,0.1);
			var dy = random_float(-0.5,0.5)
			circleArray.push(new Drop(mouseX, mouseY, dx, dy, 2))
		}
	}

	
}

animate();