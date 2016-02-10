var app = app || {};

app.todo = Backbone.Model.extend({

    defaults: {

        title: '',
        category: 'misc',
        completed: false,

    },

});

app.todolist = Backbone.Collection.extend({

    model: app.todo,

    url: '/todo'
});

app.List = new app.todolist();
