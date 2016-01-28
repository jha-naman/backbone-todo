var app = {}

app.todo = Backbone.Model.extend({

            defaults: {

                title: '',
                category: 'misc',
                completed: false,
            
            },

            url: 'todo'

        });

app.todolist = Backbone.Collection.extend({

            model: app.todo,

            url: '/todo'
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

            if (!model._id) {
                model._id =model._cid;
            }

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


            app.List.on('add reset change', this.display, this);
            app.List.fetch({reset: true});

        },

        events: {

        // starts from here after initialization
        'click #add': 'addToList',

        },

        addToList: function() {

            var title = $('#title').val();
            var category = $('#category').val();

            app.List.create({'title': title, 'category': category, completed: false});

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

           var model = app.List.findWhere({_id: element.id.trim()});
           model.set('completed', !model.get('completed'));
           model.sync('update', model);

           appView.display();

        }

});

appView = new app.View();

