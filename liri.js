require("dotenv").config();
var keys = require("./keys.js");
var fs =require("fs");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var request = require("request");
var command = process.argv[2];
var title = process.argv

var input = "";

for(var i = 3; i < title.length ; i++){
    if(i>3 && i < title.length){
        input = input + "+" + title[i];
    }else{
        input = input + title[i];
    }
}

switch(command){
    case "concert-this":
    if (!input){
        input = "Beyonce";
    } concertThis(input);
       
    break;

    case "spotify-this-song":
    if(input){
        spotifySong(input);
    }else{
        spotifySong("Single Ladies");
    }
    break;

    case"movie-this":
    if(input){
        omdbData(input)
    }else{
        omdbData("A River Runs Through It");
    }
    break;

    case "do-what-it-says":
        doThis();
        break;

    default: 
    console.log("\nliri.js node app commands: 'spotify-this-song', 'concert-this', 'movie-this', 'do-what-it-says'\n");
    break;
}

function concertThis(artist){
   
    var artist = input;
    var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
    request(URL, function(err, response, body){
        if(err){
            console.log(err);
            return;
          
            } else {
        var jsonData = JSON.parse(body);
        
        var concertInfo = [
            "------------------------",
            "Venue: " + jsonData[0].venue.name,
            "Venue Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region,
            "Date of the Event: " + moment(jsonData[0].datetime).format("l"), 
            "------------------------"
        ].join("\n\n");
        console.log(concertInfo);
        fs.appendFile("log.txt", concertInfo, function(err){
            if(err) return err;
        });
        console.log("\nSaved to log.txt\n");
    }
    })
    
}

function spotifySong(song){
    var spotify = new Spotify(keys.spotify);
    spotify.search({type: "track", query: song}, function(err, songInfo){
        if(err){
            console.log(err);
            return;
          
            } else {
                var songInfo= [
                    "------------------------",
                    "Artist: "+ songInfo.tracks.items[0].album.artists[0].name,
                    "Song: " + songInfo.tracks.items[0].name,
                    "Album: " + songInfo.tracks.items[0].album.name,
                    "Preview: " + songInfo.tracks.items[0].preview_url,
                    "------------------------"
                ].join("\n\n");
                console.log(songInfo);
                fs.appendFile("log.txt", songInfo, function(err){
                    if(err) return err;
                });
                console.log("\nSaved to log.txt\n");
            }
        })
}

function omdbData(input){
    var request = require("request");
    var movie = input;
    var URL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
    
    request(URL, function(err, res, body){
        if(err){
            return console.log(err);
        }
        var jsonData = JSON.parse(body);
        
        var movieInfo = [
            "------------------------",
            "Movie: " + jsonData.Title,
            "Release Year: " + jsonData.Year,
            "IMBD Rating: " + jsonData.imdbRating, 
            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country of production: " + jsonData.Country,
            "Language: "+ jsonData.Language,
            "Plot: "+jsonData.Plot,
            "Actors: "+ jsonData.Actors,
            "------------------------"
        ].join("\n\n");
        console.log(movieInfo);
        fs.appendFile("log.txt", movieInfo, function(err){
            if(err) return err;
        });
        console.log("\nSaved to log.txt\n");

        
    })
}
function doThis(){    
    fs.readFile("random.txt", "utf8", function(err, data){
       if(err){
           return console.log(err);
       }

        var dataInput = data.split(", ");
        var command = dataInput[0];
        var input = dataInput[1];

        console.log("\n" + command + "\n " + input)
        spotifySong(input);
    })
}