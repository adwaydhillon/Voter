Voter - HackNashville 6
=====

An easy voting/polling platform for event organizers.
Participants don't require signup/login, they vote by sending texts. 

Features:
---------
* Quick event creation for organizer, just list name, and vote items
*  1 vote per voter (phone number)
*  Future:
   * Categories (sub-events)
   * Geofencing? (Current-limitation, as twilio does this by phone number area code)
   * Identifiers: team_name / team_id

Flow:
-----
* Voting Period:
 Twilio (recieve sms) -> routing -> Add to Mongo Collection
* Voting Ends / Realtime: 
Iterate through collection -> Present votes

Installing Meteorite:
-----
$ npm install -g meteorite

NOTE: If your system requires root access to install global npm packages, make sure you use the -H flag:
$ sudo -H npm install -g meteorite
