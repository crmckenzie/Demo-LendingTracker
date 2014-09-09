define(['ko', 'jquery', 'app/title-viewmodel'], function (ko, $, TitleViewModel) {

    function MediaListViewModel(options) {
        var self = this;

        var defaults = {
            localStorage: window.localStorage
        };

        this.settings = $.extend({}, defaults, options);

        this.media = ko.observableArray([]);

        this.newTitle = ko.observable("");
        this.newAuthor = ko.observable("");
        this.newType = ko.observable("");

        this.selectedTitle = ko.observable(null);
        this.proposedBorrower = ko.observable("");
        this.titleToBorrow = ko.computed(function () {
            if (self.selectedTitle()) {
                return self.selectedTitle().title();
            }
            return "";
        }, self);

        this.display = ko.observable("media");

        this.isDirty = ko.observable(false);

        this.showNewTitleForm = ko.computed(function () {
            return self.display() === 'newTitleForm';
        }, self);

        this.showMedia = ko.computed(function () {
            return self.display() === 'media';
        }, self);

        this.canAddNewTitle = ko.computed(function () {
            if (self.newTitle() && self.newAuthor() && self.newType()) {
                return true;
            }
            return false;
        }, self);

        this.borrowedItems = ko.computed(function () {
            return self.media().filter(function (e) {
                return e.borrowedBy();
            }).length;
        }, self);

        this.displayBorrowForm = function (title) {
            self.selectedTitle(title);
            self.display('borrower-form');
        };


        this.borrow = function () {
            self.selectedTitle().borrow(self.proposedBorrower());
            this.isDirty(true);
            this.display('media');
        };

        this.cancelBorrow = function () {
            this.display('media');
        };

        this.addNewTitle = function () {
            var title = new TitleViewModel();
            title.title(self.newTitle());
            title.author(self.newAuthor());
            title.type(self.newType());

            self.media.push(title);
            self.display('media');

            this.isDirty(true);
        };

        this.cancelAddNewTitle = function () {
            self.display('media');
        };

        this.displayNewTitleForm = function () {
            self.display('newTitleForm');
        };

        this.save = function () {
            var media = self.media().map(function (e) {
                return e.flatten();
            });

            this.settings.localStorage.setItem('personal-lending-library', JSON.stringify(media));

            self.isDirty(false);
        };

        this.exportData = function () {
            alert('not yet implemented');
        };

        this.importData = function () {
            alert('not yet implemented');
        };
    }

    return MediaListViewModel;

});