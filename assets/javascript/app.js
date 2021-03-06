/*
 * Homework #7 - Train Scheduler
 * Add a train, give it a start time and a frequency.
 * Train is added to a Firebase database.
 * Next train time and minutes to next train are calculated.
 * Current time and train data refreshes every minute.  
 */

// Firebase configuration & initialization
var config = {
    apiKey: "AIzaSyAiexV0rlMuaZQbv-wTHO3Cj5arNwsXIw4",
    authDomain: "first-project-171de.firebaseapp.com",
    databaseURL: "https://first-project-171de.firebaseio.com",
    projectId: "first-project-171de",
    storageBucket: "first-project-171de.appspot.com",
    messagingSenderId: "949949647628"
};

firebase.initializeApp(config);

var database = firebase.database();

//array to store keys pushed onto database
var keys = [];

// user entered values
var trainName;
var destination;
var firstTrain;
var frequency;

// calculated values
var nextTrain;
var minutesAway;
var offsetTime;

// string to build a table data row for writing to html
var tableString = "";

// refresh time every minute
var timeDisplayinterval = setInterval(function() {	
	$("#time-display").html("Current Time: " + moment().format("HH:mm"));
}, 60000);

// refresh trains on page load.
refreshTrains();

// refresh trains display every minute
var pageRefreshInterval = setInterval(refreshTrains, 60000);

// iterate through all children and write each train to HTML table
// store child keys in array for reference
function refreshTrains() {

	database.ref("/Trains").on("value", function(snapshot) {

		$("#table-body").html("");
		$("#time-display").html("Current Time: " + moment().format("HH:mm"));

		var i = 0;

		snapshot.forEach(function(childSnapshot) {

			// capture each key
			keys[i] = childSnapshot.key;

			trainName = childSnapshot.val().Name;
			destination = childSnapshot.val().Destination;
			firstTrain = childSnapshot.val().FirstTrain;
			frequency = childSnapshot.val().Frequency;

			writeTrain(i);
			i++;
		});
	});
}

/*
 * writeTrain(index)
 * displays a row in the html table.  The index parameter is used as 
 * a data attribute of the remove button, so the click handler can
 * remove the appropriate train / row. 
 */
function writeTrain(index) {

	// if first train is later than current time...
	if(moment().format("HH:mm") < firstTrain) {

		// set next train = first train
		nextTrain = firstTrain;
		minutesAway = moment(nextTrain, "HH:mm").diff(moment(), "minutes") + 1;
	}

	// otherwise, calculate minutesAway with % and add to moment to get next train
	else {

			var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
			// console.log(firstTimeConverted);

		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		// console.log("Difference in time: " + diffTime);

		var timeSinceLastTrain = diffTime % frequency;

		minutesAway = frequency - timeSinceLastTrain;

		nextTrain = moment().add(minutesAway, "minutes").format("HH:mm");

	}

	tableString = "<tr><td>" + trainName + "</td>" +
			 	  "<td>" + destination + "</td>" +
			 	  "<td>" + firstTrain + "</td>" +
			 	  "<td>" + frequency + "</td>" +
			 	  "<td>" + nextTrain + "</td>" +
			 	  "<td>" + minutesAway + "</td>" +
			 	  "<td><button class=\"remove-button\" data-index=\"" +
			 	  						 index + "\">Remove</button></td></tr>";

	$("#table-body").append(tableString);
}

$("#submit").on("click", function() {
	event.preventDefault();

	trainName = $("#train-name").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#first-train").val().trim();
	frequency = $("#frequency").val().trim();

	// add the new data to Firebase
	database.ref("/Trains").push({
		Name : trainName, 
		Destination : destination, 
		FirstTrain : firstTrain, 
		Frequency : frequency
	});

	// clear input fields
	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train").val("");
	$("#frequency").val("");

	// fire on "child_added" event handler to write the new child
	database.ref("/Trains").on("child_added", function(childSnapshot) {

		refreshTrains();
	});	
});

//  pop button listener - remove last train
$("#pop-button").on("click", function() {

	event.preventDefault();

	database.ref("/Trains").child(keys.pop()).remove();

	database.ref("/Trains").on("child_removed", function(snapshot) {

	refreshTrains();
	});	
});

// remove button listener, targeting the parent, then walking down
//  the DOM to the remove button.
$("#table-body").on("click", ".remove-button", function() {

	event.preventDefault();

	var keyToRemove = keys[$(this).attr("data-index")];

	database.ref("/Trains").child(keyToRemove).remove();

	database.ref("/Trains").on("child_removed", function(snapshot) {

	refreshTrains();
	});	
});