var ip,
  visitorId,
  configBrowserFeatureDetection = true,
  navigatorAlias = navigator,
  windowAlias = window,
  documentAlias = document,
  screenAlias = window.screen,
  // Browser client hints
  clientHints = {},
  clientHintsRequestQueue = [],
  clientHintsResolved = false,
  clientHintsResolving = false,
  // Browser features via client-side data collection
  browserFeatures = {},
  // Hash function
  hash = sha1,
  encodeWrapper = windowAlias.encodeURIComponent,
  /* decode */
  decodeWrapper = windowAlias.decodeURIComponent,
  /* urldecode */
  urldecode = unescape,
  //user params
  client_id,
  session_id;

const setSessionId = () => {
  try {
    let sessionIdCookie = getCookie("med_session_id");
    if (sessionIdCookie) {
      let decodedCookie = windowAlias.decodeURIComponent(document.cookie);
      let cookieArr = decodedCookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        // console.log(cookiePair);
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if ("med_session_id" == cookiePair[0].trim()) {
          // Decode the cookie value and return
          session_id = decodeURIComponent(cookiePair[1]);
          //   console.log("setSessionId", session_id);
        }
      }
    }

    if (!sessionIdCookie) {
      const d = new Date();
      d.setTime(d.getTime() + 1 * 60 * 1000);

      let expires = "expires=" + d.toUTCString();
      let createdSessionId = generateRandomUuid();
      document.cookie =
        "med_session_id" + "=" + createdSessionId + ";" + expires + ";path=/";
      session_id = createdSessionId;
    }
  } catch (error) {
    console.log("setSessionId", error);
  }
};

const setClientId = () => {
  try {
    let clientIdCookie = getCookie("med_id");
    if (clientIdCookie) {
      let decodedCookie = windowAlias.decodeURIComponent(document.cookie);
      let cookieArr = decodedCookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if ("med_id" == cookiePair[0].trim()) {
          // Decode the cookie value and return
          client_id = decodeURIComponent(cookiePair[1]);
          //   console.log("setClientId", client_id);
        }
      }
      //   console.log("setClientId", clientIdCookie);
      //   client_id = clientIdCookie.
    }
    if (!clientIdCookie) {
      let createdClientId = generateRandomUuid();
      document.cookie = "med_id" + "=" + createdClientId;
      client_id = createdClientId;
    }
  } catch (error) {
    console.log("setClientId", error);
  }
};

const getCookie = (cookieName) => {
  try {
    let cookieExists = document.cookie.match(cookieName);
    return cookieExists;
  } catch (error) {
    console.log("getCookie", error);
  }
};

function generateRandomUuid() {
  //   var browserFeatures = detectBrowserFeatures();
  return hash(
    (navigatorAlias.userAgent || "") +
      (navigatorAlias.platform || "") +
      //   windowAlias.JSON.stringify(browserFeatures) +
      new Date().getTime() +
      Math.random()
  ).slice(0, 16);
}

//get referer
function getReferrer() {
  var referrer = "";

  try {
    referrer = windowAlias.top.document.referrer;
  } catch (e) {
    if (windowAlias.parent) {
      try {
        referrer = windowAlias.parent.document.referrer;
      } catch (e2) {
        referrer = "";
      }
    }
  }

  if (referrer === "") {
    referrer = documentAlias.referrer;
  }

  return referrer;
}

/*
 * Extract parameter from URL
 */
function getUrlParameter(url, name) {
  var regexSearch = "[\\?&#]" + name + "=([^&#]*)";
  var regex = new RegExp(regexSearch);
  var results = regex.exec(url);
  return results ? safeDecodeWrapper(results[1]) : "";
}

function safeDecodeWrapper(url) {
  try {
    return decodeWrapper(url);
  } catch (e) {
    return unescape(url);
  }
}

function urlFixup(hostName, href, referrer) {
  if (!hostName) {
    hostName = "";
  }

  if (!href) {
    href = "";
  }

  if (hostName === "translate.googleusercontent.com") {
    // Google
    if (referrer === "") {
      referrer = href;
    }

    href = getUrlParameter(href, "u");
    hostName = getHostName(href);
  } else if (
    hostName === "cc.bingj.com" || // Bing
    hostName === "webcache.googleusercontent.com" || // Google
    hostName.slice(0, 5) === "74.6."
  ) {
    // Yahoo (via Inktomi 74.6.0.0/16)
    href = documentAlias.links[0].href;
    hostName = getHostName(href);
  }

  return [hostName, href, referrer];
}

/*
 * Fix-up domain
 */
