const fs = require("fs");

var express = require("express");
var path = require("path");

var app = express();
var PORT = 3000;

var notes = [];

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

fs.readFile('db/db.json', 'utf8', function(error, data) {
    
    if(error) {
        return console.log(error);
    }

    if(data) {
        data = JSON.parse(data);
        console.log('parsedData', data);
        notes.push(data);
        console.log('notes: ', notes);
    }


});

// ROUTES
// ============================================================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

app.get("/api/notes/:id", function(req, res) {
    var noteID = req.params.id;

    console.log(noteID);

    for (var i = 0; i < notes.length; i++) {
        if(noteID === notes[i].routeName) {
            return res.json(notes[i]);
        }
    }

    return res.json(false);
});


// Create New Note
app.post("/api/notes", function(req, res) {

    var newNote = req.body;

    newNote.id = notes.length + 1;

    newNote.routeName = newNote.id;

    console.log(newNote);

    notes.push(newNote);

    notesStringify = JSON.stringify(notes);

    fs.writeFile('db/db.json', notesStringify, function(err) {
        if(err) {
            return console.log(err);
        }
    });

    res.json(newNote);

});

app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});