var app = app || {};

app.View = Backbone.View.extend({

    el: '#container',

    initialize: function () {

        app.List.on('add reset change', this.display, this);
        app.List.fetch({ reset: true });

    },

    events: {

        // starts from here after initialization
        'click #add': 'addToList',

    },

    addToList: function () {

        var title = $('#title').val();
        var category = $('#category').val();

        app.List.create({ 'title': title, 'category': category, completed: false });

    },

    display: function () {

        $('#todo-list').html('');

        var groupedByCategory = _.groupBy(app.List.toJSON(), 'category');
        _.each(groupedByCategory, this.displayCategory);

    },

    displayCategory: function (models, category) {

        var params = { category: { 'category': category, category_id: '#' + category }, 'models': models };

        var catView = new app.categoryView(params);
        $('#todo-list').append(catView.el);

    },

    toggle: function (element) {

        var model = app.List.findWhere({ _id: element.id.trim() });
        model.set('completed', !model.get('completed'));
        model.sync('update', model);

        appView.display();

    }

});

appView = new app.View();
