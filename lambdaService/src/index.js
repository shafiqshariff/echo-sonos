/**
 * Created by Jeff Champagne on 11/23/15.
 */

var http = require('http');
var options = require('./options');
var AlexaSkill = require('./AlexaSkill')
    ;
var EchoSonos = function () {
    AlexaSkill.call(this, options.appid);
};

EchoSonos.prototype = Object.create(AlexaSkill.prototype);
EchoSonos.prototype.constructor = EchoSonos;

// Extend the AlexaSkill
EchoSonos.prototype = Object.create(AlexaSkill.prototype);
EchoSonos.prototype.constructor = EchoSonos;


// override intentHandlers to map intent handling functions.
EchoSonos.prototype.intentHandlers = {
    "playIntent": function (intent, session, response) {
        console.log("playIntent: checking zone");
        checkZones(intent, function checkZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/play';
                // Call Sonos
                talkToSonos(options,response,"Playing "+ intent.slots.zone.value)
            }
        });
    },

    "playFavoriteIntent": function (intent, session, response) {
        console.log("playFavoriteIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone and Favorite names for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Encode the Zone and Favorite names for a URI
                var encodedFavorite = encodeURIComponent(intent.slots.favorite.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/favorite/' + encodedFavorite + '/play';
                // Call Sonos
                talkToSonos(options,response,"Playing Favorite " + intent.slots.favorite.value + " in the " + intent.slots.zone.value)
            }
        });
    },

    "playPlaylistIntent": function (intent, session, response) {
        console.log("playPlaylistIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone and Playlist names for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Encode the Zone and Favorite names for a URI
                var encodedPlaylist = encodeURIComponent(intent.slots.playlist.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/playlist/' + encodedPlaylist + '/play';
                // Call Sonos
                talkToSonos(options,response,"Playing Playlist " + intent.slots.playlist.value + " in the " + intent.slots.zone.value)
            }
        });
    },

    "pauseIntent": function (intent, session, response) {
        console.log("pauseIntent: Calling Sonos API");
        // ***** NEED TO IMPLEMENT THE ABILITY TO SPECIFY A TIME *******
        // Ask Sonos to pause everything
        options.path = '/pauseall';
        talkToSonos(options, response, "Pausing");
    },

    "pauseRoomIntent": function (intent, session, response) {
        console.log("pauseRoomIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/pause';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " paused")
            }
        });
    },

    "resumeIntent": function (intent, session, response) {
        console.log("resumeIntent: Calling Sonos API");
        // ***** NEED TO IMPLEMENT THE ABILITY TO SPECIFY A TIME *******
        // Ask Sonos to pause everything
        options.path = '/resumeall';
        talkToSonos(options, response, "Unpausing");
    },

    "muteRoomIntent": function (intent, session, response) {
        console.log("muteRoomIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/mute';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " muted")
            }
        });
    },

    "unmuteRoomIntent": function (intent, session, response) {
        console.log("unmuteIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/unmute';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " unmuted")
            }
        });
    },

    "skipIntent": function (intent, session, response) {
        console.log("skipIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/next';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " track skipped")
            }
        });
    },

    "prevIntent": function (intent, session, response) {
        console.log("prevIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/previous';
                // Call Sonos
                talkToSonos(options,response,"Playing previous track in " + intent.slots.zone.value)
            }
        });
    },

    "statusIntent": function (intent, session, response) {
    // TO DO: Add the ability to ask Sonos what is playing
    },

    "clearQueueIntent": function (intent, session, response) {
        console.log("clearQueueIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/clearqueue';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " queue cleared")
            }
        });
    },

    "repeatOnIntent": function (intent, session, response) {
        console.log("repeatOnIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/repeat/on';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " repeat on")
            }
        });
    },

    "repeatOffIntent": function (intent, session, response) {
        console.log("repeatOffIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/repeat/off';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " repeat off")
            }
        });
    },

    "shuffleOnIntent": function (intent, session, response) {
        console.log("shuffleOnIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/shuffle/on';
                // Call Sonos
                talkToSonos(options,"shuffling " + intent.slots.zone.value + " queue")
            }
        });
    },

    "shuffleOffIntent": function (intent, session, response) {
        console.log("shuffleOffIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/shuffle/off';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " shuffling off")
            }
        });
    },

    "crossfadeOnIntent": function (intent, session, response) {
        console.log("crossfadeOnIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/crossfade/on';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " crossfading on")
            }
        });
    },

    "crossfadeOffIntent": function (intent, session, response) {
        console.log("crossfadeOffIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/crossfade/off';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " crossfading off")
            }
        });
    },

    "volUpRoomIntent": function (intent, session, response) {
        console.log("volUpRoomIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/volume/+10';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " turned up")
            }
        });
    },

    "volDownRoomIntent": function (intent, session, response) {
        console.log("volUpRoomIntent: checking zone");
        checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
            if (err) {
                console.log("getZonesCallback: Error received");
                response.tell(speechOutput);
            } else if (!validZone){
                console.log("getZonesCallback: Valid zone not received");
                // The user didn't provide a valid zone, prompt them
                response.ask(speechOutput,repromptText);
            } else {
                console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                // The user provided a valid zone and there were no errors, attempt to fulfill the request
                // Encode the Zone name for a URI
                var encodedZone = encodeURIComponent(intent.slots.zone.value);
                // Set the variables we'll need to make the API call and confirm to the user
                options.path = '/' + encodedZone + '/volume/-10';
                // Call Sonos
                talkToSonos(options,response,intent.slots.zone.value + " turned down")
            }
        });
    },

    "volUpIntent": function (intent, session, response) {
        console.log("volUpIntent: Calling Sonos API");
        // Ask Sonos to turn up the volume
        // We aren't specifying a zone, so this will affect the first one in the list
        options.path = '/volume/+10';
        talkToSonos(options, response, "Turning it up");
    },

    "volDownIntent": function (intent, session, response) {
        console.log("volDownIntent: Calling Sonos API");
        // Ask Sonos to turn up the volume
        // We aren't specifying a zone, so this will affect the first one in the list
        options.path = '/volume/-10';
        talkToSonos(options, response, "Turning it down");
    },

    "volLevelIntent": function (intent, session, response) {
        console.log('volLevelIntent: Checking levelValue');
        var levelValue = parseInt(intent.slots.level.value);
        if (isNaN(levelValue)) {
            console.log('volLevelIntent: Invalid level value: ' + levelValue);
            response.ask('What volume would you like?', 'Say a number between 0 and 100.');
        } else if ( levelValue > 100 || levelValue < 0 ) {
            console.log('volLevelIntent: Level value too high or low: ' + levelValue);
            response.ask('Sorry, volume has to be between 0 and 100, please try again.', 'Say a number between 0 and 100.');
        } else{
            console.log('volLevelIntent: Setting level: ' + levelValue);
            // The level value is valid, set sonos
            options.path = '/groupVolume/' + levelValue;
            talkToSonos(options, response, "Volume set to " + levelValue + " percent");
        }
    },

    "volLevelRoomIntent": function (intent, session, response) {
        console.log('volLevelRoomIntent: Checking levelValue');
        var levelValue = parseInt(intent.slots.level.value);
        if (isNaN(levelValue)) {
            console.log('volLevelRoomIntent: Invalid level value: ' + levelValue);
            response.ask('What volume would you like?', 'Say a number between 0 and 100.');
        } else if ( levelValue > 100 || levelValue < 0 ) {
            console.log('volLevelRoomIntent: Level value too high or low: ' + levelValue);
            response.ask('Sorry, volume has to be between 0 and 100, please try again.', 'Say a number between 0 and 100.');
        } else{
            console.log('volLevelRoomIntent: levelValue is ok: ' + levelValue + '. Checking zone.');
            checkZones(intent, function getZonesCallback(err, validZone, speechOutput, repromptText) {
                if (err) {
                    console.log("getZonesCallback: Error received");
                    response.tell(speechOutput);
                } else if (!validZone){
                    console.log("getZonesCallback: Valid zone not received");
                    // The user didn't provide a valid zone, prompt them
                    response.ask(speechOutput,repromptText);
                } else {
                    console.log("getZonesCallback: Valid zone received, encoding URI and calling talkToSonos with Callback");
                    // The user provided a valid zone and there were no errors, attempt to fulfill the request
                    // Encode the Zone name for a URI
                    var encodedZone = encodeURIComponent(intent.slots.zone.value);
                    // Set the variables we'll need to make the API call and confirm to the user
                    options.path = '/' + encodedZone + '/volume/' + levelValue;
                    // Call Sonos
                    talkToSonos(options,response,intent.slots.zone.value + " set to " + levelValue + " percent")
                }
            });
        }
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        console.log("AMAZON.CancelIntent Called, Cancelling");
        response.tell("Canceling");
    }
};

