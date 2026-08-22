'use strict';

var assert = require('node:assert/strict');
var deal = require('./today-deal.js');

assert.equal(deal.getDealForDay(1).name, 'ワンダフルデー');
[5, 10, 15, 20, 25, 30].forEach(function (day) {
  assert.equal(deal.getDealForDay(day).name, '5と0のつく日');
});
assert.equal(deal.getDealForDay(18).name, 'ご愛顧感謝デー');
[2, 4, 17, 19, 31].forEach(function (day) {
  assert.equal(deal.getDealForDay(day), null);
});

assert.equal(
  deal.getTokyoDay(new Date('2026-08-31T15:01:00Z')),
  1,
  '日本時間の月初で判定する'
);
assert.equal(
  deal.getTokyoDay(new Date('2026-08-17T15:01:00Z')),
  18,
  '日本時間の18日で判定する'
);
assert.equal(
  deal.getLocalPreviewDay({ hostname: '127.0.0.1', search: '?preview-deal-day=18' }),
  18
);
assert.equal(
  deal.getLocalPreviewDay({ hostname: 'mayukos2.github.io', search: '?preview-deal-day=18' }),
  null,
  '公開ページではプレビュー指定を無効にする'
);

function fakeDocument() {
  var message = { textContent: '' };
  var container = {
    hidden: true,
    dataset: {},
    removeAttribute: function (name) {
      if (name === 'data-deal') delete this.dataset.deal;
    },
    querySelector: function () { return message; }
  };
  return {
    container: container,
    message: message,
    document: {
      getElementById: function () { return container; }
    }
  };
}

var first = fakeDocument();
deal.showTodayDeal(new Date('2026-08-31T15:01:00Z'), first.document);
assert.equal(first.container.hidden, false);
assert.equal(first.message.textContent, '今日はワンダフルデーだからお買い得日🉐');

var ordinary = fakeDocument();
deal.showTodayDeal(new Date('2026-08-21T15:01:00Z'), ordinary.document);
assert.equal(ordinary.container.hidden, true);

console.log('today-deal tests: OK');
