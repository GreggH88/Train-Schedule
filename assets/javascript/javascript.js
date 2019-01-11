// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDwWVOZQUE239UDJcOOEXHgsS_nf3wW36g",
  authDomain: "more-classwork.firebaseapp.com",
  databaseURL: "https://more-classwork.firebaseio.com",
  projectId: "more-classwork",
  storageBucket: "more-classwork.appspot.com",
  messagingSenderId: "670399973138"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    freq: trainFreq
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  alert("Train plan successfully added");

  // Clears all of the text-boxes
  $("#train-input").val("");
  $("#dest-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().freq;

  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainFreq);

  // Time is 3:30 AM
  var firstTrain = trainStart;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  // Minutes Until Train
  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(moment(nextTrain).format("hh:mm A")),
    $("<td>").text(tMinutesTillTrain)

  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
