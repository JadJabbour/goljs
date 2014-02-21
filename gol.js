//defining the game of life namespace
var gol = {
	field: null,
	cells: 0,
	age: 0,
	period: 0,
	generations: null,
	container: null,
	genCount: null,
	ticker: null
};

//initializes the gol matrix and its period
gol.init = function (_cols, _rows, _period, _container, _genCounter){
	gol.field = new Array(_cols);
	for (var i = 0; i < _cols; i++) {
		gol.field[i] = new Array(_rows);
	}
	gol.cells = _cols * _rows;
	gol.period = _period;
	gol.resetField();
	gol.generations = [];
	gol.container = $('#' + _container);
	gol.genCount = $('#' + _genCounter);
	return this;
};

//resets the field matrix
gol.resetField = function(){
	for(var i = 0 ; i < gol.field.length ; i++){
		for(var j = 0 ; j < gol.field[i].length ; j++){
			gol.field[i][j] = 0;
		}
	}
};

//creates a random t=0 setup
gol.randomizeT0 = function (_liveCells){
	while(_liveCells >= 0){
		var x = Math.floor(Math.random() * (gol.field.length - 1));
		var y = Math.floor(Math.random() * (gol.field[0].length - 1));
		if(gol.field[x][y] == 0){
			_liveCells--;
			gol.field[x][y] = 1;
		} 
	}
	gol.printGeneration();
	gol.drawGeneration();
};

//set T0 using an array of coordinates of live cells
gol.setT0 = function(a){
	var x;
	var y;
	for(var i = 0 ; i < a.length ; i++){
		x = a[i].split('.')[0];
		y = a[i].split('.')[1];
		gol.field[x][y] = 1;
	}
	gol.printGeneration();
	gol.drawGeneration();
};

//gets live neighbors
gol.numberOfLiveNeighbors = function (_x, _y){
	var numOfNeighbors = 0;
	var x = 0;
	var y = 0;

	for(var i = -1 ; i <= 1 ; i++){
		for(var j = -1 ; j <= 1 ; j++){
			if(i == 0 && j == 0){
				continue;
			}
			x = _x + i;
			y = _y + j;
			(x > -1 && x < gol.field.length) && (y > -1 && y < gol.field[x].length) ? numOfNeighbors += gol.field[x][y] : numOfNeighbors += 0;
			x = 0;
			y = 0;
		}
	}
	return numOfNeighbors;
};

gol.nextGeneration = function(){
	gol.generations.push(gol.field);
	var liveNeighbors = 0;
	var switches = 0;
	for(var i = 0 ; i < gol.field.length ; i++){
		for(var j = 0 ; j < gol.field[i].length ; j++){
			liveNeighbors = gol.numberOfLiveNeighbors(i, j);
			if((gol.field[i][j] === 0) && (liveNeighbors === 3)){
				gol.switchCellState(i, j);
				switches++;
			}
			else{
				if((gol.field[i][j] === 1) && (liveNeighbors < 2 )){
					gol.switchCellState(i, j);
					switches++;
				}

				if((gol.field[i][j] === 1) && (liveNeighbors > 3)){
					gol.switchCellState(i, j);
					switches++;
				}
			}
		}
	}
	if(switches == 0){
		gol.pause();
	}
	gol.printGeneration();
	gol.drawGeneration();
	gol.genCount.html(gol.generations.length);
};

gol.switchCellState = function(_x, _y){
	gol.field[_x][_y] = gol.field[_x][_y] == 0 ? 1 : 0;
};

//prints the matrix field
gol.printGeneration = function(){
	var row;
	for(var i = 0 ; i < gol.field.length ; i++){
		row = '';
		for(var j = 0 ; j < gol.field[i].length ; j++){
			row += gol.field[i][j] + ' ';
		}
		console.log(row);
	}
};

gol.drawGeneration = function (){
	var html = "<table cellspacing='0' cellpadding='0' border='1'>";
	for(var i = 0 ; i < gol.field.length ; i++){
		html += "<tr>";
		for(var j = 0 ; j < gol.field[i].length ; j++){
			html += "<td style='width:20px;height:20px;";
			html += gol.field[i][j] == 1 ? "background-color:red;'" : "'";
			html += ">&nbsp;</td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	gol.container.empty();
	gol.container.html(html);
};

gol.launchTime = function(){
	gol.ticker = setInterval(function (){ gol.nextGeneration(); }, gol.period);
};

gol.pause = function(){
	clearInterval(gol.ticker);
};