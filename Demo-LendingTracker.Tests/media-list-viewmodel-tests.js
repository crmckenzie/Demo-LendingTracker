define(['app/media-list-viewmodel', 'app/title-viewmodel', 'jquery', 'tests/fake-localStorage'],
    function (MediaListViewModel, TitleViewModel, $, FakeLocalStorage) {

    describe('MediaListViewModel', function() {
        
        function getTestData() {
            return [
                { title: "Clean Code", author: "Robert C. Martin", type: "Book", borrowedBy: "Mike" },
                { title: "The Art of Unit Testing", author: "Roy Osherove", type: "Book", borrowedBy: "Joel" },
                { title: "Working Effectively With Legacy Code", author: "Michael Feathers", type: "Book", borrowedBy: null },
                { title: "Head First Design Patterns", author: "Elisabeth Freeman", type: "Book", borrowedBy: "Joel" },
                { title: "Javascript: The Good Parts", author: "Douglas Crockford", type: "Book", borrowedBy: null },
                { title: "Apprenticeship Patterns", author: "Dave Hoover", type: "Book", borrowedBy: null },
            ];
        }


        describe('.ctor', function () {
            beforeEach(function () {
                this.localStorage = new FakeLocalStorage();
                this.viewModel = new MediaListViewModel({
                    localStorage: this.localStorage
                });
            });

            it('default values', function () {
                expect(this.viewModel.newTitle()).toBe("");
                expect(this.viewModel.newAuthor()).toBe("");
                expect(this.viewModel.newType()).toBe("");

                expect(this.viewModel.selectedTitle()).toBe(null);
                expect(this.viewModel.proposedBorrower()).toBe("");
                expect(this.viewModel.titleToBorrow()).toBe("");

                expect(this.viewModel.display()).toBe("media");
                expect(this.viewModel.isDirty()).toBe(false);

                expect(this.viewModel.showNewTitleForm()).toBe(false);
                expect(this.viewModel.showMedia()).toBe(true);

            });

            describe('.showNewTitleForm', function() {

                it('returns true when display === "newTitleForm"', function() {
                    this.viewModel.display('newTitleForm');

                    expect(this.viewModel.showNewTitleForm()).toBe(true);
                });

                it('returns false when display is anything else', function() {
                    expect(this.viewModel.showNewTitleForm()).toBe(false);
                });

            });

            describe('.showMedia', function () {

                it('returns true when display === "media"', function () {
                    this.viewModel.display('media');

                    expect(this.viewModel.showMedia()).toBe(true);
                });

                it('returns false when display is anything else', function () {
                    this.viewModel.display('something else');
                    expect(this.viewModel.showMedia()).toBe(false);
                });

            });

            describe('.canAddNewTitle', function() {

                beforeEach(function() {
                    this.viewModel.newTitle('Dr. No');
                    this.viewModel.newAuthor('Ian Fleming');
                    this.viewModel.newType('Book');
                });

                it('returns true', function() {
                    expect(this.viewModel.canAddNewTitle()).toBe(true);
                });

                it('returns false when there is no new title', function() {
                    this.viewModel.newTitle('');
                    expect(this.viewModel.canAddNewTitle()).toBe(false);
                });

                it('returns false when there is no new author', function () {
                    this.viewModel.newAuthor('');
                    expect(this.viewModel.canAddNewTitle()).toBe(false);
                });

                it('returns false when there is no new type', function () {
                    this.viewModel.newType('');
                    expect(this.viewModel.canAddNewTitle()).toBe(false);
                });
            });

            describe('.borrowedItems', function() {

                beforeEach(function () {
                    var data = getTestData();
                    var media = $.map(data, function (e) {
                        return new TitleViewModel(e);
                    });
                    this.viewModel.media(media);
                });

                it('returns items with a populated .borrowedBy', function() {
                    var items = this.viewModel.borrowedItems();
                    expect(items).toBe(3);
                });

            });

            describe('.displayBorrowForm', function() {

                beforeEach(function() {
                    this.title = this.viewModel.media()[2];
                });

                it('sets selectedTitle', function() {
                    this.viewModel.displayBorrowForm(this.title);

                    expect(this.viewModel.selectedTitle()).toBe(this.title);
                });

                it('sets display to borrower-form', function () {
                    this.viewModel.display('media');

                    this.viewModel.displayBorrowForm(this.title);

                    expect(this.viewModel.display()).toBe('borrower-form');
                });

            });

            describe('.borrow', function() {
                beforeEach(function () {
                    this.title = {
                        borrow: function() {},
                        borrowedBy: function () { },
                        title: function(){}
                    };

                    spyOn(this.title, 'borrow');

                    this.viewModel.selectedTitle(this.title);
                    this.viewModel.proposedBorrower('Sally');
                });

                it('invokes borrow on selectedTitle', function() {
                    this.viewModel.borrow();

                    expect(this.title.borrow).toHaveBeenCalledWith('Sally');
                });

                it('sets isDirty to true', function () {
                    this.viewModel.borrow();

                    expect(this.viewModel.isDirty()).toBe(true);
                });

                it('sets display to media', function () {
                    this.viewModel.display('borrower-form');

                    this.viewModel.borrow();

                    expect(this.viewModel.display()).toBe('media');
                });

            });

            describe('.cancelBorrow', function() {

                it('sets display to media', function() {
                    this.viewModel.display('borrower-form');

                    this.viewModel.cancelBorrow();

                    expect(this.viewModel.display()).toBe('media');
                });
            });

            describe('.addNewTitle', function() {

                beforeEach(function () {
                    this.viewModel.display('newTitleForm');

                    this.viewModel.newTitle('The Wall');
                    this.viewModel.newAuthor('Pink Floyd');
                    this.viewModel.newType('CD');

                    this.viewModel.addNewTitle();
                });

                it('adds the new title to media', function () {

                    var last = this.viewModel.media()[this.viewModel.media().length - 1];

                    expect(last.title()).toBe('The Wall');
                    expect(last.author()).toBe('Pink Floyd');
                    expect(last.type()).toBe('CD');
                    expect(last.borrowedBy()).toBe(undefined);
                });

                it('sets display to media', function() {
                    expect(this.viewModel.display()).toBe('media');
                });

                it('sets isDirty to true', function() {
                    expect(this.viewModel.isDirty()).toBe(true);
                });

            });

            describe('.cancelAddNewTitle', function() {
                beforeEach(function () {
                    this.viewModel.display('newTitleForm');

                    this.viewModel.newTitle('The Wall');
                    this.viewModel.newAuthor('Pink Floyd');
                    this.viewModel.newType('CD');

                    this.viewModel.cancelAddNewTitle();
                });

                it('resets display to media', function() {
                    expect(this.viewModel.display()).toBe('media');
                });
            });

            describe('.displayNewTitleForm', function() {
                it('sets display to newTitleForm', function() {

                    this.viewModel.displayNewTitleForm();

                    expect(this.viewModel.display()).toBe('newTitleForm');
                });

            });

            describe('.save', function() {

                beforeEach(function() {
                    this.viewModel.isDirty(true);

                    this.viewModel.save();
                });

                it('sets isDirty to false', function() {
                    expect(this.viewModel.isDirty()).toBe(false);
                });

                it('persists data in localStorage', function() {
                    expect(this.localStorage.keys).toContain('personal-lending-library');
                });

            });

            describe('.load', function() {

                beforeEach(function() {
                    var data = getTestData();
                    var media = $.map(data, function (e) {
                        return new TitleViewModel(e);
                    });
                    this.viewModel.media(media);

                    this.viewModel.save();

                    this.viewModel.media([]);
                });

                it('loads data from localStorage', function() {
                    this.viewModel.load();

                    expect(this.viewModel.media().length).toBe(6);
                });

                it('sets isDirty to false', function() {
                    expect(this.viewModel.isDirty()).toBe(false);
                });
            });

        });

    });

});