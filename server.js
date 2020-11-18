var express = require("express");
var path = require("path");

var app = express();
var PORT = 3000;

var notes = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
// ============================================================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(notes);
});


// Create New Note
app.post("/api/notes", function(req, res) {

    var newNote = req.body;

    newNote.routeName = newNote.id;

    console.log(newNote);

    notes.push(newNote);

    res.json(newNote);

});

app.listen(PORT, function() {
    console.log("App listening on port " + PORT);
});