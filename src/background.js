/*
https://www.youtube.com/watch?v=XxXxXxXxXxX
https://www.youtube.com/watch?time_continue=1&v=XxXxXxXxXxX
https://www.youtube.com/embed/XxXxXxXxXxX
https://img.youtube.com/vi_webp/XxXxXxXxXxX/hqdefault.webp
*/

var rez = {
  shortcut: false
};

var re = /https:\/\/(www|i)\.(?:youtube|ytimg)\.com\/(?:watch\?.*v=|embed\/|vi\/)([^\&\?\/]+).*/;

var vid = '';
var cursize = '';

function openthumb() {

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
      var gettingTab = browser.tabs.get(tabs[0].id);
      gettingTab.then((tab) => {
        vid = re.exec(tab.url);
        if (vid) {
          var thumb = "https://i.ytimg.com/vi/" + vid[2];
          if (vid[1] === 'i') {
            switch(cursize) {
              case 'hq':
                cursize = 'maxres';
                break;
              case 'sd':
                cursize = 'hq';
                break;
              default:
                cursize = 'sd';
                break;
            }
            browser.tabs.update({url: thumb + "/" + cursize + "default.jpg"});
            //browser.tabs.onUpdated.addListener(updateicon);
          }
          else {
           browser.tabs.create({ "url": thumb + "/maxresdefault.jpg" });
          }
        }
      });
  });
}
browser.pageAction.onClicked.addListener(openthumb);

/* Add ShortCut *************************************************/
var openYouTubeInNewTabFn = function(command) {
  if(command == "OpenYouTubeTab") {
    browser.tabs.create({
      "url" : "https://www.youtube.com/feed/subscriptions"
    });
  };
}
browser.storage.local.get({
  shortcut: true
  }, (rez) =>  {
  if (rez.shortcut) {
    browser.commands.onCommand.addListener(openYouTubeInNewTabFn);
  }
});
var changeListerFn = function(changes, namespace) {
  if (changes['shortcut'].newValue === false) {
    browser.commands.onCommand.removeListener(openYouTubeInNewTabFn);
  } else {
    browser.commands.onCommand.addListener(openYouTubeInNewTabFn);
  }
};
browser.storage.onChanged.addListener(changeListerFn);
/****************************************************************/


/*
  Change Icon in Address bar
*/
// var updateicon = function() {
//   var gettingAllTabs = browser.tabs.query({active: true, currentWindow: true});
//   gettingAllTabs.then((tabs) => {
//     browser.pageAction.setIcon({tabId: tabs[0].id, path: "icons/"+ cursize + ".svg"});
//     browser.tabs.onUpdated.removeListener(updateicon);
//   });
// }