function checkZones(intent, checkZonesCallback) {
    // Get the Zone from the intent
    var zoneSlot = intent.slots.zone;
    console.log("checkZones: zoneSlot set to:" + zoneSlot.value);
    //
    // GET THE ZONE NAMES FROM SONOS
    //
    // Create a variable that is going to hold the JSON response of Zones from node-sonos-http-api
    var sonosResponseString = '';
    // Set the node-sonos-http-api path we need to hit (/zones)
    options.path = '/zones';
    // Connect to the node-sonos-http-api server specified in the options.js file
    console.log("checkZones: calling Sonos at: " + options.host + ":" + options.port + options.path);
    var request = http.get(options, function (res) {
        // If our API call returns data, write it out to the sonosResponseString vairable
        res.on('data', function (data) {
            console.log("checkZones: Retrieving JSON from Sonos API...");
            sonosResponseString += data;
        });
        // At the end of our API call, start parsing the response
        res.on('end', function () {
            // Write to the console
            console.log("checkZone: Parsing JSON");
            // Create an array to hold our parsed JSON and that will hold the roomNames from the JSON response
            var sonosResponseObject = JSON.parse(sonosResponseString);
            var zoneArray = [];
            var zoneArrayLower = [];
            // Loop through the JSON keys to find all of the zones/room names
            for (var coordinator in sonosResponseObject) {
                for (var roomName in sonosResponseObject[coordinator].members){
                    // Write the zones/room names out to the console
                    console.log("key:" + roomName + ", value:" + sonosResponseObject[coordinator].members[roomName].roomName);
                    // Load each zone/room name into our second array
                    zoneArray.push(sonosResponseObject[coordinator].members[roomName].roomName);
                    zoneArrayLower.push(sonosResponseObject[coordinator].members[roomName].roomName.toLowerCase());
                }
            }
            // Build the text for our Zones in case we need to prompt the user
            var zoneTotal = zoneArray.length;
            var zoneCount = 0;
            var zoneText = '';
            for (var i in zoneArray) {
                if (zoneCount < (zoneTotal - 1)) {
                    zoneText += zoneArray[i] + ', ';
                    zoneCount += 1;
                } else {
                    zoneText += 'or ' + zoneArray[i] + '.';
                }
            }
            console.log("checkZones: Zone text built: " + zoneText);
            //
            // START CHECKING ZONE FROM INTENT
            //
            // Check to see if a Zone value exists in the intent, if so check it. If not, just return a list of zones
            if (!zoneSlot.value || !zoneSlot) {
                // No zone was provided, return a list of zones
                console.log("checkZones: No zone was provided in the intent. zoneSlot.value: " + zoneSlot.value);
                checkZonesCallback(null, false, "Which room?", "You can say " + zoneText);
            } else if (zoneArrayLower.indexOf(zoneSlot.value) > -1) {
                // The intent zone was matched from the list provided by Sonos
                console.log("checkZones: Zone found");
                checkZonesCallback(null, true);
            } else {
                // The zone provided was not found
                console.log("checkZones: Zone not matched:" + zoneSlot.value);
                checkZonesCallback(null, false, "Sorry, I couldn't find that room on Sonos. Please try again.", "You can say " + zoneText);
            }
        });
    });
    request.on('socket', function (socket) {
        socket.setTimeout(1500);
        socket.on('timeout', function() {
            request.abort();
        });
    });
    request.on('error', function (e) {
        // Return the connection error
        console.log("checkZones: Error connecting to Sonos API: " + e.message);
        // Create better responses for errors we expect
        if (e.message.indexOf('socket hang up') > -1 || e.message.indexOf('ECONNREFUSED') > -1) {
            checkZonesCallback(true, false, "Sorry, I'm having trouble connecting to Sonos. Please check your local server.");
        }  else {
            // We don't know this error, so just return it.
            checkZonesCallback(true, false, "Sorry, I'm having trouble talking to Sonos. Here's the error I got: " + e.message);
        }
    });
}

