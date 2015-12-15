#Amazon Echo Integration to Sonos
This project provides integration between your Amazon Echo/Alexa and Sonos system

First, I want to give credit to the great work done by infofiend (/infofiend/echo-sonos) and RGRACIANO (RGRACIANO/ECHO-SONOS) and thank them for the inspiration.
When I first tried to get the connectivity working between Alexa and Sonos, I started with infofiend's fork and it worked great.  I ended up re-writing
most of the Lambda code because I wanted a system that didn't require zone names and presets to be hard coded. The main advantage is that you don't have
to modify any code for this to work with your Sonos zones. Alexa will have access to any Favorites or Playlists that you add to Sonos, not a pre-defined
list of presets.

In the code, I've implemented handlers for almost all of the actions in Jishi's node API project:

    `playIntent`  Plays whatever is in queue for the zone specified. Ex: "Alexa, tell Sonos to play in the Living Room"
    `playFavoriteIntent`  Plays the Sonos favorite in the zone specified. Ex: "Alexa, tell Sonos to play my favorite Pop Songs in the Living Room"
    `playPlaylistIntent`  Plays the Sonos playlist in the zone specified. Ex: "Alexa, tell Sonos to play the playlist Party Time in the Kitchen"
    `pauseIntent`  Pauses all zones that are currently playing. Ex: "Alexa, tell Sonos to pause"
    `pauseRoomIntent`  Pauses the zone specified. Ex: "Alexa, tell Sonos to pause the Office"
    `resumeIntent`  Resumes/Un-Pauses any zones that were paused using the pauseIntent. Ex: "Alexa, tell Sonos to play"
    `resumeRoomIntent`  Resumes the zone specified. Ex: "Alexa, tell Sonos to resume in the Bathroom"
    `muteRoomIntent`  Mutes the zone specified. Ex: "Alexa, tell Sonos to mute the Den"
    `unmuteRoomIntent`  Unmutes the zone specified. Ex: "Alexa, tell Sonos to unmute the Garage"
    `skipIntent`  Skips the track in the zone specified. Ex: "Alexa, tell Sonos to skip this track in the Bedroom"
    `prevIntent`  Plays the previous track in the zone specified. Ex: "Alexa, tell Sonos to play the previous song in the Loft"
    `clearQueueIntent`  Clears the song queue in the zone specified. Ex: "Alexa, tell Sonos to clear the Living Room Queue"
    `repeatOnIntent`  Turns on repeat for the queue in the zone specified. Ex: "Alexa, tell Sonos to repeat songs in the Kitchen"
    `repeatOffIntent`  Turns off repeat for the queue in the zone specified. Ex: "Alexa, tell Sonos to stop repeating in the Office"
    `shuffleOnIntent`  Turns on shuffle for the queue in the zone specified. Ex: "Alexa, tell Sonos to shuffle the songs in the Master Bedroom"
    `shuffleOffIntent`  Turns off shuffle for the queue in the zone specified. Ex: "Alexa, tell Sonos to stop shuffling in the Den"
    `crossfadeOnIntent`  Turns on crossfade for the queue in the zone specified. Ex: "Alexa, tell Sonos to crossfade the Kitchen"
    `crossfadeOffIntent`  Turns off crossfade for the queue in the zone specified. Ex: "Alexa, tell Sonos to stop crossfading the Office"
    `volUpRoomIntent`  Turns up the volume in 10% increments for the zone specified. Ex: "Alexa, tell Sonos to turn up the volume in the Kitchen"
    `volDownRoomIntent`  Turns down the volume in 10% increments for the zone specified. Ex: "Alexa, tell Sonos to turn it down in the Bedroom"
    `volUpIntent`  Turns up the volume in 10% increments for the first available zone, this is helpful if all zones are grouped together. Ex: "Alexa, tell Sonos to turn it up"
    `volDownIntent`  Turns down the volume in 10% increments for the first available zone. Ex: "Alexa, tell Sonos to turn the volume down"
    `volLevelIntent`  Sets the volume to a specifc level for the first available zone. Ex: "Alexa, tell Sonos to set the volume to 60%"
    `volLevelRoomIntent`  Sets the volume to a specific level for the zone specified. Ex: "Alexa, tell Sonos to set the volume to 20% in the Bedroom"

