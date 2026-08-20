(function () {
  'use strict';

  var config = window.RAKUTEN_GUIDE_GA4 || {};
  var measurementId = String(config.measurementId || '').trim();
  var productionHost = 'mayukos2.github.io';
  var productionPath = '/rakuten-guide/marathon/';

  // ID未設定・ローカル確認・別ページではGoogleへ何も送らず、Cookieも作りません。
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;
  if (location.hostname !== productionHost || location.pathname !== productionPath) return;

  var pageLocation = location.origin + location.pathname;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // 検索文字・参照元・広告向けシグナル・個人IDは送信しません。
  window.gtag('set', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ignore_referrer: true,
    page_referrer: '',
    page_location: pageLocation,
    page_title: 'rakuten-guide',
    language: '',
    screen_resolution: ''
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ignore_referrer: true,
    page_referrer: '',
    page_location: pageLocation,
    page_title: 'rakuten-guide'
  });

  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(googleTag);

  function sendEvent(name) {
    window.gtag('event', name, {
      send_to: measurementId,
      page_referrer: '',
      page_location: pageLocation,
      page_title: 'rakuten-guide'
    });
  }

  // 「何人来たか」をGA4のユーザー数で確認するためのページ閲覧です。
  sendEvent('page_view');

  // URLや表示文は送らず、ページ内で固定した匿名名だけを送ります。
  var anonymousLinkNames = {
    'entry-marathon': 'link_guide_01',
    'entry-0and5': 'link_guide_02',
    'entry-3980': 'link_guide_03',
    'travel': 'link_guide_04',
    'room-collection': 'link_guide_05',
    'product-live-1': 'link_product_01',
    'product-live-2': 'link_product_02',
    'product-live-4': 'link_product_03',
    'product-live-5': 'link_product_04',
    'product-live-6': 'link_product_05',
    'product-sun-1': 'link_product_06',
    'product-sun-2': 'link_product_07',
    'product-sun-3': 'link_product_08',
    'product-sun-4': 'link_product_09',
    'product-beauty-1': 'link_product_10',
    'product-beauty-2': 'link_product_11',
    'product-beauty-3': 'link_product_12',
    'product-daily-1': 'link_product_13',
    'product-daily-2': 'link_product_14',
    'product-travel-1': 'link_product_15',
    'product-travel-2': 'link_product_16',
    'product-travel-3': 'link_product_17',
    'product-travel-4': 'link_product_18'
  };

  Array.prototype.forEach.call(document.querySelectorAll('a[data-aff]'), function (link) {
    var anonymousName = anonymousLinkNames[link.getAttribute('data-aff')];
    if (!anonymousName) return;
    link.addEventListener('click', function () {
      sendEvent(anonymousName);
    });
  });

  var reached = {};
  var thresholds = [25, 50, 75, 90, 100];

  function trackScrollDepth() {
    var root = document.documentElement;
    var scrollable = root.scrollHeight - window.innerHeight;
    var percent = scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);

    thresholds.forEach(function (threshold) {
      if (percent < threshold || reached[threshold]) return;
      reached[threshold] = true;
      sendEvent('scroll_' + threshold);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      trackScrollDepth();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('load', trackScrollDepth);
})();
