# train-scsheduler
Homework #7 Firebase &amp; Moment.js
Deployed Site: https://mstange22.github.io/train-scheduler/

Receive train data via form entry.  Name, destination, start time and frequency.
Store train data in Firebase.  Calculate time to next train and time of next train arrival using Moment.js.

PseudoMaths:
timeToNextTrain = frequency - ((currentTime - startTime) % frequency)
NextTrainTime = currentTime + timeToNextTrain

Additional features:
Refresh current time and train data every minute (w/o page refresh).
Error check to be sure that trains with start times AFTER current time have a next train time of first train.
