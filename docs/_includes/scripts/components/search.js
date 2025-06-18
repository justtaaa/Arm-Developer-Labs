(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    var search = (window.search || (window.search = {}));
    var useDefaultSearchBox = window.useDefaultSearchBox === undefined ? true : window.useDefaultSearchBox;

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

    let lunrIndex;
    let searchStore;

    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchStore = data;

        lunrIndex = lunr(function () {
          this.ref('id');
          this.field('title', { boost: 10 });
          this.field('content');
          this.field('platform');
          this.field('subjects');
          this.field('support_level');
          this.field('sw_hw');
          this.field('status');

          data.forEach(doc => {
            this.add(doc);
          });
        });
      });

    search.onInputNotEmpty = function (val) {
      if (!lunrIndex) return;
      const query = val.trim();
      const results = lunrIndex.search(query);

      const matches = results.map(r => searchStore.find(p => p.id === r.ref));
      renderSearchResults(matches, query);

    };




    search.clear = function () {
      $('.js-search-result').empty();
    };

    function renderSearchResults(results, query) {
      const $resultsContainer = $('.js-search-result');
      $resultsContainer.empty();

      if (!results.length) {
        $resultsContainer.append('<div class="search-no-result">No results found.</div>');
        return;
      }

      results.forEach(item => {
        const snippet = item.content.substring(0, 150) + '...';
        $resultsContainer.append(`
          <div class="search-result-item">
            <a href="${item.url}">
              <h3>${highlightMatch(item.title, query)}</h3>
              <p>${highlightMatch(snippet, query)}</p>
              <small><strong>Subjects:</strong> ${item.subjects}</small><br/>
              <small><strong>Platform:</strong> ${item.platform}</small>
            </a>
          </div>
        `);
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
