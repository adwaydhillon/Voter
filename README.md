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
* Login/Signup -> Add New Event -> Add Vote Items
* Vote Items -> Mongo Collection ("tasks")
* Twilio number generated -> receive sms -> Increase counter for respective item in tasks MongoDB Collection
* Voting Ends / Realtime: Iterate through collection -> Present votes 

Optional Features:
------------------
* Navbar
* Bootstrap Styling
* Dynamic scrolling
* Geofencing for texts
* Graph generation for results page