NOTE: Zone names are not hard coded, so as you expand your Sonos system, you don't need to change the code. The code will also
      check to make sure you provided a valid zone name in your request. If you didn't, it will prompt you with a list of available zones.

#Files Included in this Project
You'll need these files when you setup your custom skill for Alexa:

`/echoSkill/intents.json`  This is a list of intents that Alexa attempts to map your request to
`/echoSkill/utterances.txt`  This is a list of things that we expect a user to say to Alexa, which are then mapped to the intents in the file above
`/echoSkill/CustomSlotTypes`  These are a set of examples for values a user can provide. You may want to add more examples to the Favorites and Playlist slot values
                      Custom slot values are simply a set of examples, they do not have to be an exhaustive list.

You'll need these files when you setup your Lambda Service:

`/lambdaService/test_intent.json`  This is a test blueprint for testing out your Lambda service
`/lambdaService/src/AlexaSkill.js`  This is a generic set of classes and handlers provided by Amazon
`/lambdaService/src/index.js`  This is our custom code for handling the intents from Alexa
`/lambdaService/src/options.js`  This is the only file you'll need to modify. It holds various configuration settings that will be specific to you

#Setup Overview
How do you get this all working?
1. Setup node-sonos-http-api from Jishi
2. Expose your local server to the internet
3. Create a custom Alexa Skill
4. Create an AWS Lambda Service
5. Connect your custom Alexa Skill to AWS Lambda

#Setup node-sonos-http-api
1. Install node.js on a server on the same network as your Sonos.
   This MUST be running inside of your network. In my setup, I used a Raspberry Pi 2 Model B to host the local server.
   The built-in Raspberian OS can run your Node server just fine.
   I bought this bundle on Amazon, but there are a lot of other options: http://www.amazon.com/gp/product/B008XVAVAW?psc=1&redirect=true&ref_=oh_aui_detailpage_o02_s00

2. Grab https://github.com/jishi/node-sonos-http-api and run it on that server.
3. Make sure your Node server is running by navigating to this address in your browser: http://<your server ip>:5005/zones
4. If you get a bunch of text back (JSON), you're good to go.
5. If you have problems, make sure you are on the same network as your Sonos AND make sure you don't have a Sonos client running on the same machine.
   The client can interfere with the node.js server.

# Expose your local server to the internet
1. You'll need to use some kind of Dynamic DNS service to allow AWS Lambda to contact your server
   I use No-Ip.com, but there a lot of other options like DynDNS or yDNS.eu
   Basically, these services keep track of your home IP address in case your ISP changes it
2. Configure port forwarding on your local router.
   You'll need to configure the router to forward all requests coming from the internet on port 5005 (or whatever port you setup node-sonos-http-api to use)
   to the internal IP address of your node server.
3. If your router doesn't support local name resolution, you'll want to set the node server up with a static IP so port forwarding works consistently
4. Setup your server to auto-start or daemonize the node-sonos-http-api server.
5. Test it by hitting http://<your external DNS address>:5005/zones.

# Create a Custom Alexa Skill
1. Create a new Skill in the Alexa Skills control panel on Amazon. You need a developer account to do this.
   You can sign up here: https://developer.amazon.com/echo
2. Once you're logged into the Amazon Developer Console, click Apps & Services > Alexa
3. Click Getting Started under Alexa Skills Kit, then click Add a New Skill
4. The Name can be whatever you want. Invocation Name is what you will say to activate the skill after you say "Alexa tell/ask..."
    Ex: "Alexa tell Sonos..."
    I used Sonos as the invocation name, but as infofiend noted in his project, sometimes Alexa has trouble understanding this invocation name
