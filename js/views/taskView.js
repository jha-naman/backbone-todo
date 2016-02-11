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

    keysPressed: {
        "17": false, // ctrl
        "9": false // tab
    },

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    },

    resize: function (event) {
        this.$el.css("height", "auto");
        this.$el.css("height", app.dimensionUtils.getTextAreaHeightFromScrollHeight(this.el.scrollHeight) + "px");
        if (event.which == 17 || event.which == 9) {
            this.keysPressed[String(event.which)] = false;
        }
    },

    keyEvents: function (event) {
        // this.resize();

        var self = this;
        var input = this.$el.val();

        var handler = {
            "38": moveOnUpArrow,
            "40": moveOnDownArrow,
            "8": deleteOnBackSpace,
            "13": saveOnEnter,
            "17": setKeyPressedToFalse, //ctrl
            "9": setKeyPressedToFalse, // tab
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

        function getModelFromCollection() {
            var model = app.List.findWhere(self.model);
                if (!model.get("id")) {
                    model.set("id", model.get("_id"));
                }
                return model;
        }

        function deleteOnBackSpace() {
            var model = getModelFromCollection();
            if (!input) {
                model.destroy();
                model.sync("delete", model);
            } else if (self.keysPressed[17]) {
                model.set("completed", false);
                model.sync("update", model);
            }
        }

        function setKeyPressedToFalse() {
            self.keysPressed[String(event.which)] = true;
        }

        function saveOnEnter() {
            if (/^:.*/.test(input)) {
                // its a category handle it differently
            }
            var model = getModelFromCollection();
            if (self.keysPressed[17]) {
                model.set("completed", true);
            }
            model.save();
            model.sync("update", model);
        }

        var fn = handler[String(event.which)];
        if (fn) {
            fn();
            event.stopPropagation();
        }
    }

});
