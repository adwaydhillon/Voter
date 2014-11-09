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
```
$ npm install -g meteorite
```

NOTE: If your system requires root access to install global npm packages, make sure you use the -H flag:
```
$ sudo -H npm install -g meteorite
```

Usage:
-----
Make sure that you have git installed and available in your path. You will also need to make sure that the install location of mrt (usually /usr/local/bin/) is on your path.

### `smart.json`
List all your packages in a smart.json file

## Deploying to Meteorite
```
$ mrt install
$ mrt update
$ mrt link-package path/to/foo
```

## Meteorite Commands
You can simply run meteor to start your app. You may need to run mrt install first.
```
$ mrt
```
Unlike meteor add, this command only one package can be added at a time with mrt add.
```
# Add the latest version of the moment package on Atmosphere.
$ mrt add moment
# Add a specific version of a package.
$ mrt add router --pkg-version 0.3.4
# Meteorite will install page.js too, because router depends on it.
```
## Other Commands
It is not required that you run sudo mrt. If you do so, your home directory will pick up some root-owned files and you'll struggle to run mrt without sudo from then on. This isn't good.

To fix the problem, try cleaning up potentially "sudo-ed" files:
```
sudo mrt uninstall
sudo mrt uninstall --system
sudo chown -R `whoami` ~/.npm
```
## How Meteorite Works