5. Put a dummy value in the Endpoint. We'll come back to this.
6. Click Next, taking you to Interaction Model. Copy the contents of "echoSkill/intents.json" into the "Intent Schema" field.
7. You'll need to create 3 custom slot types, which are provided in echoSkill/CustomSlotTypes.txt
   Custom slot values are simply a list of sample items that the user might say, they do not need to be an exhaustive list. For example, if a zone
   is in the LIST_OF_ZONES custom slot list, Alexa will have a better chance of matching what the user said. However, this does not prevent a user
   from specifying a zone that is not in the list.
8. Copy the contents of echoSkill/utterances.txt into Sample Utterances
9. Don't test yet, just save. Click back to "Skill Information" and copy the "Application ID". You'll need this for your Lambda service.

#Create an AWS Lambda Service
1. Create an AWS Lambda account if you don't have one already. It's free!
   You can do that here: https://console.aws.amazon.com
2. In the Lambda console, look to the upper right. Make sure "N. Virginia" is selected, because not every zone supports Alexa yet.
3. Under compute, click Lambda
4. Create a new Lambda function. Skip the blueprint.
5. Pick any name you want, and choose runtime Node.js.
6. Edit lambdaService/src/options.js to have your public FQDN in the host field, your port, and the Alexa App ID you just copied.
7. In lambdaService/src, zip up everything. On Mac, "cd src; zip -r src.zip *.js".  Make sure you don't capture the folder, just the files.
8. Choose to upload the zip file for src.zip.
9. The default handler is fine. Create a new role of type Basic Execution Role. Pick smallest possible memory and so on.
10. Click Next to proceed. Once created, click "Event Sources".
11. Add a source.  Choose "Alexa Skills Kit".
12. Test it out.
    There is a test blueprint here lambdaService/test_intent.json
    Copy/paste this JSON into the Lambda test event box. You'll need to edit the JSON to put the Alexa App ID you copied above into the applicationID field.
    By default, the test blueprint will attempt to play a zone called 'office'. You can either change this to the name of one of your zones or leave it. If
    you do not have a zone named 'office', the execution result should still succeed, you'll just see text for Alexa to prompt for a valid zone name.
    If you get an error, it is most likely because Lambda cannot reach your local server. Make sure that you can reach your node-sonos-http-api server at the
    host name and port that are specified in the lambdaService/src/options.js file.

# Connect your custom Alexa Skill to AWS Lambda
1. In the Lambda console, copy the long "ARN" string in the upper right.
2. Go back into the Alexa Skill console, open your skill, click "Skill Information", choose Lambda ARN and paste that ARN string in.
3. You're good to go.
   Try it out by saying something like, "Alexa, tell Sonos to play my favorite <favorite name> in <Zone>"
   The <favorite name> is anything you've added as a Sonos Favorite in the Sonos App
   Example: "Alexa, tell Sonos to play my favorite Discover Weekly in the Kitchen"

#To Do:
These features still need to be added...

- Add a handler for a state request. This will allow you to ask something like, "Alexa, ask Sonos what's playing in the Kitchen"
- Add error checking for Sonos favorites
    Currently, the code does not check to see if you've requested a valid Sonos Favorite or if Alexa misunderstood you. I'd like to pull back a list of favorites
    from the Sonos HTTP API and verify the Favorite before sending the command to Sonos.

# NOTES
Utterances

For a complete list of things you can ask Alexa to do with Sonos, check out echoSkill/utterances.txt.  This is complete list of things this skill can handle. I've
tried to cover a wide range of possible phrases here, but feel free to suggest more. Some phrases work better than others. For example, I've found Alexa has an
easier time understanding "tell Sonos to turn up the volume in the Living Room" vs "tell Sonos to turn it up in the Living Room".  Test it out, your mileage may vary.

Error Handling

I've tried to add a bunch of error handling into the script, however I'm sure unforseen things will happen. If you run into problems, feel free to drop me a note.