function talkToSonos(options, response, speechOutput) {
    console.log("talkToSonos: calling Sonos at: " + options.host + ":" + options.port + options.path);
    var request = http.get(options, function(httpResponse) {
        console.log("HTTP Status: " + httpResponse.statusCode + " " + httpResponse.statusMessage);
        if (!httpResponse.statusCode == 200){
            console.log("HTTP Status Code is not 200");
            response.tell("I got this error from Sonos: " + this.statusMessage);
        } else {
            console.log("API call was successful, prompting user");
            response.tell(speechOutput);
        }
    });
    request.on('socket', function (socket) {
        socket.setTimeout(1500);
        socket.on('timeout', function() {
            request.abort();
        });
    });
    request.on('error', function (e) {
        // Return the connection error
        console.log("talkToSonos: Error connecting to Sonos API: " + e.message);
        // Create better responses for errors we expect
        if (e.message.indexOf('socket hang up') > -1 || e.message.indexOf('ECONNREFUSED') > -1) {
            response.tell("Sorry, I'm having trouble connecting to Sonos. Please check your local server.");
        }  else {
            // We don't know this error, so just return it.
            response.tell("Sorry, I'm having trouble talking to Sonos. Here's the error I got: " + e.message);
        }
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the EchoSonos skill.
    var echoSonos = new EchoSonos();
    echoSonos.execute(event, context);
};