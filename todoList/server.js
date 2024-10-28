const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

let tasks = [
    { id: 1, description: 'Learn Express', completed: false },
    { id: 2, description: 'Make a Rest API', completed: false },
];

app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === id);
    task ? res.json(task) : res.status(404).send('Task not found');
});

app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        description: req.body.description,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === id);
    
    if (task) {
        task.completed = req.body.completed ?? task.completed;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);
    
    if (index !== -1) {
        tasks.splice(index, 1);
        res.status(204).send(); 
    } else {
        res.status(404).send('Task not found');
    }
});

const port = 3000;
const host = 'localhost'

app.listen(port, () => {
    console.log(`Server running in http://${host}:${port}`);
});
