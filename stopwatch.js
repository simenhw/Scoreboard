//	Simple example of using private variables
//
//	To start the stopwatch:
//		obj.start();
//
//	To get the duration in milliseconds without pausing / resuming:
//		var	x = obj.time();
//
//	To pause the stopwatch:
//		var	x = obj.stop();	// Result is duration in milliseconds
//
//	To resume a paused stopwatch
//		var	x = obj.start();	// Result is duration in milliseconds
//
//	To reset a paused stopwatch
//		obj.stop();
//
var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds

		var	now	= function() {
				return (new Date()).getTime();
			};

		// Public methods
		// Start or resume
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0);
			};
	};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	document.getElementById("sortTime").style.display = "none";
	document.getElementById("sortPoints").style.display = "none";
	update();
}

function update() {
	$time.innerHTML = formatTime(x.time());
}
var timerRunning = 0;
function start() {
	clocktimer = setInterval("update()", 10);
	x.start();
	timerRunning = 1;
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
	timerRunning = 0;
	document.getElementById("sortTime").style.display = "inline-block";
	document.getElementById("sortPoints").style.display = "inline-block";
}

function reset() {
	stop();
	x.reset();
	update();
}


var tableRows = 0;
function addRowToTable() {
	var totalTime = formatTime(parseInt(document.getElementById("penaltyTotal").innerHTML)*1000 + x.time());
	// Find a <table> element with id="myTable":
	var table = document.getElementById("results");

	// Create an empty <tr> element and add it to the 1st position of the table:
  	var row = table.insertRow(1+tableRows);

  	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  	var placeCell = row.insertCell(0);
  	var nameCell = row.insertCell(1);
	var pointCell = row.insertCell(2);
	var totalCell = row.insertCell(3);
	var timeCell = row.insertCell(4);
	var penaltyCell = row.insertCell(5);
	var orderCell = row.insertCell(6);
  	// Add some text to the new cells:
  	timeCell.innerHTML = $time.innerHTML;
	penaltyCell.innerHTML = document.getElementById("penaltyTotal").innerHTML + "s";
  	nameCell.innerHTML = document.getElementById("name").innerHTML;
	totalCell.innerHTML = totalTime;
	pointCell.innerHTML = document.getElementById("points").innerHTML;
	orderCell.innerHTML = tableRows+1;
 tableRows++;
}

function addPlace(timeOrPoints){
	var table = document.getElementById("results");
	rows = table.getElementsByTagName("TR");
	/*Loop through all table rows (except the
	first, which contains table headers):*/
	var place = 1;
	for (i = 1; i < (rows.length - 1); i++) {
		var sortCol = 2;
		if(timeOrPoints == "time") sortCol = 3;
		now = rows[i].getElementsByTagName("TD")[sortCol];
		next = rows[i + 1].getElementsByTagName("TD")[sortCol];
		rows[i].getElementsByTagName("TD")[0].innerHTML = place;
		place++;
		if(now.innerHTML==next.innerHTML) place--;
	}
	rows[rows.length-1].getElementsByTagName("TD")[0].innerHTML = place;
}

function sortTime() {
	document.getElementById("sortTime").blur();
	sortTable("time");
}
function sortPoints() {
	document.getElementById("sortPoints").blur();
	sortTable("points");
}
function sortTable(timeOrPoints) {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("results");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
		//start by saying: no switching is done:
		switching = false;
		rows = table.getElementsByTagName("TR");
		/*Loop through all table rows (except the
		first, which contains table headers):*/
		for (i = 1; i < (rows.length - 1); i++) {
			//start by saying there should be no switching:
			shouldSwitch = false;
			/*Get the two elements you want to compare,
			one from current row and one from the next:*/
			var sortCol = 2;
			if(timeOrPoints == "time") sortCol = 3;
			x = rows[i].getElementsByTagName("TD")[sortCol];
			y = rows[i + 1].getElementsByTagName("TD")[sortCol];
			//check if the two rows should switch place:
			var compareResult = x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase();
			if(timeOrPoints == "points") compareResult = parseInt(x.innerHTML) < parseInt(y.innerHTML);
			if (compareResult) {
				//if so, mark as a switch and break the loop:
				shouldSwitch= true;
				break;
			}
		}
		if (shouldSwitch) {
			/*If a switch has been marked, make the switch
			and mark that a switch has been done:*/
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
	addPlace(timeOrPoints);
}


document.addEventListener("keydown", function(event) {

if(event.which>=64){ //LETTERS
	if(event.which==222) document.getElementById("name").innerHTML += "Æ";
	else if(event.which==186) document.getElementById("name").innerHTML += "Ø";
	else if(event.which==219) document.getElementById("name").innerHTML += "Å";
	else document.getElementById("name").innerHTML += String.fromCharCode(event.which);
	console.log(event.which);
}else if(event.which==8 ){ // BACKSPACE
	document.getElementById("name").innerHTML = document.getElementById("name").innerHTML.slice(0,-1);
}else if(event.which>=48 && event.which<=57 ){ //NUMBER
	if(event.which==48) document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML)+10;
	else document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML)+event.which-48;
	console.log("number is pressed");
}else if(event.which==32 ){ // SPACE
	if(timerRunning==0){
		start();
	}else{
		stop();
	}
	console.log("space is pressed");
}else if(event.which==13){ // ENTER
	addRowToTable();
	reset();
	document.getElementById("name").innerHTML = "";
	document.getElementById("penaltyTotal").innerHTML = "0";
	document.getElementById("points").innerHTML = "0";
	console.log("enter is pressed");
}else if(event.which==38){ //UP
	if(document.getElementById("penalty1").checked) var penalty = parseInt(document.getElementById("penalty1").value);
	else if(document.getElementById("penalty2").checked) var penalty = parseInt(document.getElementById("penalty2").value);
	else if(document.getElementById("penalty3").checked) var penalty = parseInt(document.getElementById("penalty3").value);
	var penaltyTotal = parseInt(document.getElementById("penaltyTotal").innerHTML) + penalty;
	document.getElementById("penaltyTotal").innerHTML = penaltyTotal;
	console.log(penaltyTotal);
	console.log("up is pressed");
}else if(event.which==40){ //DOWN
	if(document.getElementById("penalty1").checked) var penalty = parseInt(document.getElementById("penalty1").value);
	else if(document.getElementById("penalty2").checked) var penalty = parseInt(document.getElementById("penalty2").value);
	else if(document.getElementById("penalty3").checked) var penalty = parseInt(document.getElementById("penalty3").value);
	var penaltyTotal = parseInt(document.getElementById("penaltyTotal").innerHTML) - penalty;
	document.getElementById("penaltyTotal").innerHTML = penaltyTotal;
	console.log(penaltyTotal);
	console.log("down is pressed");
}else if(event.which==37){ //LEFT
	document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML)-1;
	console.log("left is pressed");
}else if(event.which==39){ //RIGHT
	document.getElementById("points").innerHTML = parseInt(document.getElementById("points").innerHTML)+1;
	console.log("right is pressed");
}else{
	console.log(event.which);
}
});

function unfocus(){
	console.log("unfocus");
	document.getElementById("penalty1").blur();
	document.getElementById("penalty2").blur();
	document.getElementById("penalty3").blur();
}
