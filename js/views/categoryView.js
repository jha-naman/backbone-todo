var app = app || {};
app.categoryView = Backbone.View.extend({

    template: _.template($('#category-template').html()),

    initialize: function (params) {

        this.category = params.category;
        this.models = params.models;
        this.render();

    },

    render: function () {

        this.$el.html(this.template(this.category));
        this.$el.attr("id", this.category.category);

        $("#todo-list").append(this.el);
        
        _.each(this.models, this.addTodo, this);

        return this;

    },

    addTodo: function (model) {

        if (!model._id) {
            model._id = model._cid;
        }

        var view = new app.todoView({ 'model': model });
        $("#"+ this.category.category).append(view.render().el);

    }
});