function domainFixup(domain) {
  var dl = domain.length;

  // remove trailing '.'
  if (domain.charAt(--dl) === ".") {
    domain = domain.slice(0, dl);
  }

  // remove leading '*'
  if (domain.slice(0, 2) === "*.") {
    domain = domain.slice(1);
  }

  if (domain.indexOf("/") !== -1) {
    domain = domain.substr(0, domain.indexOf("/"));
  }

  return domain;
}
//get host name
function getHostName(url) {
  // scheme : // [username [: password] @] hostame [: port] [/ [path] [? query] [# fragment]]
  var e = new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),
    matches = e.exec(url);

  return matches ? matches[1] : url;
}
//get device type
function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

// device dimensions
const getDeviceDimensions = () => {
  return {
    width: screenAlias.width,
    height: screenAlias.height,
  };
};

const getIPInfo = async () => {
  try {
    let response = await fetch("https://api.ipify.org?format=json");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("getIPInfo", error);
  }
};

const sendAlog = async (data) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      ...data,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://devserver.medront.com/node/pixel/trackevents",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log("@sendAlog", result))
      .catch((error) => console.error("@sendAlog", error));
  } catch (error) {
    console.log("sendAlog", error);
  }
};

window.onload = function () {
  setClientId();
  setSessionId();
  // getIPInfo();
  //   console.log(
  //     urlFixup(documentAlias.domain, windowAlias.location.href, getReferrer()),
  //     getHostName(windowAlias.location.href)
  //   );

  let locationArray = urlFixup(
    documentAlias.domain,
    windowAlias.location.href,
    getReferrer()
  );

  let event = {
    event: "Page Loaded",
    pixel_id: getSyncScriptParams(),
    visitorId: client_id,
    session_id,
    date: new Date().valueOf(),
    device: {
      brands: navigatorAlias ? navigatorAlias.userAgentData.brands : null,
      platform: navigatorAlias ? navigatorAlias.userAgentData.platform : null,
      deviceDimensions: getDeviceDimensions(),
      device: isMobile() ? "Mobile" : "Desktop",
    },
    referrer: getReferrer(),
    urlParams: getUrlParameter(),
    hostName: getHostName(),
    domainAlias: domainFixup(locationArray[0]),
    locationArray: locationArray,
  };
  console.log(event, "Page Loaded");
  // console.log(event);
  sendAlog(event);
};

//url events
window.navigation.addEventListener("navigate", (e) => {
  let url = new URL(e.destination.url);
  let pixelId = getSyncScriptParams();
  console.log(
    "location changed!",
    e.target,
    {
      event: "url changes",
      date: new Date().valueOf(),
      url: url.href,
      pathname: url.pathname,
      pixelId: pixelId,
    },
    url
  );

  sendAlog({
    event: "url changes",
    date: new Date().valueOf(),
    url: url.href,
    pathname: url.pathname,
    pixel_id: getSyncScriptParams(),
    visitorId: client_id,
    session_id,
  });
});

//scroll event
window.addEventListener("scroll", function () {
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    let pixelId = getSyncScriptParams();

    if (
      Math.round(scrollPercentage) === 25 ||
      Math.round(scrollPercentage) === 50 ||
      Math.round(scrollPercentage) === 75 ||
      Math.round(scrollPercentage) === 100
    ) {
      console.log("Scroll Percentage:", {
        event: "Page Scroll",
        percentage: Math.round(scrollPercentage),
        date: new Date().valueOf(),
        pixelId: pixelId,
      });

      sendAlog({
        event: "Page Scroll",
        percentage: Math.round(scrollPercentage),
        date: new Date().valueOf(),
        pixel_id: getSyncScriptParams(),
        visitorId: client_id,
        session_id,
      });
    }
  } catch (error) {
    console.log("scroll", error);
  }
});

//click event detect button click and link click

document.addEventListener("click", (e) => {
  try {
    // console.log("Button clicked:", e.target.innerText, e.target);
    let pixelId = getSyncScriptParams();
    if (e.target.tagName === "BUTTON") {
      // Handle the button click event here
      // console.log('Button clicked:', e.target.innerText);
      console.log("clicked", {
        event: "clicked",
        element: "BUTTON",
        date: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
        pixelId: pixelId,
      });

      sendAlog({
        event: "clicked",
        element: "BUTTON",
        date: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
        pixel_id: getSyncScriptParams(),
        visitorId: client_id,
        session_id,
      });
    }

    if (e.target.tagName.toUpperCase() === "A") {
      // Handle the link click event here
      // console.log("link clicked:", e.target.href);
      console.log("clicked", {
        event: "clicked",
        element: "LINK",
        link: e.target.href,
        date: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
        pixelId: pixelId,
      });

      sendAlog({
        event: "clicked",
        element: "LINK",
        link: e.target.href,
        date: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
        pixel_id: getSyncScriptParams(),
        visitorId: client_id,
        session_id,
      });
    }
  } catch (error) {
    console.log("click event", error);
  }
});

