var app = app || {};

app.todoView = Backbone.View.extend({

    template: _.template($('#todo').html()),
    
    tagName: "textarea",
    
    className: "task",

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    }

});