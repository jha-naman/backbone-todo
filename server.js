var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser());

var application_route = __dirname;

app.get('/', function(req, res) {
    res.sendFile(path.join(application_route,'index.html'));
});

app.listen(3000);

mongoose.connect('mongodb://localhost/ToDoList');

var todo = mongoose.Schema({
    title: String,
    category: String,
    completed: Boolean
});

var todoModel = mongoose.model('todo', todo);

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
        title : req.body.title,
        category: req.body.category,
        completed: req.body.completed
    });
    todo.save(function(err) {
        if (err) {
            return;
        };
        console.log(todo);
        res.send(todo);
    });
});

app.get('/todo/:id', function(req, res) {
    todoModel.find(function(err, result) {
        if (err) {
            console.log('Error in get todo/id');
        }
        todoModel.find({'id': req.params.id}, function(err, result) {
            if (err) return;
            res.send(result);
        });
    });
});

app.put('/todo/:id', function(req, res) {
    todoModel.find( {'id': request.params.id} , function( err, todo ) {
        todo.title = request.body.title;
        todo.category = request.body.category;
        todo.completed = request.body.complated;
   
        return todo.save( function( err ) {
            if( !err ) {
                console.log( 'todo updated' );
                return response.send( todo );
            } else {
                console.log( err );
            }
       });
    }); 
});


app.delete('todo/:id', function(req, res) {
    todoModel.find({'id': req.params}, function(err, todo) {
        if (err) {
            console.log('Error in delete todo id');
            return;
        };
        todo.remove(function(err) {
         if (err) {
            console.log('Error in delete todo id');
            return;
        };
        res.send('')   
        });
    });
});