//form submission
document.addEventListener("submit", function (e) {
  try {
    e.preventDefault(); //stop page from rerender
    let pixelId = getSyncScriptParams();
    if (e.target) {
      const data = new FormData(e.target);
      let formData = [...data.entries()];
      // let val = e.target.getAttribute('shippingForm')
      // listAttributes()
      // let val = e.target.dataset
      // console.log("@@@@", e.target[0].value)

      let packet = {};
      console.log("SUBMIT**************", {
        event: "submit",
        date: new Date().valueOf(),
        formData: formData.length !== 0 ? formData : packet,
        pixelId: pixelId,
      });
      for (let i = 0; i < e.target.length; i++) {
        let ele = e.target[i];
        // console.log(`${ele.name ? ele.name : ele.placeholder}: ${ele.value}\n`);
        packet[
          ele.name ? ele.name : ele.placeholder ? ele.placeholder : makeid(6)
        ] = ele.value ? ele.value : null;
      }

      console.log("SUBMIT**************", {
        event: "submit",
        date: new Date().valueOf(),
        formData: formData.length !== 0 ? formData : packet,
        pixelId: pixelId,
      });

      sendAlog({
        event: "submit",
        date: new Date().valueOf(),
        formData: formData.length !== 0 ? formData : packet,
        pixel_id: getSyncScriptParams(),
        visitorId: client_id,
        session_id,
      });
    }
  } catch (error) {
    console.log("form submission event", error);
  }
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function getSyncScriptParams() {
  var scripts = document.getElementById("pixelTracker");
  // var lastScript = scripts[scripts.length - 1];
  // console.log(scripts);
  let pixelId = scripts.getAttribute("pixelId");
  return pixelId;
}

/*
 * UTF-8 encoding
 */
function utf8_encode(argString) {
  return unescape(encodeWrapper(argString));
}

function sha1(str) {
  // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // + namespaced by: Michael White (http://getsprink.com)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   jslinted by: Anthon Pang (https://matomo.org)

  var rotate_left = function (n, s) {
      return (n << s) | (n >>> (32 - s));
    },
    cvt_hex = function (val) {
      var strout = "",
        i,
        v;

      for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        strout += v.toString(16);
      }

      return strout;
    },
    blockstart,
    i,
    j,
    W = [],
    H0 = 0x67452301,
    H1 = 0xefcdab89,
    H2 = 0x98badcfe,
    H3 = 0x10325476,
    H4 = 0xc3d2e1f0,
    A,
    B,
    C,
    D,
    E,
    temp,
    str_len,
    word_array = [];

  str = utf8_encode(str);
  str_len = str.length;

  for (i = 0; i < str_len - 3; i += 4) {
    j =
      (str.charCodeAt(i) << 24) |
      (str.charCodeAt(i + 1) << 16) |
      (str.charCodeAt(i + 2) << 8) |
      str.charCodeAt(i + 3);
    word_array.push(j);
  }

  switch (str_len & 3) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (str.charCodeAt(str_len - 1) << 24) | 0x0800000;
      break;
    case 2:
      i =
        (str.charCodeAt(str_len - 2) << 24) |
        (str.charCodeAt(str_len - 1) << 16) |
        0x08000;
      break;
    case 3:
      i =
        (str.charCodeAt(str_len - 3) << 24) |
        (str.charCodeAt(str_len - 2) << 16) |
        (str.charCodeAt(str_len - 1) << 8) |
        0x80;
      break;
  }

  word_array.push(i);

  while ((word_array.length & 15) !== 14) {
    word_array.push(0);
  }

  word_array.push(str_len >>> 29);
  word_array.push((str_len << 3) & 0x0ffffffff);

  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = word_array[blockstart + i];
    }

    for (i = 16; i <= 79; i++) {
      W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;

    for (i = 0; i <= 19; i++) {
      temp =
        (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5a827999) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 20; i <= 39; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 40; i <= 59; i++) {
      temp =
        (rotate_left(A, 5) +
          ((B & C) | (B & D) | (C & D)) +
          E +
          W[i] +
          0x8f1bbcdc) &
        0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    for (i = 60; i <= 79; i++) {
      temp =
        (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }

    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }

  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

  return temp.toLowerCase();
}
