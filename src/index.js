import "./styles.css";
import $ from "jquery";
import YT from "youtubejs";

window.onload = function () {
  var script = document.createElement("script");
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
  googleTranslateElementInit();
};

var Spotify = require("node-spotify-api");

var url_string = window.location.href;
var url = new URL(url_string);
var track = url.searchParams.get("track");
var album = url.searchParams.get("album");
var artist = url.searchParams.get("artist");
console.log(url_string, track, album, artist);

document.getElementById("helpBtn").addEventListener("click", function () {
  console.log("Help!");
  document.getElementById("guideBtn").click();
});

document.getElementById("helpBtn").style.visibility = "visible";

/*var track = url.searchParams.get("track") || "Notturno";
var album = url.searchParams.get("album");
var artist = url.searchParams.get("artist") || "Leonardo Sartori";*/

var platforms = [
  {
    id: "Spotify",
    src:
      "https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png",
    width: "48px"
  },
  {
    id: "Deezer",
    src:
      "https://dwglogo.com/wp-content/uploads/2016/06/5-color-logo-of-deezer.png",
    width: "64px"
  },
  {
    id: "Itunes",
    src:
      "https://logos-download.com/wp-content/uploads/2016/06/iTunes_logo_icon.png",
    width: "48px"
  },
  {
    id: "Youtube",
    src:
      "https://www.freepnglogos.com/uploads/youtube-logo-icon-transparent---32.png",
    width: "64px"
  }
];

var type = getType();
var query = getQuery();

console.log(type);
console.log("Hai cercato: " + query);

function getType() {
  if (track !== null) return "track";
  else if (album !== null) return "album";
  else if (artist !== null) return "artist";
}

function getQuery() {
  var stringa = "";
  if (track !== null) stringa += track + " ";
  else if (album !== null) stringa += album + " ";

  if (artist !== null) stringa += artist;
  return stringa;
}

/*
document.getElementById("Spotify").addEventListener("click", function () {
  getSpotify();
});

document.getElementById("Deezer").addEventListener("click", function () {
  getDeezer();
});*/
function figures() {
  for (const x of platforms) {
    createFigure(x);
  }
}

if (type !== undefined) {
  figures();
  getData();
}

function getData() {
  document.getElementById("helpBtn").remove();
  document.getElementById("dataShow").style.visibility = "visible";
  console.log("Data searched!");
  getDeezer();
  getSpotify();
  getItunes();
  getYoutube();
  createH();
  document.title = url.searchParams.get(type);
}

document.getElementById("openNav").addEventListener("click", function () {
  openNav();
});
document.getElementById("closeNav").addEventListener("click", function () {
  closeNav();
});

document.getElementById("shareBtn").addEventListener("click", function () {
  copyToClipboard(url_string);
});

document.getElementById("embedBtn").addEventListener("click", function () {
  var string =
    "<iframe src='" +
    url_string +
    "' title='" +
    query +
    "'allowfullscreen='true' width='500px' height='700px'></iframe>";
  copyToClipboard(string);
});

function getSpotify() {
  var CLIENT_ID = "3fffcfb44a32410aa1a7d89d343345cb";
  var SECRET = "57860c20b80d47ecae4ea486b71db6ec";

  var spotify = new Spotify({
    id: CLIENT_ID,
    secret: SECRET
  });

  spotify
    .search({ type: type, query: query })
    .then(function (response) {
      console.log(response);
      getSpotifyData(response);
    })
    .catch(function (err) {
      console.log(err);
    });
}
/*
const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(JSON.parse(this.responseText));
    getDeezerData(JSON.parse(this.responseText));
  }
});

xhr.open("GET", "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + query);
xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
xhr.setRequestHeader(
  "x-rapidapi-key",
  "4068a594a8msh42e8a5cc99811aap1fe73cjsn19d2228fac09"
);

xhr.send(data);*/

function getDeezer() {
  const settings = {
    async: true,
    crossDomain: true,
    url:
      "https://deezerdevs-deezer.p.rapidapi.com/search?q=" +
      query.replace(" ", "%20"),
    method: "GET",
    headers: {
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      "x-rapidapi-key": "89184c0058mshbb42671959a844ap1924abjsn391f2a36ccc6"
    }
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    if (response.hasOwnProperty("error")) {
      if (response.error.code === 4) {
        getDeezer();
      }
    } else getDeezerData(response);
  });
}

function getItunes() {
  $.ajax({
    url: "https://itunes.apple.com/search",
    crossDomain: true,
    dataType: "jsonp",
    data: {
      term: query,
      entity: "song",
      limit: 24,
      explicit: "No"
    },
    method: "GET",
    success: function (data) {
      console.log(data);
      getItunesData(data);
    },
    error: function (e) {
      console.log(e);
    }
  });
}

