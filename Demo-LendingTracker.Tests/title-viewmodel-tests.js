define(['app/title-viewmodel', 'PubSub'], function(TitleViewModel, PubSub) {

    describe('TitleViewModel', function() {

        describe('default ctor', function() {

            beforeEach(function() {
                this.viewModel = new TitleViewModel();
            });

            it('default values', function() {
                expect(this.viewModel.title()).toBe("");
                expect(this.viewModel.author()).toBe("");
                expect(this.viewModel.type()).toBe("");
                expect(this.viewModel.borrowedBy()).toBe(undefined);
            });

        });

        describe('ctor from model', function() {
            beforeEach(function () {
                this.model = {
                    title: "Working Effectively With Legacy Code",
                    author: "Michael Feathers",
                    type: "book"
                };
                this.viewModel = new TitleViewModel(this.model);
            });

            it('default values', function () {
                expect(this.viewModel.title()).toBe(this.model.title);
                expect(this.viewModel.author()).toBe(this.model.author);
                expect(this.viewModel.type()).toBe(this.model.type);
                expect(this.viewModel.borrowedBy()).toBe(undefined);
            });

            describe('.borrow', function() {
                it('sets .borrowedBy', function() {
                    this.viewModel.borrow('George');

                    expect(this.viewModel.borrowedBy()).toBe('George');
                });
            });

            describe('.unborrow', function() {

                beforeEach(function() {
                    this.viewModel.borrowedBy('George');
                });

                it('sets borrowedBy to null', function() {
                    this.viewModel.unborrow();

                    expect(this.viewModel.borrowedBy()).toBe(null);
                });

                it('Sends message', function() {

                    var messageReceived = false;
                    var viewModel = this.viewModel;
                    PubSub.publish = PubSub.publishSync;

                    var token = PubSub.subscribe('unborrow', function(msg, data) {
                        expect(data).toBe(viewModel);
                        messageReceived = true;
                    });

                    this.viewModel.unborrow();

                    PubSub.unsubscribe(token);
                    expect(messageReceived).toBe(true);
                });

            });

            describe('.canBorrow', function() {

                it('returns true if there is no current borrower.', function() {
                    expect(this.viewModel.canBorrow()).toBe(true);
                });

                it('returns false if there is a current borrower', function () {
                    this.viewModel.borrow('George');

                    expect(this.viewModel.canBorrow()).toBe(false);
                });

            });

            describe('.canUnBorrow', function () {

                it('returns false if there is no current borrower.', function () {
                    expect(this.viewModel.canUnBorrow()).toBe(false);
                });

                it('returns true if there is a current borrower', function () {
                    this.viewModel.borrow('George');

                    expect(this.viewModel.canUnBorrow()).toBe(true);
                });

            });

            describe('.flatten', function() {
                it('creates a JSON version of the viewModel.', function() {
                    var result = this.viewModel.flatten();

                    expect(result.title).toBe(this.viewModel.title());
                    expect(result.author).toBe(this.viewModel.author());
                    expect(result.type).toBe(this.viewModel.type());
                    expect(result.borrowedBy).toBe(this.viewModel.borrowedBy());
                });
            });

        });

    });

});