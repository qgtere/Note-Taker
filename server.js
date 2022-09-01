const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const newNote ={
            id : uuidv4(),
            title,
            text
        }
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), 
                  (writeError) =>
                    writeError
                      ? console.err(writeErr)
                      : console.info('Notes successfully updated!')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote
        };
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting the new note');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening in the port ${PORT}...`);
});