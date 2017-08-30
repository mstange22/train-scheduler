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

database.ref("/Trains").on("child_added", function(snapshot) {

	nextTrain = snapshot.val().FirstTrain;
	minutesAway = snapshot.val().FirstTrain;
	
	var tableString = "<tr><td>" + snapshot.val().Name + "</td>" +
					 	  "<td>" + snapshot.val().Destination + "</td>" +
					 	  "<td>" + snapshot.val().Frequency + "</td>" +
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

	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = $("#first-train").val().trim();
	var frequency = $("#frequency").val().trim();

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