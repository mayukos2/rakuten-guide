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

  function getTokyoDateParts(date) {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(date || new Date());
    var values = {};
    parts.forEach(function (part) {
      if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
        values[part.type] = Number(part.value);
      }
    });
    return values;
  }

  function getTokyoDay(date) {
    return getTokyoDateParts(date).day;
  }

  function getNextDeal(date) {
    var current = getTokyoDateParts(date);
    for (var offset = 1; offset <= 31; offset += 1) {
      var candidate = new Date(Date.UTC(current.year, current.month - 1, current.day + offset));
      var deal = getDealForDay(candidate.getUTCDate());
      if (deal) {
        return {
          year: candidate.getUTCFullYear(),
          month: candidate.getUTCMonth() + 1,
          day: candidate.getUTCDate(),
          deal: deal
        };
      }
    }
    return null;
  }

  function isDuringMarathon(date, container) {
    var start = Date.parse(container.getAttribute('data-marathon-start') || '');
    var end = Date.parse(container.getAttribute('data-marathon-end') || '');
    var now = (date || new Date()).getTime();
    return Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end;
  }

  function setMessage(container, messageText, dealName) {
    var message = container.querySelector('[data-today-deal-message]');
    if (message) message.textContent = messageText;
    container.dataset.deal = dealName;
    container.hidden = false;
  }

  function showDealForDay(day, documentObject) {
    var doc = documentObject || root.document;
    if (!doc) return null;
    var container = doc.getElementById('today-deal');
    if (!container) return null;
    var deal = getDealForDay(day);
    if (!deal) return null;
    setMessage(container, deal.message, deal.name);
    return deal;
  }

  function showTodayDeal(date, documentObject) {
    var currentDate = date || new Date();
    var doc = documentObject || root.document;
    if (!doc) return null;
    var container = doc.getElementById('today-deal');
    if (!container) return null;
    var deal = getDealForDay(getTokyoDay(currentDate));
    if (deal) {
      setMessage(container, deal.message, deal.name);
      return deal;
    }

    var next = getNextDeal(currentDate);
    if (!next) {
      container.hidden = true;
      container.removeAttribute('data-deal');
      return null;
    }
    var nextLabel = next.month + '/' + next.day + 'の' + next.deal.name;
    if (isDuringMarathon(currentDate, container)) {
      setMessage(
        container,
        '今はマラソン中！急ぎだったり、限定クーポンが出ているなら今買うのもあり。でも' + nextLabel + 'まで待った方がよりお得かも！',
        'マラソン中'
      );
    } else {
      setMessage(
        container,
        '今日はもしかしたらクーポンが出てるかも？でも次の' + next.deal.name + '（' + next.month + '/' + next.day + '）まで待った方がお得！',
        '通常日'
      );
    }
    return { name: container.dataset.deal, next: next };
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

  function getLocalPreviewDate(locationObject) {
    if (!locationObject) return null;
    if (locationObject.hostname !== 'localhost' && locationObject.hostname !== '127.0.0.1') {
      return null;
    }
    var value = new URLSearchParams(locationObject.search || '').get('preview-now');
    if (!value) return null;
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  var api = {
    getDealForDay: getDealForDay,
    getTokyoDateParts: getTokyoDateParts,
    getTokyoDay: getTokyoDay,
    getNextDeal: getNextDeal,
    isDuringMarathon: isDuringMarathon,
    getLocalPreviewDay: getLocalPreviewDay,
    getLocalPreviewDate: getLocalPreviewDate,
    showDealForDay: showDealForDay,
    showTodayDeal: showTodayDeal
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RakutenTodayDeal = api;

  if (root.document) {
    var render = function () {
      var previewDate = getLocalPreviewDate(root.location);
      var previewDay = getLocalPreviewDay(root.location);
      if (previewDate) showTodayDeal(previewDate);
      else if (previewDay !== null) showDealForDay(previewDay);
      else showTodayDeal();
    };
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
