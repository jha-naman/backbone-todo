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

    initialize: function () {
        this.updateTask = _.debounce(function () {
            var input = this.$el.val();
            if (input) {
                var model = app.List.get(this.model._id);
                model.set("title", input);
                model.save();
            }
        }.bind(this), 2000);
    },

    keysPressed: {
        "17": false, // ctrl
        "9": false // tab
    },

    render: function () {

        this.$el.html(this.template(this.model));
        return this;

    },

    update: function () {
        this.updateTask();
    },

    resize: function (event) {
        this.$el.css("height", "auto");
        this.$el.css("height", app.dimensionUtils.getTextAreaHeightFromScrollHeight(this.el.scrollHeight) + "px");
        if (event.which == 17 || event.which == 9) {
            this.keysPressed[String(event.which)] = false;
        }
    },

    keyEvents: function (event) {

        var self = this;
        var input = this.$el.val();
        var model = getModelFromCollection();

        var handler = {
            "38": moveOnUpArrow,
            "40": moveOnDownArrow,
            "8": deleteOnBackSpace,
            "13": saveOnEnter,
            "17": setKeyPressedToFalse, //ctrl
            "9": setKeyPressedToFalse, // tab
        };

        function moveOnDownArrow() {
            if (!self.keysPressed[17]) {
                if (self.$el.next().length) {
                    self.$el.next().focus();
                    return;
                }
                if (self.$el.parent().next().length) {
                    var next = self.$el.parent().next();
                    next.children()[0].focus();
                }
            } else {

                var newTask = app.List.create({ title: "", category: model.get("category") });

            }
        }

        function moveOnUpArrow() {
            self.$el.prev().focus();
        }

        function getModelFromCollection() {
            var model = app.List.findWhere(self.model);
            return model;
        }

        function deleteOnBackSpace() {

            if (!input) {
                model.destroy();
                event.preventDefault();
            } else if (self.keysPressed[17]) {
                model.set("completed", false);
            }
        }

        function setKeyPressedToFalse() {
            self.keysPressed[String(event.which)] = true;
        }

        function saveOnEnter() {
            if (self.keysPressed[17]) {
                model.set("completed", true);
            }
        }

        this.update();

        var fn = handler[String(event.which)];
        if (fn) {
            return fn();
        }
    }

});
