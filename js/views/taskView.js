var app = app || {};

app.todoView = Backbone.View.extend({

    template: _.template($('#todo').html()),

    tagName: "textarea",

    className: "task",

    events: {
        "keydown": "keyEvents"
    },

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    },

    keyEvents: function () {
        var self = this;
        var input = this.$el.val();

        var handler = {
            "40": moveOnUpArrow,
            "38": moveOnDownArrow,
            "8": deleteOnBackSpace,
        };

        function moveOnDownArrow() {
            self.$el.prev().focus();
        }

        function moveOnUpArrow() {
            self.$el.next().focus();
        }

        function deleteOnBackSpace() {
            if (!input) {
                var model = app.List.findWhere(self.model);
                if (!model.get("id")) {
                    model.set("id", model.get("_id"));
                }
                model.destroy();
                model.sync("delete", model);
            }
        }

        var fn = handler[String(event.which)];
        if (fn) {
            fn();
        }
    }

});
