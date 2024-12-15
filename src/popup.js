'use strict';

import './popup.css';

(function () {

  const openbot = document.getElementById('openbot');

  openbot.onclick = function() { 
    chrome.tabs.create({
      url: 'bot.html'
    });
  };

  const opentelegram = document.getElementById('opentelegram');

  opentelegram.onclick = function() { 
    chrome.tabs.create({
      url: 'telegram.html'
    });
  };

  let reloadOrders = false;
  let input = document.getElementById("checkbox");
  input.addEventListener('change', (event) => {
      //console.log(event.target);
      reloadOrders = event.target.checked;
  });

  const onoffEl = document.getElementById('onoff');

  getState();

  function onoff(){
    if(onoffEl.value == "Off"){
      onoffEl.value="On";
      onoffEl.style = "background: green";
      sendToBackground("START", reloadOrders);
    }else{
      onoffEl.value="Off";
      onoffEl.style = "background: red";
      sendToBackground("STOP", reloadOrders);
    }
  }

  function getState() {
    chrome.runtime.sendMessage({
      type: "BOT",
      payload: {
        command: "STATE"
      }
    }, (state) => {
      if(state == true) {
        onoffEl.value="On";
        onoffEl.style = "background: green";
      } else {
        onoffEl.value="Off";
        onoffEl.style = "background: red";
      }
    });
  }

  function sendToBackground(command, reloadOrders) {
    chrome.runtime.sendMessage({
      type: "BOT",
      payload: {
        command: command,
        argument: reloadOrders
      }
    });
  }

  onoffEl.onclick = function() { onoff(); };
  
})();
