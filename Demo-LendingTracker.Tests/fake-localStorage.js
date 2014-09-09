define([], function () {

    function FakeLocalStorage() {
        var self = this;

        self.length = 0;
        self.keys = [];

        return self;
    }


    FakeLocalStorage.prototype.key = function (i) {
        var self = this;
        return self.keys[i];
    };

    FakeLocalStorage.prototype.getItem = function (key) {
        var self = this;
        return self[key];
    };

    FakeLocalStorage.prototype.setItem = function (key, value) {
        var self = this;
        self[key] = value;
        if (self.keys.indexOf(key) === -1) {
            self.keys.push(key);
        }
        self.length = self.keys.length;
    };

    FakeLocalStorage.prototype.removeItem = function (key) {
        var self = this;
        delete self[key];

        var index = self.keys.indexOf(key);
        self.keys.splice(index, 1); // remove item

        self.length = self.keys.length;
    };

    FakeLocalStorage.prototype.clear = function () {
        var self = this;

        for (var i = 0; i < self.keys.length; i++) {
            var key = self.keys[i];
            self[key] = undefined;
        }

        self.keys = [];
        self.length = 0;
    };



    return FakeLocalStorage;
});