function getSpotifyData(data) {
  var url = data[type + "s"].items[0].external_urls.spotify;
  document.getElementById("Spotify").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = url;
    a.click();
  });
  var cover = document.getElementById("coverImage");
  if (type !== "track") cover.src = data[type + "s"].items[0].images[0].url;
  else cover.src = data[type + "s"].items[0].album.images[0].url;
  const favicon = document.getElementById("favicon");
  favicon.setAttribute("href", cover.src);
  var uri;
  if (type === "artist") uri = data[type + "s"].items[0].uri;
  else uri = data[type + "s"].items[0].artists[0].uri;
  createFollowButton(uri);
}

function getDeezerData(data) {
  var url;
  if (type === "track") url = data.data[0].link;
  else if (type === "album")
    url = "https://www.deezer.com/album/" + data.data[0].album.id;
  else if (type === "artist") url = data.data[0].artist.link;
  document.getElementById("Deezer").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = url;
    a.click();
  });
}

function getItunesData(data) {
  var url;
  if (type === "track") url = data.results[0].trackViewUrl;
  else if (type === "album") url = data.results[0].collectionViewUrl;
  else if (type === "artist") url = data.results[0].artistViewUrl;
  document.getElementById("Itunes").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = url;
    a.click();
  });
}

function createH() {
  var h1 = document.getElementById("h1");
  h1.textContent = url.searchParams.get(type);
  window.HTMLTitleElement = h1.textContent;
}

function createFigure(Figure) {
  var figure = document.createElement("figure");
  figure.setAttribute("id", Figure.id);
  var img = document.createElement("img");
  img.setAttribute("src", Figure.src);
  img.setAttribute("alt", Figure.id);
  img.setAttribute("width", Figure.width);
  figure.appendChild(img);
  var caption = document.createElement("figcaption");
  caption.textContent = Figure.id;
  figure.appendChild(caption);
  document.getElementById("images").appendChild(figure);
}

function createFollowButton(uri) {
  var div = document.getElementById("main");
  var foot = document.createElement("div");
  //foot.setAttribute("style", "display: inline-block;");
  foot.setAttribute("class", "follow");
  var iframe = document.createElement("iframe");
  iframe.setAttribute(
    "src",
    "https://open.spotify.com/follow/1/?uri=" +
      uri +
      "&size=detail&theme=dark&show-count=0"
  );
  iframe.setAttribute("width", "200");
  iframe.setAttribute("height", "56");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("style", "border: none; overflow: hidden;");
  iframe.setAttribute("allowtransparency", "true");
  foot.appendChild(iframe);
  foot.style.minHeight = div.clientHeight;
  console.log(div.clientHeight, foot.style.minHeight);
  div.appendChild(foot);
}

function openNav() {
  document.getElementById("mySidenav").style.width = "270px";
  document.getElementById("main").style.marginLeft = "270px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function copyToClipboard(string) {
  navigator.clipboard.writeText(string);
}

$("#shareBtn").click(function () {
  $("div.alert-div").fadeIn(300).delay(2000).fadeOut(400);
});
$("#embedBtn").click(function () {
  $("div.alert-div").fadeIn(300).delay(2000).fadeOut(400);
});

function getYoutube() {
  YT.init({ key: "AIzaSyDiqt9D6qEaVbFfvGtdowBD2KwnzcTkDAw" });
  // Search
  YT.search
    .list({ part: "snippet", q: query })
    .then((searchResults) => getYoutubeData(searchResults));
}

function getYoutube2() {
  YT.init({ key: "AIzaSyCjb9fbMuYU850HzFIBcCx-x8V2FwyURdE" });
  // Search
  YT.search
    .list({ part: "snippet", q: query })
    .then((searchResults) => getYoutubeData(searchResults));
}

function createIframeYT(id) {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("id", "youtube");
  iframe.setAttribute("src", "https://www.youtube.com/embed/" + id);
  iframe.setAttribute("width", "280");
  iframe.setAttribute("height", "160");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );
  iframe.setAttribute("allowfullscreen", "true");
  iframe.setAttribute("style", "margin: 20px 0;");
  return iframe;
}

function getYoutubeData(data) {
  console.log(data);
  if (data.hasOwnProperty("error")) {
    document.getElementById("Youtube").style.visibility = "hidden";
    getYoutube2();
  } else {
    document.getElementById("Youtube").style.visibility = "visible";
    var id = data.items[0].id.videoId;
    var center = document.getElementById("center");
    if (type !== "artist") {
      center.appendChild(createIframeYT(id));
    } else {
      document.getElementById("Youtube").remove();
    }
    var url = "https://www.youtube.com/watch?v=" + id;
    document.getElementById("Youtube").addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = url;
      a.click();
    });
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "it" },
    "google_translate_element"
  );
}
