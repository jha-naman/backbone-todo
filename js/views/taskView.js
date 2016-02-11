var app = app || {};

app.todoView = Backbone.View.extend({

    template: _.template($('#todo').html()),

    tagName: "textarea",

    className: "task",

    events: {
        "keydown": "keyEvents",
        "paste": "resize",
        "cut": "resize",
        "keyup": "resize",
    },

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    },

    resize: function () {
        this.$el.css("height", "auto");
        this.$el.css("height", app.dimensionUtils.getTextAreaHeightFromScrollHeight(this.el.scrollHeight) + "px");
    },

    keyEvents: function () {
        // this.resize();

        var self = this;
        var input = this.$el.val();
        var previous = this.previous;
        this.previous = event.which;

        var handler = {
            "38": moveOnUpArrow,
            "40": moveOnDownArrow,
            "8": deleteOnBackSpace,
            "13": saveOnEnter
        };

        function moveOnDownArrow() {
            if (self.$el.next().length) {
                self.$el.next().focus();
                return;
            }
            if (self.$el.parent().next().length) {
                var next = self.$el.parent().next();
                next.children()[0].focus();
            }
        }

        function moveOnUpArrow() {
            self.$el.prev().focus();
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

        function saveOnEnter() {
            if (/^:.*/.test(input)) {
                console.log("its a category");
            }
        }

        var fn = handler[String(event.which)];
        if (fn) {
            fn();
        }

    }

});
