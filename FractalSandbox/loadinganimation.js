function LoadingAnimation(){
	this.angle = 0;

	this.show = function(){
		push();
			var d = pixelDensity();
			var y_dim = windowHeight;
			var x_dim = (intro_image.width * y_dim) / intro_image.height;
			imageMode(CENTER);
			image(intro_image, windowWidth / 2, windowHeight / 2, x_dim, y_dim);

			resetMatrix();
			translate(windowWidth / 2, windowHeight / 2 + 100);
			rotate(this.angle);
			imageMode(CENTER);
			image(load_icon, 0, 0, 200, 200);
			this.angle += 0.04;
		pop();
	}
}