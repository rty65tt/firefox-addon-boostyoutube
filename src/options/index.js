'use strict';

function restore () {
  chrome.storage.local.get({
    stopvideo: true,
    showres: true,
    showrate: true,
    scale: true,
    hidectrls: true,
    shortcut: true
  }, (prefs) => {
    document.getElementById('stopvideo').checked = prefs.stopvideo;
    document.getElementById('showres').checked = prefs.showres;
    document.getElementById('showrate').checked = prefs.showrate;
    document.getElementById('scale').checked = prefs.scale;
    document.getElementById('hidectrls').checked = prefs.hidectrls;
    document.getElementById('shortcut').checked = prefs.shortcut;
  });
}

function save () {
  const stopvideo = document.getElementById('stopvideo').checked;
  const showres = document.getElementById('showres').checked;
  const showrate = document.getElementById('showrate').checked;
  const scale = document.getElementById('scale').checked;
  const hidectrls = document.getElementById('hidectrls').checked;
  const shortcut = document.getElementById('shortcut').checked;
  chrome.storage.local.set({
    stopvideo,
    showres,
    showrate,
    scale,
    hidectrls,
    shortcut
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => status.textContent = '', 1000);
  });
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
