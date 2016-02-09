var app = app || {};

app.todoView = Backbone.View.extend({

    template: _.template($('#todo').html()),

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    }

});