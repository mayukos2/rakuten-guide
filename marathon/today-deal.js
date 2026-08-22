(function (root) {
  'use strict';

  var DEALS = {
    wonderful: {
      name: 'ワンダフルデー',
      message: '今日はワンダフルデーだからお買い得日🉐'
    },
    zeroAndFive: {
      name: '5と0のつく日',
      message: '今日は5と0のつく日だからお買い得日🉐'
    },
    appreciation: {
      name: 'ご愛顧感謝デー',
      message: '今日はご愛顧感謝デーだからお買い得日🉐'
    }
  };

  function getDealForDay(day) {
    var numericDay = Number(day);
    if (numericDay === 1) return DEALS.wonderful;
    if (numericDay === 18) return DEALS.appreciation;
    if (numericDay >= 5 && numericDay <= 30 && numericDay % 5 === 0) {
      return DEALS.zeroAndFive;
    }
    return null;
  }

  function getTokyoDay(date) {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      day: 'numeric'
    }).formatToParts(date || new Date());
    var dayPart = parts.find(function (part) { return part.type === 'day'; });
    return dayPart ? Number(dayPart.value) : NaN;
  }

  function showDealForDay(day, documentObject) {
    var doc = documentObject || root.document;
    if (!doc) return null;
    var container = doc.getElementById('today-deal');
    if (!container) return null;
    var deal = getDealForDay(day);
    if (!deal) {
      container.hidden = true;
      container.removeAttribute('data-deal');
      return null;
    }
    var message = container.querySelector('[data-today-deal-message]');
    if (message) message.textContent = deal.message;
    container.dataset.deal = deal.name;
    container.hidden = false;
    return deal;
  }

  function showTodayDeal(date, documentObject) {
    return showDealForDay(getTokyoDay(date), documentObject);
  }

  function getLocalPreviewDay(locationObject) {
    if (!locationObject) return null;
    if (locationObject.hostname !== 'localhost' && locationObject.hostname !== '127.0.0.1') {
      return null;
    }
    var match = /(?:^|[?&])preview-deal-day=(\d{1,2})(?:&|$)/.exec(locationObject.search || '');
    if (!match) return null;
    var day = Number(match[1]);
    return day >= 1 && day <= 31 ? day : null;
  }

  var api = {
    getDealForDay: getDealForDay,
    getTokyoDay: getTokyoDay,
    getLocalPreviewDay: getLocalPreviewDay,
    showDealForDay: showDealForDay,
    showTodayDeal: showTodayDeal
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RakutenTodayDeal = api;

  if (root.document) {
    var render = function () {
      var previewDay = getLocalPreviewDay(root.location);
      if (previewDay !== null) showDealForDay(previewDay);
      else showTodayDeal();
    };
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
