'use strict';

var script = document.createElement('script');
script.textContent = `

// Options Reset on Load
var boostYouTubePefs = Object.assign(window.boostYouTubePefs || [], {
    playlist : 'XxXxXxXxXxX', // playlist name
    stopvideo : false,      // stop autoplay video when load
    showres: false,         // show resolution
    showrate: false,        // show speed playback
    scale: false,           // scale
    defscale: false,        // defscale
    hidectrls: false        // hide controls in fullscreen
});

// Prefs Triggers
(function(){
var prefs = {
    isStopVideoTrigger: false,
    isOSDTrigger: false,          // set resolution add speed playback addEventListener
    isHideCtrlsTrigger: false,    // set HideCtrls addEventListener
    isScaleTrigger: false,        // set Scale addEventListener
    triggerDistance: 5,
    isHidden: false
};

// Fullscreen scale resolution
var natres = function(e) {

  if (window.fullScreen) {
    var v = document.getElementsByTagName('video')[0];

    var sw = screen.width;
    var sh = screen.height;
    var vw = v.videoWidth;
    var vh = v.videoHeight;

    var scale = vh/sh;


    if (e.keyCode == 82 || (e.type === "fullscreenchange" && boostYouTubePefs.defscale)) {
        if (v.style.scale == 1) {
            v.style.scale = scale;
        }
        else {
            v.style.scale = 1;
        }
    }

  }
}

/********************************
Hide YouTube Fullscreen Controls
*********************************/
function hideControls() {
    var p = document.getElementsByTagName("video")[0].parentElement.parentElement; // v52.8.0
    var i = p.hideControls();
    p.style.cursor = "none";
    prefs.isHidden = true;
}

function showControls() {
    var p = document.getElementsByTagName("video")[0].parentElement.parentElement;
    p.showControls();
    p.style.cursor = "";
    prefs.isHidden = false;
}

var hidepbctrls = function(e) {

    if (e.clientX <= prefs.triggerDistance) {
        hideControls();
    } else if (prefs.isHidden && e.clientX > prefs.triggerDistance) {
        showControls();
    }
}

var showcurspeedandres = function(e) {

    if (e = document.getElementById('ytplaybackinfo')) { e.remove() }

    var curvideores = document.createTextNode(this.videoHeight.toString() + 'p ');
    var resbox = document.createElement('span');
    resbox.id = 'ytpbividres';
    resbox.classList.add('ytpbi-vidres');
    resbox.appendChild(curvideores);
    var curplaybackspeed = document.createTextNode('x' + this.playbackRate.toString());
    var speedbox = document.createElement('span');
    speedbox.id = 'ytpbispeed';
    speedbox.classList.add('ytpbi-speed');
    speedbox.appendChild(curplaybackspeed);
    var ibox = document.createElement('div');
    ibox.classList.add('ytpbi');
    ibox.id = 'ytplaybackinfo';

    if(boostYouTubePefs.showres) {
        ibox.appendChild(resbox);
    }
    if(boostYouTubePefs.showrate) {
        ibox.appendChild(speedbox);
    }

    var fragment = document.createDocumentFragment();
    fragment.appendChild(ibox);
    
    this.parentElement.insertBefore(fragment, this.parentElement.firstChild);
    //this.classList.add('ytby-init'); // I forgot why this line
}

var autoplaypls = function( ) {
    this.removeEventListener('play', autoplaypls);
    var inx = document.location.href.match(/index=/);
    if (inx !== null) {
        var pls = document.location.href.match(/list=([^\&\?\/]+)/)[1];
        if (pls !== boostYouTubePefs.playlist ) {
            boostYouTubePefs.playlist = pls;
            prefs.isStopVideoTrigger = true;
        }
    }
}

function loadplayerinfo() {
    var inx = document.location.href.match(/index=/);
    if (inx === null || boostYouTubePefs.playlist !== document.location.href.match(/list=([^\&\?\/]+)/)[1]) {
        prefs.isStopVideoTrigger = false;
        boostYouTubePefs.playlist = 'XxXxXxXxXxX';
    } 

    if (p = document.getElementsByTagName('video')[0]) {

        if( boostYouTubePefs.stopvideo && !prefs.isStopVideoTrigger && 
                    (v = document.getElementById('movie_player')) !== null) {
            v.stopVideo();
            //  Need create somewhere Event: 
            //    when Click on Stoped Video then => prefs.isStopVideoTrigger = true;
            //    But I'm too tired
            p.addEventListener('play', autoplaypls);
        }
        if ((boostYouTubePefs.showres || boostYouTubePefs.showrate) && prefs.isOSDTrigger === false) {
            p.addEventListener('play', showcurspeedandres);
            p.addEventListener('ratechange', showcurspeedandres);
            p.addEventListener('resize', showcurspeedandres);
            prefs.isOSDTrigger = true;
        }
        if (! p.paused ) { 
            p.pause();
            p.play();
        }
    }

    if (boostYouTubePefs.hidectrls && prefs.isHideCtrlsTrigger === false) {
        document.addEventListener("mousemove", hidepbctrls);
        prefs.isHideCtrlsTrigger = true;
    } else if (!boostYouTubePefs.hidectrls && prefs.isHideCtrlsTrigger) {
        document.removeEventListener("mousemove", hidepbctrls);
        prefs.isHideCtrlsTrigger = false;
    }

    if (boostYouTubePefs.scale && prefs.isScaleTrigger === false) {
        document.addEventListener("keydown", natres);
        document.addEventListener("fullscreenchange", natres);
        prefs.isScaleTrigger = true;
    } else if (boostYouTubePefs.scale  === false && prefs.isScaleTrigger) {
        document.removeEventListener("keydown", natres);
        document.removeEventListener("fullscreenchange", natres);
        prefs.isScaleTrigger = false;
    }


}
var b = document.getElementsByTagName('body')[0];
b.addEventListener('yt-page-data-updated', loadplayerinfo);
// prefs
window.addEventListener('message', e => {
    if (e.data && e.data.cmd === 'options-changed') {
      boostYouTubePefs = Object.assign(boostYouTubePefs, e.data.prefs);
      loadplayerinfo();
    }
});
})();
`;
document.documentElement.appendChild(script);

browser.storage.local.get({
    stopvideo: true,
    showres: true,
    showrate: true,
    scale: true,
    defscale: true,
    hidectrls: true
    }, prefs => {
    window.postMessage({
        cmd: 'options-changed',
        prefs
    }, '*');
});

browser.storage.onChanged.addListener(ps => {
  const prefs = Object.keys(ps)
    .filter(n => n === 'showres' || n === 'showrate' || n === 'scale' || n === 'defscale' || n === 'hidectrls')
    .reduce((p, n) => {
      p[n] = ps[n].newValue;
      return p;
    }, {});
  window.postMessage({
    cmd: 'options-changed',
    prefs
  }, '*');
});
