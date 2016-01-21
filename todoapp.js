$(document).ready(function() {

var app = {}

app.todo = Backbone.Model.extend({

            defaults: {

                title: '',
                category: 'misc',
                completed: false,
                id: undefined

            }

        });

app.todolist = Backbone.Collection.extend({

            model: app.todo,

            localStorage: new Store('ToDo-store')

        });

app.List = new app.todolist();


app.categoryView = Backbone.View.extend({

            template: _.template($('#category-template').html()),

            initialize: function(params) {

                this.category = params.category;
                this.models = params.models;
                this.render();

            },

            render: function() {

            this.$el.html(this.template(this.category));  

            _.each(this.models, this.addTodo, this);

            return this;

            },

            addTodo: function(model) {

            var view = new app.todoView({'model': model});
            this.$el.append(view.render().el);

            }
        });

app.todoView = Backbone.View.extend({

            template: _.template($('#todo').html()),

            render: function() {

                this.$el.html(this.template(this.model));
                return this;

            }

        });

app.View = Backbone.View.extend({

        el: '#container',

        initialize: function() {

            app.List.on('add reset', this.display, this);
            app.List.fetch();

        },

        events: {

        // starts from here after initialization
        'click #add': 'addToList',

        },

        id: 0,

        addToList: function() {

            var title = $('#title').val();
            var category = $('#category').val();

            app.List.add({'title': title, 'category': category, completed: false, id: ++(this.id)});

        },

        display: function() {

            $('#todo-list').html('');

            var groupedByCategory = _.groupBy(app.List.toJSON(), 'category');
            _.each(groupedByCategory, this.displayCategory);

        },

        displayCategory: function(models, category) {

            var params = {category: {'category': category, category_id: '#'+category}, 'models': models};

            var catView = new app.categoryView( params);
            $('#todo-list').append(catView.el);

        },

        toggle: function(element) {

           var model = app.List.get(parseInt(element.id));
           model.set('completed', !model.get('completed'));

           appView.display();

        }

});

window.appView = new app.View();

});
