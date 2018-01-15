function Tutorial(){
	this.steps = [];
	this.step_types = [];

	this.addWindow = function(title, x, y, w, h){
		this.steps = append(this.steps, new p5Window(title, x, y, w, h));
		this.step_types = append(this.step_types, 0);
	}

	this.addText = function(t){
		this.steps[this.steps.length - 1].setText(t);
	}

	this.addButton = function(label, x, y, w, h, listener){
		this.steps[this.steps.length - 1].addButton(label, x, y, w, h, listener);
	}

	this.addAction = function(listener){
		this.steps = append(this.steps, listener);
		this.step_types = append(this.step_types, 1);
	}
}