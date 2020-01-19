require("dotenv").config();
var keys = require("./keys.js");
var Spotify= require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// const[_,__,action,artist]=process.argv;
var axios= require('axios');
const fs = require('fs');
const inquirer= require('inquirer')
var action;
var artist;

function quest (){
    inquirer
  .prompt([{
   name:"q1",type:"list", message:"What do you want to do?", choices:["concert-this","spotify-this-song", "movie-this","do-what-it-says","exit"]},
   {name:"q2", type:"input", message:"=====Please insert the artist or movie========(In case of exit just press Enter)"}
  
  ])
  .then (function(ans) {
      action=ans.q1;
      artist=ans.q2;
      lookingFor();
    
  })
}
quest()
function lookingFor(){
switch(action){
    case "concert-this":
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming")
            .then(function (response) {
              // handle success
              
              for (i=0;i<6;i++)
             
              console.log(" ---The artist "+artist+" is going to play upcoming at "+
              response.data[i].venue.name+" in "+response.data[i].venue.city+" on "+
                 response.data[i].datetime+" ---");
                 
            })
            .catch(function (error) {
              // handle error
              console.log(error, "===Please try another Artist===")
            })
            .finally(function () {
              console.log("===INFO DELIVERED===");
              quest()
            });

        break;
    case "spotify-this-song":    
    spotify.search({ type: 'track', query: artist, limit: 2 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
          quest()
        }
       
      console.log("The song is call: "+ data.tracks.items[0].name);
      console.log("Below is the link to listen to it")
      console.log(data.tracks.items[0].external_urls)
      console.log("This track is from the album "+data.tracks.items[0].album.name);
      quest()

       
      });

       break;
    case "movie-this":
        //OMDB 
        axios.get("http://www.omdbapi.com/?t="+ artist+"&apikey=e4f2d5b")
        .then(function(response){
            console.log("The movie is called "+ response.data.Title)
            console.log("Released in " +response.data.Year)
            console.log(response.data.Ratings[0])
            console.log(response.data.Ratings[1])

            console.log("It was produced in " +response.data.Country)
            console.log("Plot :" +response.data.Plot);
            quest();
           
            




        })
        break;
    case "do-what-it-says":
            fs.readFile('./random.txt', (err, data) => {
                if (err) throw err;

                var textSplit= data.toString();

                var textSplit= textSplit.split(",")
                console.log(textSplit)
                action=textSplit[0];
                artist=textSplit[1];
                lookingFor()
              });      

        break;
    case "exit":
        process.exit()    
}
}