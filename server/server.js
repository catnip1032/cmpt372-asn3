var express = require('express');
const path = require('path');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3001
const { Pool } = require('pg');

// For production
var pool = new Pool({})

// For debugging purposess only
// var pool = new Pool({
//     connectionString: 'postgres://postgres:password@localhost:5432/postgres'
// })

app.use('/', cors());

app.use(express.json());
app.use(express.urlencoded( {extended:false} ));

app.use(express.static(path.resolve(__dirname, "../build")));

app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
});

// GET - notes-get-all/
app.get('/notes-get-all', async (req, res) => {
    var getNoteQuery = `SELECT * FROM notes`;
    try {
        const result = await pool.query(getNoteQuery);
        res.json(result.rows);
    } catch (error) {
        res.status(500).end(error.toString());
    }
});

// GET - notes-get/
app.get('/notes-get/:id', async (req, res) => {
    const noteId = req.query.id;
    var getNoteQuery = `SELECT * FROM notes WHERE note_id = $1`;
    try {
        const result = await pool.query(getNoteQuery, [noteId]);
        res.json(result);
    } catch (error) {
        res.end(error);
    }
});

// POST - notes-save/
app.post('/notes-save', async (req, res) => {
    var title = req.body.noteTitle;
    var body = req.body.noteBody;
    var createdOn = req.body.createdOn;
    var lastModified = req.body.lastModified;
    var addNoteQuery = `INSERT INTO notes (title, body, created_on, last_modified) VALUES ($1,$2,$3,$4)`;
    let data = [title, body, createdOn, lastModified];
    try {
        const result = await pool.query(addNoteQuery,data);
        res.redirect('/notes-get-all');
    } catch (error) {
        res.status(500).end(error.toString());
    }
});

// DELETE - notes-delete/:id 
app.delete('/notes-delete/:id', async (req, res) => {
    // delete note from database
    var id = req.query.id;
    try {
        var deleteNoteQuery = `DELETE FROM Notes WHERE note_id = $1`;
        const result = await pool.query(deleteNoteQuery, [id]);
        res.send(result);
    }catch (error) {
        res.status(500).end(error.toString());
    }
});

// PUT - notes-update/
app.put(`/notes-update`, async (req, res) => {
// Update note from database
const lastModified = req.body.lastModified;
const id = req.body.id;
const typeOfUpdate = req.body.typeOfUpdate;
const title = req.body.noteTitle;
const body = req.body.noteBody;
var updateQuery = ``;
var data = [];
if (typeOfUpdate === "titleAndBody") {
    updateQuery = `UPDATE Notes SET title = $1, body = $2, last_modified = $3 WHERE note_id = $4`;
    data = [title, body, lastModified, id];
} else if (typeOfUpdate === "title") {
    updateQuery = `UPDATE Notes SET title = $1, last_modified = $2 WHERE note_id = $3`;
    data = [title,lastModified, id];
} else if (typeOfUpdate === "body"){
    updateQuery = `UPDATE Notes SET body = $1, last_modified = $2 WHERE note_id = $3`;
    data = [body, lastModified, id];
}
try {
    const result = await pool.query(updateQuery, data);
    res.send(result);
    }catch (error) {
    res.end(error);
}
});