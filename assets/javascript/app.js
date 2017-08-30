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

// user entered values
var trainName;
var destination;
var firstTrain;
var frequency;

// calculated values
var nextTrain;
var minutesAway;
var offsetTime;

$(document).ready(function() {
	$(".jumbotron").append("<h2>Current Time: " + moment().format("HH:mm"));
});

database.ref("/Trains").on("child_added", function(snapshot) {

	firstTrain = snapshot.val().FirstTrain;
	frequency = snapshot.val().Frequency;

	// if(moment().format("HH:mm") > firstTrain) {

	// }
	var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
	console.log(firstTimeConverted);

	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("Difference in time: " + diffTime);

	var timeSinceLastTrain = diffTime % frequency;

	minutesAway = frequency - timeSinceLastTrain;
	console.log("Minutes until next train: " + diffTime);

	
	// minutesAway = frequency -
	// 					(moment().diff(moment(firstTime, "HH:mm"), "minutes")
	// 						% frequency);

	nextTrain = moment().add(minutesAway, "minutes").format("HH:mm");
	
	var tableString = "<tr><td>" + snapshot.val().Name + "</td>" +
					 	  "<td>" + snapshot.val().Destination + "</td>" +
					 	  "<td>" + firstTrain + "</td>" +
					 	  "<td>" + frequency + "</td>" +
					 	  "<td>" + nextTrain + "</td>" +
					 	  "<td>" + minutesAway + "</td></tr>";

	$("#table-body").append(tableString);
});

// database.ref("/Trains").on("child_removed", function(snapshot) {

// 	nextTrain = snapshot.val().FirstTrain;
// 	minutesAway = snapshot.val().FirstTrain;
	
// 	var tableString = "<tr><td>" + snapshot.val().Name + "</td>" +
// 					 	  "<td>" + snapshot.val().Destination + "</td>" +
// 					 	  "<td>" + snapshot.val().Frequency + "</td>" +
// 					 	  "<td>" + nextTrain + "</td>" +
// 					 	  "<td>" + minutesAway + "</td></tr>";

// 	$("#table-body").append(tableString);
// });

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
});

// $("#pop").on("click", function() {
// 	event.preventDefault();

// 	database.ref("/Trains").remove();
// 	$("#table-body").html("");
// });