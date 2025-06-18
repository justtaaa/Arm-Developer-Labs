(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    var search = (window.search || (window.search = {}));
    var useDefaultSearchBox = window.useDefaultSearchBox === undefined ? true : window.useDefaultSearchBox;

    /* --------------------------------------------------
     *  Modal wiring (unchanged)
     * --------------------------------------------------*/
    var $searchModal = $('.js-page-search-modal');
    var $searchToggle = $('.js-search-toggle');
    var searchModal = $searchModal.modal({ onChange: handleModalChange, hideWhenWindowScroll: true });
    var modalVisible = false;
    search.searchModal = searchModal;

    var $searchBox = null;
    var $searchInput = null;
    var $searchClear = null;

    function getModalVisible() {
      return modalVisible;
    }
    search.getModalVisible = getModalVisible;

    function handleModalChange(visible) {
      modalVisible = visible;
      if (visible) {
        search.onShow && search.onShow();
        useDefaultSearchBox && $searchInput[0] && $searchInput[0].focus();
      } else {
        search.onShow && search.onHide();
        useDefaultSearchBox && $searchInput[0] && $searchInput[0].blur();
        setTimeout(function() {
          useDefaultSearchBox && ($searchInput.val(''), $searchBox.removeClass('not-empty'));
          search.clear && search.clear();
          window.pageAsideAffix && window.pageAsideAffix.refresh();
        }, 400);
      }
    }

    $searchToggle.on('click', function() {
      modalVisible ? searchModal.hide() : searchModal.show();
    });

    $(window).on('keyup', function(e) {
      if (!modalVisible && !window.isFormElement(e.target || e.srcElement) && (e.which === 83 || e.which === 191)) {
        searchModal.show();
      }
    });

    /* --------------------------------------------------
     *  Default in‑modal search box wiring (unchanged)
     * --------------------------------------------------*/
    if (useDefaultSearchBox) {
      $searchBox = $('.js-search-box');
      $searchInput = $searchBox.children('input');
      $searchClear = $searchBox.children('.js-icon-clear');

      search.getSearchInput = function() {
        return $searchInput.get(0);
      };
      search.getVal = function() {
        return $searchInput.val();
      };
      search.setVal = function(val) {
        $searchInput.val(val);
      };

      $searchInput.on('focus', function() {
        $(this).addClass('focus');
      });
      $searchInput.on('blur', function() {
        $(this).removeClass('focus');
      });
      $searchInput.on('input', window.throttle(function () {
        var val = $(this).val();
        if (val === '' || typeof val !== 'string') {
          search.clear && search.clear();
        } else {
          $searchBox.addClass('not-empty');
          search.onInputNotEmpty && search.onInputNotEmpty(val);
        }
      }, 400));

      $searchClear.on('click', function () {
        $searchInput.val('');
        $searchBox.removeClass('not-empty');
        search.clear && search.clear();
      });
    }

    /* --------------------------------------------------
     *  SEARCH LOGIC (title + content)
     * --------------------------------------------------*/
    search.onInputNotEmpty = function (val) {
      const q = val.trim().toLowerCase();
      const hits = [];

      const data = window.TEXT_SEARCH_DATA || {};

      Object.keys(data).forEach(section => {
        data[section].forEach(item => {
          const inTitle   = item.title   && item.title.toLowerCase().includes(q);
          const inContent = item.content && item.content.toLowerCase().includes(q);
          if (inTitle || inContent) hits.push(item);
        });
      });

      renderSearchResults(hits, q);
    };

    search.clear = function () {
      $('.js-search-result').empty();
    };

    /* --------------------------------------------------
     *  Rendering helpers
     * --------------------------------------------------*/
    function renderSearchResults(results, query) {
      var $resultsContainer = $('.js-search-result');
      $resultsContainer.empty();

      if (results.length === 0) {
        $resultsContainer.append('<div class="search-no-result">No results found.</div>');
        return;
      }

      results.forEach(function (item) {
        var snippet = item.content ? item.content.substr(0, 150) + '…' : '';
        $resultsContainer.append(
          '<div class="search-result-item">' +
            '<a href="' + item.url + '">' +
              '<h3>' + highlightMatch(item.title, query) + '</h3>' +
              '<p>' + highlightMatch(snippet, query) + '</p>' +
            '</a>' +
          '</div>'
        );
      });
    }

    function highlightMatch(text, query) {
      if (!text) return '';
      var regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  });
})();