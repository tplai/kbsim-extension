//Copyright license for kbs.im (MIT) - https://github.com/tplai/kbsim
/*

Copyright (c) Thomas Lai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function loaded() {
  chrome.runtime.sendMessage({query: "getData"}, function(response) {
    document.open();
    document.close();
    document.write(`
      <head>
          <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
          <style>
              body {
                  font-family: 'Roboto';
              }
              a {
                  text-decoration: solid;
                  color: #408ee0;
              }
              a:visited {
                  color: #408ee0;
              }
              a:hover {
                  color: #408ee0;
              }
              a:active {
                  color: #408ee0;
              }
              .selection {
                  display: block;
                  flex-grow: 1;
                  font-size: 16px;
                  font-family: roboto;
                  color: #444;
                  line-height: 1.3;
                  padding: .6em 1.4em .5em .8em;
                  box-sizing: border-box;
                  margin: 0;
                  border: 2px solid #9e9e9e;
                  transition: border 0.2s linear;
                  outline: none;
                  box-shadow: 0 1px 0 1px rgb(0 0 0 / 4%);
                  -moz-appearance: none;
                  -webkit-appearance: none;
                  appearance: none;
                  background-color: #fff;
                  background-image: url(downwardsArrow.png);
                  background-repeat: no-repeat, repeat;
                  background-position: right .7em top 50%, 0 0;
                  background-size: 1em auto, 100%;
                  width: 210;
              }
              select:not(:-internal-list-box) {
                  overflow: visible !important;
              }
              select {
                  -webkit-writing-mode: horizontal-tb !important;
                  text-rendering: auto;
                  color: -internal-light-dark(black, white);
                  letter-spacing: normal;
                  word-spacing: normal;
                  text-transform: none;
                  text-indent: 0px;
                  text-shadow: none;
                  display: inline-block;
                  text-align: start;
                  appearance: menulist;
                  box-sizing: border-box;
                  align-items: center;
                  white-space: pre;
                  -webkit-rtl-ordering: logical;
                  background-color: -internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59));
                  cursor: default;
                  margin: 0em;
                  font: 400 13.3333px Arial;
                  border-radius: 0px;
                  border-width: 1px;
                  border-style: solid;
                  border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
                  border-image: initial;
              }
              
              *, *:before, *:after {
                  box-sizing: border-box;
              }
              body {
                  font-family: -apple-system, ".SFNSText-Regular", "Helvetica Neue", "Roboto", "Segoe UI", sans-serif;
                  height: 330px;
                  width: 275px;
                  max-width: 275px;
              }

              h2 {
                  max-width: 275px;
                  overflow: hidden;
              }

              .toggle {
                  cursor: pointer;
                  display: inline-block;
              }

              .toggle-switch {
                  display: inline-block;
                  background: #ccc;
                  border-radius: 16px;
                  width: 58px;
                  height: 32px;
                  position: relative;
                  vertical-align: middle;
                  transition: background 0.25s;
              }

              .toggle-switch:before, .toggle-switch:after {
                  content: "";
              }

              .toggle-switch:before {
                  display: block;
                  background: #fff;
                  border-radius: 50%;
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
                  width: 24px;
                  height: 24px;
                  position: absolute;
                  top: 4px;
                  left: 4px;
                  transition: left 0.25s;
              }

              .toggle:hover .toggle-switch:before {
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
              }

              .toggle-checkbox:checked + .toggle-switch {
                  background: #408ee0;
              }

              .toggle-checkbox:checked + .toggle-switch:before {
                  left: 30px;
              }

              .toggle-checkbox {
                  position: absolute;
                  visibility: hidden;
              }
              .toggle-label {
                  margin-left: 5px;
                  position: relative;
                  top: 2px;
              }             
          </style>
      </head>`);
      document.write("<center>");
      document.write("<a href=\"https://kbs.im/\"><h2>kbs.im</h2></a>");
      document.write("Switch Type");
      document.write("<br>");
      document.write("<select class=\"selection\" name=\"Switch Type\" id=\"switchType\">");
      response.switchTypes.forEach(element => {
          document.write("<option value=\"" + element.key + "\">" + element.caption + "</option>");
      });
      document.write("</select>");
      document.write("<br/>");
      document.write("<br/>");
      document.write("Keyboard Layout");
      document.write("<br>");
      document.write("<select class=\"selection\" name=\"Keyboard Layout\" id=\"keyboardLayout\">");
      response.keyboardLayouts.forEach(element => {
          document.write("<option value=\"" + element.key + "\">" + element.caption + "</option>");
      });
      document.write("</select>");
      document.write(`
        <br>
        <label class="toggle">
          <input class="toggle-checkbox" type="checkbox" id="enabled"${response.enabled ? " checked" : ""}>
          <div class="toggle-switch"></div>
          <span class="toggle-label">${response.enabled ? "Enabled" : "Disabled"}</span>
        </label>
      `);
      document.write(`
        <br>
        <p>This extension is not affiliated with kbs.im<p>
      `);
      document.write("</center>");
      var switchType = document.getElementById("switchType");
      switchType.value = response.selectedSwitchType.key;
      var keyboardLayout = document.getElementById("keyboardLayout");
      keyboardLayout.value = response.selectedKeyboardLayout.key;
      switchType.onchange = function() {
          chrome.runtime.sendMessage({setSwitchType: switchType.options[switchType.selectedIndex].text});
      }
      keyboardLayout.onchange = function() {
          chrome.runtime.sendMessage({setKeyboardLayout: keyboardLayout.options[keyboardLayout.selectedIndex].text});
      }
      var enabled = document.getElementById("enabled");
      enabled.value = response.enabled ? "on" : "off";
      var enabledText = document.getElementsByClassName("toggle-label")[0];
      enabled.onclick = function() {
          enabled.value = (enabled.value == "on" ? "off" : "on")
          enabledText.innerText = (enabled.value == "on" ? "Enabled" : "Disabled");
          chrome.runtime.sendMessage({setEnabled: enabled.value});
      }
      var links = document.getElementsByTagName("a");
      for (var i = 0; i < links.length; i++) {
          (function () {
              var ln = links[i];
              var location = ln.href;
              ln.onclick = function () {
                  chrome.tabs.create({active: true, url: location});
              };
          })();
      }
  });
}
chrome.runtime.sendMessage({query: "isLoaded"}, function(response) {
  if (response == "false") {
    document.write(`
      <head>
          <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
          <style>
              body {
                  font-family: 'Roboto';
              }
              h2 {
                  width: 275px;
              }
              .lds-ring {
                  display: inline-block;
                  position: relative;
                  width: 80px;
                  height: 80px;
              }
              .lds-ring div {
                  box-sizing: border-box;
                  display: block;
                  position: absolute;
                  width: 64px;
                  height: 64px;
                  margin: 8px;
                  border: 8px solid #fff;
                  border-radius: 50%;
                  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                  border-color: #408ee0 transparent transparent transparent;
              }
              .lds-ring div:nth-child(1) {
                  animation-delay: -0.45s;
              }
              .lds-ring div:nth-child(2) {
                  animation-delay: -0.3s;
              }
              .lds-ring div:nth-child(3) {
                  animation-delay: -0.15s;
              }
              @keyframes lds-ring {
                  0% {
                  transform: rotate(0deg);
                  }
                  100% {
                  transform: rotate(360deg);
                  }
              }

              .loading:after {
                content: ' .';
                animation: dots 1s steps(5, end) infinite;}
              
              @keyframes dots {
                0%, 20% {
                  color: rgba(0,0,0,0);
                  text-shadow:
                    .25em 0 0 rgba(0,0,0,0),
                    .5em 0 0 rgba(0,0,0,0);}
                40% {
                  color: black;
                  text-shadow:
                    .25em 0 0 rgba(0,0,0,0),
                    .5em 0 0 rgba(0,0,0,0);}
                60% {
                  text-shadow:
                    .25em 0 0 black,
                    .5em 0 0 rgba(0,0,0,0);}
                80%, 100% {
                  text-shadow:
                    .25em 0 0 black,
                    .5em 0 0 black;}}
          </style>
      </head>
      <center>
          <div class="lds-ring">
              <div>
              </div>
              <div>
              </div>
              <div>
              </div>
              <div>
              </div>
          </div>
          <br>
          <h2 class="loading">Initializing<h2>
      </center>
    `);
    chrome.runtime.onMessage.addListener(function(msg, sender) {
      if (msg.query == "doneLoading") {
        loaded();
      }
    });
  }
  else
  {
    loaded();
  }
});

document.addEventListener("visibilitychange", function() {
  document.close();
});