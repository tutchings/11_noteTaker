const fs = require("fs");
var express = require("express");
var path = require("path");

var app = express();

// Set port for deployment of app
var PORT = process.env.PORT || 3000;

// global variable declarations
var notes = [];


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// reads db.json and saves data in notes variable
const readDB = () => {

    fs.readFile('db/db.json', 'utf8', function(error, data) {
    
        if(error) {
            return console.log(error);
        }
    
        if(data) {
            notes = JSON.parse(data);
        }
    
    }); // end fs.readFile

} // end function readDB()


// initializes notes data by running readDB() to pull notes data from db.json
readDB();


// ROUTES
// ============================================================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    readDB();
    console.log('api notes: ', notes);
    return res.json(notes);
});

app.get("/api/notes/:id", function(req, res) {

    //pulls id from url and saves in noteID variable
    var noteID = req.params.id;

    //converts noteId to number rather than string
    noteID = parseInt(noteID);

    //loops through notes to find the object with an id that matches what the user entered in the url
    //returns the note object with the matching id
    for (var i = 0; i < notes.length; i++) {
        if(noteID === notes[i].routeName) {
            return res.json(notes[i]);
        }
    }

    return res.json(false);

});

app.delete('/api/notes/:id', function(req, res) {

    //pulls id from url and saves in noteID variable
    var noteID = req.params.id;

    //converts noteId to number rather than string
    noteID = parseInt(noteID);

    // for loop to find the notes object that matches the id entered by the user in the url
    for (var i = 0; i < notes.length; i++) {

        //run the following code when the object with matching id is found
        if(noteID === notes[i].routeName) {

            //delete note object with matching id from the notes array
            notes.splice(i, 1);

            //stringify the notes array so it can be pushed to db.json
            notesStringify = JSON.stringify(notes);

            //write the stringified notes array to db.json
            fs.writeFile('db/db.json', notesStringify, function(err) {
                if(err) {
                    return console.log(err);
                }
            }); //end fs.writeFile

        } // end if conditional

    } // end for loop

    //reruns the readDB() function to account for the deleted object
    readDB();

}); //end app.delete


// Create New Note
app.post("/api/notes", function(req, res) {

    var newNote = req.body;

    //takes only the ids from the notes array and stores them in the idArray
    var idArray = notes.map(function (obj) {
        return obj.id;
    });
    
    // if the idArray is not empty, determine the max id from the idArray
    // this is used to ensure that every note has a unique id
    if (idArray.length !== 0) {
        var maxId = Math.max(...idArray);
    } else {
        var maxId = 0;
    }

    //set the new note's id to maxId + 1
    newNote.id = maxId + 1;

    //set the new note's routeName equal to the new note's id
    newNote.routeName = newNote.id;

    //push new note to the notes global array
    notes.push(newNote);

    //stringifies the notes array in preparation to be written to the db.json file
    notesStringify = JSON.stringify(notes);

    //writes stringified notes array to db.json
    fs.writeFile('db/db.json', notesStringify, function(err) {
        if(err) {
            return console.log(err);
        }
    });

    res.json(newNote);

}); //end app.post


//port listener
app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});