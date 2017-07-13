import $ from 'jquery';

const $searchBar = $('.search-bar');

export default class Search {
    constructor() {
        this.activate();
    }

    activate() {
        var _this = this;

        //Search button click event
        $('.js-search').on('click', function () {
            _this.showSearchBar();
        });

        //Close search click event
        $searchBar.find('.close-search').on('click', function () {
            _this.hideSearchBar();
        });

        //ESC key on pressed
        $searchBar.find('input[type="text"]').on('keyup', function (e) {
            if (e.keyCode == 27) {
                _this.hideSearchBar();
            }
        });
    }
    showSearchBar() {
        $searchBar.addClass('open');
        $searchBar.find('input[type="text"]').focus();
    }
    hideSearchBar() {
        $searchBar.removeClass('open');
        $searchBar.find('input[type="text"]').val('');
    }
}

new Search()
