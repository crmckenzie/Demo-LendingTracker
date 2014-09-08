define(['ko', 'PubSub'], function (ko, PubSub) {

    function Title(data) {
        var self = this;

        if (!data) {
            data = {};
        }

        this.title = ko.observable(data.title || "");
        this.author = ko.observable(data.author || "");
        this.type = ko.observable(data.type || "");
        this.borrowedBy = ko.observable(data.borrowedBy);

        this.borrow = function (borrower) {
            self.borrowedBy(borrower);
        };

        this.unborrow = function () {
            self.borrowedBy(null);
            PubSub.publish('unborrow', self);
        };

        this.canBorrow = ko.computed(function () {
            return self.borrowedBy() == null;
        }, self);

        this.canUnBorrow = ko.computed(function () {
            if (self.borrowedBy()) {
                return true;
            }
            return false;
        }, self);

        this.flatten = function () {
            return {
                title: self.title(),
                author: self.author(),
                type: self.type(),
                borrowedBy: self.borrowedBy()
            };
        };

        this.remove = function () {
            alert('Not yet implemented');
        };

        this.edit = function () {
            alert('Not yet implemented');
        };
    }

    return Title;

});