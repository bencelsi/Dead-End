(function(){
	var BOX_WIDTH = 600;
	var power = false;
	var img;
	var imgs;
	var screen;
	var newimg;
	var clear = false;
	var frame = 0;
	var json =
{frames: [
		{//0
			forward: 1
		},{//1
			left: 7, right: 3, forward: 15
		},{//2
			left: 7, right: 3, forward: 15
		},{//3
			left: 1, right: 4, forward: 8
		},{//4
			left: 3, right: 5
		},{//5
			left: 4, right: 6
		},{//6
			left: 5, right: 7,
		},{//7
			left: 6, right: 1,
		},{//8
			left: 11, right: 9,
		},{//9
			left: 8, right: 10,
		},{//10
			left: 9, right: 11, forward: 6
		},{//11
			left: 10, right: 8,
			boxes: [
				{	pos: [25, 300, 150, 450],
					cursor: "z",
					action: "frame = 14;"	
				}
			]
		},{//12
			left: 10, right: 8, back: 11,
		},{//13
		},{
			left: 10, right: 8, back: 11,
			boxes: [
				{	if: "!power", 
					pos: [250, 300, 100, 100],
					cursor: "m",
					action: "power = true;"	
				},
				{	if: "power", 
					img: "x12",
					action: ""
				}
			]
		},{//15
			left: 23, right: 20
		},{//16
			left: 23, right: 20
		},{//17
			left: 16, right: 18, forward: 13
		},{//18
			left: 17, right: 19
		},{//19
			left: 18, right: 16
		},{//20
			left: 15, right: 22
		},{//21
			left: 15, right: 22
		},{//22
			left: 20, right: 23, forward: 5
		},{//23
			left: 22, right: 15
		},{//24
			left: 22, right: 15
		}
	]
}

	window.onload = function(){
		img = getById("img");
		imgs = getById("imgs");
		screen = getById("screen");
		imgs.style.left = "0px";
		getById("current").style.opacity = 1.0;
		importImages();
		updateBoxes();
		clear = true;
	};

	function importImages(){
		for (var i = 0; i < 10; i++) {
			var preload = new Image();
			preload.src = "der/DER100" + correctFrame(i) + ".png";
			getById("preloads").appendChild(preload);
		}
	}

	function boxClick(){
		if (clear) {
			clear = false;
			var tBox = document.createElement("div"); //top box covers everything to dictate cursor
			tBox.id = "tBox";
			//getById("screen").appendChild(tBox);
		
			eval(this.getAttribute("name")); //sets the new frame. very insecure- maybe include array of actions? or create virtual box on server with all properties
			frame = correctFrame(frame);

			preloadHTML = getById("preloads").innerHTML;
			wait = 100;
			if(!preloadHTML.includes("der/DER100" + frame + ".png")){
				var preload = new Image();
				preload.src = "der/DER100" + frame + ".png";
				getById("preloads").removeChild(getById("preloads").firstChild);
				getById("preloads").appendChild(preload);
				wait = 350;
			}
		
			newimg = document.createElement("img");
			newimg.id = "newimg";
			newimg.src = "der/DER100" + frame + ".png";
			updateBoxes();
			
			if (this.id == "lBox" || this.id == "rBox") {
				if (this.id === "lBox"){
					newimg.style.left = "-600px";
				} else {
					newimg.style.left = "600px";
				}
				getById("new").appendChild(newimg);
				img.style.left = "0px";
				setTimeout(swipeStep, wait);
			} else {
				getById("new").appendChild(newimg);
				setTimeout(fadeStep, wait+50);
			}
		}
	}

	function correctFrame(currentFrame){
		if (power){
			var powerFrames = [1, 15, 20, 23];
			for (var i = 0; i < powerFrames.length; i++){
				if (currentFrame == powerFrames[i]){
					return(currentFrame + 1);
				}
			}
		}
		return(currentFrame);
	}

	function swipeStep(){
		var xPos = parseInt(imgs.style.left);
		//imgs.style.left = xPos + 10 + "px";
		//alert(parseInt(newimg.style.left));
		if (Math.abs(xPos) == 600) {
			imgs.removeChild(getById("current"))
			getById("new").id = "current";
			getById("current").style.opacity = 1.0;
			img = newimg;
			img.id = "img";
			imgs.style.left = "0px";
			img.style.left = "0px";
			var newDiv = document.createElement("div");
			newDiv.id = "new";
			imgs.appendChild(newDiv);
			//updateBoxes();
			clear = true;
		} else if (parseInt(newimg.style.left) > 0) {
			imgs.style.left = xPos - 10 + "px";
			//newimg.style.left = xPos - 10 + "px";
		} else {
			imgs.style.left = xPos + 10 + "px";
			//newimg.style.left = xPos + 10 + "px";
		}
		if (!clear) {
			setTimeout(swipeStep, 5);
		}
	}

	function fadeStep(){
		var opacity = getById("current").style.opacity;
		if (opacity == 0) {
			imgs.removeChild(getById("current"));
			getById("new").id = "current";
			getById("current").style.opacity = 1.0;
			img = newimg;
			img.id = "img";
			var newDiv = document.createElement("div");
			newDiv.id = "new";
			imgs.appendChild(newDiv);
			//updateBoxes();
			clear = true;
		} else {
			getById("current").style.opacity = "" + opacity - .05;
			newimg.style.opacity = 1.0;
		}
		if (!clear) {
			setTimeout(fadeStep, 10);
		}
	}

	//clears and updates the clickable boxes based on the current frame
	function updateBoxes() {
		getById("setBoxes").innerHTML = "";
		getById("customBoxes").innerHTML = "";
		var frameData = json.frames[frame];
		if (frameData.left != null) {
			makeBox("left", frameData.left);
		}
		if (frameData.right != null) {
			makeBox("right", frameData.right);
		}
		if (frameData.forward != null) {
			makeBox("forward", frameData.forward);
		}
		if (frameData.back != null) {
			makeBox("back", frameData.back);
		}
		if (frameData.boxes != null){
			for (var i = 0; i < frameData.boxes.length; i++) {
				if (frameData.boxes[i].if == null || eval(frameData.boxes[i].if)){
					if (frameData.boxes[i].action != null){
						makeBox(frameData.boxes[i], frameData.boxes[i].action);
					} else {
						makeBox(frameData.boxes[i], null);
					}
				}
			}
		}
	}

	//makes either a custom or pre-determined box
	function makeBox(info, action) {
		var box = document.createElement("div");
		box.className = "box";
		box.onclick = boxClick;
		if (typeof info === "string") {									//preset boxes
			box.id = info.substring(0,1) + "Box";
			box.classList.add(info.substring(0,1) + "Cursor");
			box.setAttribute("name", "frame = " + action + ";");
			getById("setBoxes").appendChild(box);
		} else {																	//custom boxes
			box.setAttribute("name", action);
			if (info.pos != null) {
				box.style.left = info.pos[0] + "px";
				box.style.top = info.pos[1] + "px";
				box.style.width = info.pos[2] + "px";
				box.style.height = info.pos[3] + "px";
			}
			if (info.cursor != null) {
				box.classList.add(info.cursor + "Cursor");
			}
			if (info.img != null) {											//pic boxes
				var pic = document.createElement("img");
				pic.classList.add("pBox");
				pic.src = "der/DER100" + info.img + ".png";
				getById("new").appendChild(pic);
			}
			getById("customBoxes").appendChild(box);
		}
	}

	function getById(id) {
		return document.getElementById(id);
	}
})();