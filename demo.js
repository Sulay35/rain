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
class Circle {
	constructor(x, y, dx, dy, radius) {
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.dx = dx;
        this.dy = dy;
        this.gravity = 0.05;
		this.gravitySpeed = 0;
		
		this.draw = function () {
			c.fillStyle = "#0099ff";
			c.beginPath();
			
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.strokeStyle = '#384f94';
			c.fill();
			c.stroke();
		};
		this.update = function () {
			if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
				this.dx = -this.dx;
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

var circleArray = [];
function rain(){
    for(var i =0; i<num;i++){
        var radius = 2;
        //var x = Math.random()*((innerWidth/2+20)-(innerWidth/2-20))+(innerWidth/2-20) ;
        var x = Math.random()*(innerWidth-5)-5
        var y = Math.random()*(-50+3)+3;
        var dx = Math.random()*0.1;
        var dy = Math.random()*(5-2)+2;
        
        circleArray.push(new Circle(x ,y ,dx ,dy ,radius ));
        
    }
    
    num += gouttes;
    console.log(num);
    if(num>=50){
        gouttes = -1
	}
	if(num <= -5 ){
		gouttes = 1;
	}
}

setInterval(rain,500)

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);

	for(var i = 0; i< circleArray.length ;i++){
		circleArray[i].update();
	}

	
}

animate();