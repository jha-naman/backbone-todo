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

    events: {
        "keydown": "handleEvents"
    },

    addTodo: function (model) {

        if (!model._id) {
            model._id = model._cid;
        }

        var view = new app.todoView({ 'model': model });
        $("#"+ this.category.category).append(view.render().el);

    },

    handleEvents: function(event) {
        self = this;
        var handler = {
            "38": moveOnUpArrow,
            "40": moveOnDownArrow
        }

        function moveOnUpArrow() {
            var prevCategory = self.$el.prev();
            if (prevCategory.length) {
                prevCategory.children().last().focus();
            }
        }

        function moveOnDownArrow() {
            var next = self.$el.children().next();
            if (next.length) {
                self.$el.children()[1].focus();
            }
        }
        var fn = handler[String(event.which)];
        if (fn) {
            fn();
        }
    }
});
