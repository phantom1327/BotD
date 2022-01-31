function BotDetector(args) {
  var self = this;
  self.isBot = false;
  self.tests = {};
  throttle = 0;
  score = 0;

  var selectedTests = args.tests || [];
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.USER_AGENT) != -1
  ) {
    self.tests[BotDetector.Tests.USER_AGENT] = function () {
      var botPattern =
        "(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
      var re = new RegExp(botPattern, "i");
      var userAgent = navigator.userAgent;
      if (!re.test(userAgent)) {
        self.tests[BotDetector.Tests.USER_AGENT] = true;
      }
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.SCROLL) != -1
  ) {
    self.tests[BotDetector.Tests.SCROLL] = function () {
      var e = function () {
        self.tests[BotDetector.Tests.SCROLL] = true;
        self.update();
        self.unbindEvent(window, BotDetector.Tests.SCROLL, e);
        self.unbindEvent(document, BotDetector.Tests.SCROLL, e);
      };
      self.bindEvent(window, BotDetector.Tests.SCROLL, e);
      self.bindEvent(document, BotDetector.Tests.SCROLL, e);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.MOUSE) != -1
  ) {
    self.tests[BotDetector.Tests.MOUSE] = function (event) {
      var e = function (event) {
        if (event.movementX >= 1 && event.movementY >= 1) {
          if (throttle > 5) self.tests[BotDetector.Tests.MOUSE] = true;
          self.update();
          self.unbindEvent(window, BotDetector.Tests.MOUSE, e);
        }
        throttle++;
      };
      self.bindEvent(window, BotDetector.Tests.MOUSE, e);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.KEYUP) != -1
  ) {
    self.tests[BotDetector.Tests.KEYUP] = function () {
      var e = function () {
        self.tests[BotDetector.Tests.KEYUP] = true;
        self.update();
        self.unbindEvent(window, BotDetector.Tests.KEYUP, e);
      };
      self.bindEvent(window, BotDetector.Tests.KEYUP, e);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.SWIPE) != -1
  ) {
    self.tests[BotDetector.Tests.SWIPE_TOUCHSTART] = function () {
      var e = function () {
        self.tests[BotDetector.Tests.SWIPE_TOUCHSTART] = true;
        self.update();
        self.unbindEvent(document, BotDetector.Tests.SWIPE_TOUCHSTART);
      };
      self.bindEvent(document, BotDetector.Tests.SWIPE_TOUCHSTART);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.DEVICE_MOTION) != -1
  ) {
    self.tests[BotDetector.Tests.DEVICE_MOTION] = function () {
      var e = function (event) {
        if (
          event.rotationRate.alpha ||
          event.rotationRate.beta ||
          event.rotationRate.gamma
        ) {
          var userAgent = navigator.userAgent.toLowerCase();
          var isAndroid = userAgent.indexOf("android") != -1;
          var beta = isAndroid
            ? event.rotationRate.beta
            : Math.round(event.rotationRate.beta / 10) * 10;
          var gamma = isAndroid
            ? event.rotationRate.gamma
            : Math.round(event.rotationRate.gamma / 10) * 10;
          if (!self.lastRotationData) {
            self.lastRotationData = {
              beta: beta,
              gamma: gamma,
            };
          } else {
            var movement =
              beta != self.lastRotationData.beta ||
              gamma != self.lastRotationData.gamma;
            if (isAndroid) {
              movement = movement && (beta > 0.2 || gamma > 0.2);
            }
            var args = { beta: beta, gamma: gamma };
            self.tests[BotDetector.Tests.DEVICE_MOTION] = movement;
            self.update();
            if (movement) {
              self.unbindEvent(window, BotDetector.Tests.DEVICE_MOTION, e);
            }
          }
        } else {
          self.tests[BotDetector.Tests.DEVICE_MOTION] = false;
        }
      };
      self.bindEvent(window, BotDetector.Tests.DEVICE_MOTION, e);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.DEVICE_ORIENTATION) != -1
  ) {
    self.tests[BotDetector.Tests.DEVICE_ORIENTATION] = function () {
      var e = function () {
        self.tests[BotDetector.Tests.DEVICE_ORIENTATION] = true;
        self.update();
        self.unbindEvent(window, BotDetector.Tests.DEVICE_ORIENTATION, e);
      };
      self.bindEvent(window, BotDetector.Tests.DEVICE_ORIENTATION);
    };
  }
  if (
    selectedTests.length == 0 ||
    selectedTests.indexOf(BotDetector.Tests.DEVICE_ORIENTATION_MOZ) != -1
  ) {
    self.tests[BotDetector.Tests.DEVICE_ORIENTATION_MOZ] = function () {
      var e = function () {
        self.tests[BotDetector.Tests.DEVICE_ORIENTATION_MOZ] = true;
        self.update();
        self.unbindEvent(window, BotDetector.Tests.DEVICE_ORIENTATION_MOZ);
      };
      self.bindEvent(window, BotDetector.Tests.DEVICE_ORIENTATION_MOZ);
    };
  }

  self.cases = {};
  self.timeout = args.timeout || 1000;
  self.callback = args.callback || null;
  self.detected = false;
}

BotDetector.Tests = {
  USER_AGENT: "userAgent",
  KEYUP: "keyup",
  MOUSE: "mousemove",
  SWIPE: "swipe",
  SWIPE_TOUCHSTART: "touchstart",
  SWIPE_TOUCHMOVE: "touchmove",
  SWIPE_TOUCHEND: "touchend",
  SCROLL: "scroll",
  GESTURE: "gesture",
  GYROSCOPE: "gyroscope",
  DEVICE_MOTION: "devicemotion",
  DEVICE_ORIENTATION: "deviceorientation",
  DEVICE_ORIENTATION_MOZ: "MozOrientation",
};
BotDetector.prototype.update = function (notify) {
  var self = this;
  var count = 0;
  var tests = 0;
  for (var i in self.tests) {
    if (self.tests.hasOwnProperty(i)) {
      self.cases[i] = self.tests[i] === true;
      if (self.cases[i] === true) {
        count++;
      }
    }
    tests++;
  }
  countScores();
  self.isBot = count == 0;
  self.allMatched = count == tests;
  if (notify !== false) {
    self.callback(self);
  }
};

BotDetector.prototype.bindEvent = function (e, type, handler) {
  if (e.addEventListener) {
    e.addEventListener(type, handler, false);
  } else if (e.attachEvent) {
    e.attachEvent("on" + type, handler);
  }
};

BotDetector.prototype.unbindEvent = function (e, type, handle) {
  if (e.removeEventListener) {
    e.removeEventListener(type, handle, false);
  } else {
    var evtName = "on" + type;
    if (e.detachEvent) {
      if (typeof e[evtName] === "undefined") {
        e[type] = null;
      }
      e.detachEvent(evtName);
    }
  }
};
BotDetector.prototype.init = function () {
  var self = this;
  for (var i in this.tests) {
    if (this.tests.hasOwnProperty(i)) {
      this.tests[i].call();
    }
  }
  this.update(false);
  setTimeout(function () {
    self.update(true);
  }, self.timeout);
};
BotDetector.prototype.updateScore(){

	if(this.test['useragent'] ?? false){
		this.score = 0;
	}
	else{
		this.score += 20;
	}
}
