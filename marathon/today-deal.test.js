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
assert.equal(
  deal.getLocalPreviewDate({ hostname: 'localhost', search: '?preview-now=2026-08-24T20%3A01%3A00%2B09%3A00' }).toISOString(),
  '2026-08-24T11:01:00.000Z'
);
assert.equal(
  deal.getLocalPreviewDate({ hostname: 'mayukos2.github.io', search: '?preview-now=2026-08-24' }),
  null
);
assert.equal(deal.getNextDeal(new Date('2026-08-21T15:01:00Z')).day, 25);
assert.equal(deal.getNextDeal(new Date('2026-08-30T15:01:00Z')).day, 1);

function fakeDocument() {
  var message = { textContent: '' };
  var container = {
    hidden: true,
    dataset: {},
    removeAttribute: function (name) {
      if (name === 'data-deal') delete this.dataset.deal;
    },
    getAttribute: function (name) {
      if (name === 'data-marathon-start') return '2026-09-04T20:00:00+09:00';
      if (name === 'data-marathon-end') return '2026-09-11T01:59:00+09:00';
      return null;
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
deal.showTodayDeal(new Date('2026-09-01T15:01:00Z'), ordinary.document);
assert.equal(ordinary.container.hidden, false);
assert.equal(
  ordinary.message.textContent,
  '今日はもしかしたらクーポンが出てるかも？でも次の5と0のつく日（9/5）まで待った方がお得！'
);

var saleTime = fakeDocument();
deal.showTodayDeal(new Date('2026-09-04T11:01:00Z'), saleTime.document);
assert.equal(saleTime.container.hidden, false);
assert.equal(
  saleTime.message.textContent,
  '今はスーパーセール中！急ぎだったり、限定クーポンが出ているなら今買うのもあり。でも9/5の5と0のつく日まで待った方がよりお得かも！'
);

console.log('today-deal tests: OK');
