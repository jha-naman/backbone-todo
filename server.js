var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express();
mongoose.connect('mongodb://localhost/listoftodo');


var application_route = __dirname;
app.use(express.static(path.join(application_route, 'js')));
app.use(express.static(path.join(application_route, 'static')));
app.use(bodyParser());


var todo = mongoose.Schema({
    title: String,
    category: String,
    completed: Boolean
});

var todoModel = mongoose.model('todo', todo);


app.get('/', function(req, res) {
    res.sendFile(path.join(application_route,'index.html'));
});

app.get('/todo', function(req, res) {
     todoModel.find(function(err, result) {
        if (err) {
            return console.log('Error in get /todo');
        };
        return res.send(result);
    });
});



app.post('/todo', function(req, res) {
    var todo = new todoModel({
        id: req.body.id,
        title : req.body.title,
        category: req.body.category,
        completed: req.body.completed,
    });
    todo.save(function(err) {
        if (err) {
            return res.send('');
        };
        res.send(todo);
    });
});

app.get('/todo/:id', function(req, res) {
    todoModel.findById(req.params.id, function(err, result) {
        if (err) {
            console.log('Error in get todo/id');
            return res.send('');
        }
            res.send(result);
    });
});

app.put('/todo/:id', function(req, res) {
    todoModel.findById(req.params.id, function(err, todo) {
        if (err) {
            console.log('error in put')
            return res.send('');
        }
        todo.title = req.body.title;
        todo.category = req.body.category;
        todo.completed = req.body.completed;
        todo.save(function(err) {
            if (!err) {
                return res.send(todo);
            }
            res.send('err');
        });
    });
});

app.delete('/todo/:id', function(req, res) {
    todoModel.findByIdAndRemove(req.params.id, function(err) {if (err) console.log(err)});
    res.send('');
});


app.listen(3001);
