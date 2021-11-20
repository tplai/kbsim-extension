//Copyright license for kbs.im (MIT) - https://github.com/tplai/kbsim
/*

Copyright (c) Thomas Lai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function getAllSwitches(buffer = "", allKeyVars = {}, switches = []) {
  if (buffer.includes("press : {")) {
      var lines = buffer.split("\n");
      var found = buffer.indexOf("press : {")+9;
      var lineNum = buffer.substring(1,found).split("\n").length-1;
      var charIdx = 0;
      for(var i = 0;i < lineNum-3;i++){
          var line = lines[i];
          charIdx += line.length+1;
      }
      var jsonStart = buffer.substring(charIdx+lines[lineNum-3].length-1);
      var jsonEnd = jsonStart.indexOf(";");
      var json = jsonStart.substring(0,jsonStart.substring(0,jsonEnd).lastIndexOf("}")+1)
          .replaceAll("$.p + \"", "\"https://node.ihaxu.com/kbsim/")
          .replaceAll("GENERIC : ", "\"GENERIC\" : ")
          .replaceAll("BACKSPACE : ", "\"BACKSPACE\" : ")
          .replaceAll("ENTER : ", "\"ENTER\" : ")
          .replaceAll("SPACE : ", "\"SPACE\" : ")
          .replaceAll("GENERICR0 : ", "\"GENERICR0\" : ")
          .replaceAll("GENERICR1 : ", "\"GENERICR1\" : ")
          .replaceAll("GENERICR2 : ", "\"GENERICR2\" : ")
          .replaceAll("GENERICR3 : ", "\"GENERICR3\" : ")
          .replaceAll("GENERICR4 : ", "\"GENERICR4\" : ")
          .replaceAll("release : ", "\"release\" : ")
          .replaceAll("press : ", "\"press\" : ")
          .replaceAll("key : ", "\"key\" : ")
          .replaceAll("caption : ", "\"caption\" : ");
      var jsonLines = json.split("\n");
      for(var i = 0;i < jsonLines.length;i++){
          var line = jsonLines[i];
          if (line.includes(" : ") && !line.includes("\"", line.indexOf(" : "))) {
              var varName = line.substring(line.indexOf(" : ")+3).replaceAll(",","");
              var hasAComma = false;
              if (line.substring(line.indexOf(" : ")+3) != line.substring(line.indexOf(" : ")+3).replaceAll(",","")) {
                  hasAComma = true;
              }
              if (varName != "{") {
                  jsonLines[i] = line.substring(0,line.indexOf(" : ")+3) + "\"" + allKeyVars[varName] + "\"" + (hasAComma ? "," : "");
              }
          }
      }
      json = jsonLines.join("\n");
      switches.push(JSON.parse(json));
      return getAllSwitches(buffer.substring(charIdx+lines[lineNum-3].length+jsonEnd-1),allKeyVars,switches);
  }
  else
  {
      return switches;
  }
}

const keySize = 54;
const defaultKeyColor = "#ffffff";
const defaultTextColor = "#000";

const ansiLegends = [
  ["ESC",""],["F1",""],["F2",""],["F3",""],["F4",""],["F5",""],["F6",""],["F7",""],["F8",""],["F9",""],["F10",""],["F11",""],["F12",""],["PRTSC",""],["SCROLLLOCK",""],["PAUSE","BREAK"],["TILDE","BACK_QUOTE"],["EXCLAMATION","1"],["AT","2"],["HASH","3"],["DOLLAR","4"],["PERCENT","5"],["CIRCUMFLEX","6"],["AMPERSAND","7"],["ASTERISK","8"],["OPEN_PAREN","9"],["CLOSE_PAREN","0"],["UNDERSCORE","HYPHEN"],["ADD","EQUALS"],["BACKSPACE",""],["INSERT",""],["HOME",""],["PGUP",""],["NUMLOCK",""],["SLASH",""],["ASTERISK",""],["HYPHEN",""],["TAB",""],["Q",""],["W",""],["E",""],["R",""],["T",""],["Y",""],["U",""],["I",""],["O",""],["P",""],["OPEN_CURLY_BRACKET","OPEN_BRACKET"],["CLOSE_CURLY_BRACKET","CLOSE_BRACKET"],["PIPE","BACK_SLASH"],["DELETE",""],["END",""],["PGDN",""],["7","HOME"],["8","UP"],["9","PGUP"],["ADD",""],["CAPSLOCK",""],["A",""],["S",""],["D",""],["F",""],["G",""],["H",""],["J",""],["K",""],["L",""],["COLON","SEMICOLON"],["DOUBLE_QUOTE","QUOTE"],["ENTER",""],["4","LEFT"],["5",""],["6","RIGHT"],["SHIFT",""],["Z",""],["X",""],["C",""],["V",""],["B",""],["N",""],["M",""],["LESS_THAN","COMMA"],["GREATER_THAN","PERIOD"],["QUESTION","SLASH"],["SHIFT",""],["UP",""],["1","END"],["2","DOWN"],["3","PGDN"],["ENTER",""],["CTRL",""],["WIN",""],["ALT",""],["",""],["WIN",""],["MENU",""],["CTRL",""],["LEFT",""],["DOWN",""],["RIGHT",""],["0","INS"],["PERIOD","DEL"],
];

const ansiNames = [
  "ESC","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","PRTSC","SCROLLLOCK","PAUSE","BACK_QUOTE","1","2","3","4","5","6","7","8","9","0","MINUS","EQUALS","BACKSPACE","INSERT","HOME","PGUP","NUMLOCK","MINUS","MULTIPLY","SUBTRACT","TAB","Q","W","E","R","T","Y","U","I","O","P","OPEN_BRACKET","CLOSE_BRACKET","BACK_SLASH","DELETE","END","PGDN","NUMPAD7","NUMPAD8","NUMPAD9","ADD","CAPSLOCK","A","S","D","F","G","H","J","K","L","SEMICOLON","QUOTE","ENTER","NUMPAD4","NUMPAD5","NUMPAD6","SHIFT","Z","X","C","V","B","N","M","COMMA","PERIOD","SLASH","SHIFT","UP","NUMPAD1","NUMPAD2","NUMPAD3","ENTER","CTRL","WIN","ALT","SPACE","WIN","MENU","CTRL","LEFT","DOWN","RIGHT","NUMPAD0","DECIMAL",
];

const ansiMap = ansiLegends.reduce((obj, key, index) => {
  obj[key] = ansiNames[index];
  return obj;
}, {});
const keycodes = {
"CANCEL":3,"HELP":6,"BACKSPACE":8,"TAB":9,"CLEAR":12,"ENTER":13,"ENTER_SPECIAL":14,"SHIFT":16,"CTRL":17,"ALT":18,"PAUSE":19,"CAPSLOCK":20,"KANA":21,"EISU":22,"JUNJA":23,"FINAL":24,"HANJA":25,"ESC":27,"CONVERT":28,"NONCONVERT":29,"ACCEPT":30,"MODECHANGE":31,"SPACE":32,"PGUP":33,"PGDN":34,"END":35,"HOME":36,"LEFT":37,"UP":38,"RIGHT":39,"DOWN":40,"SELECT":41,"PRINT":42,"EXECUTE":43,"PRTSC":44,"INSERT":45,"DELETE":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"COLON":58,"LESS_THAN":60,"GREATER_THAN":62,"QUESTION":63,"AT":64,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"WIN":91,"MENU":93,"SLEEP":95,"NUMPAD0":96,"NUMPAD1":97,"NUMPAD2":98,"NUMPAD3":99,"NUMPAD4":100,"NUMPAD5":101,"NUMPAD6":102,"NUMPAD7":103,"NUMPAD8":104,"NUMPAD9":105,"MULTIPLY":106,"ADD":107,"SEPARATOR":108,"SUBTRACT":109,"DECIMAL":110,"DIVIDE":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"F13":124,"F14":125,"F15":126,"F16":127,"F17":128,"F18":129,"F19":130,"F20":131,"F21":132,"F22":133,"F23":134,"F24":135,"NUMLOCK":144,"SCROLLLOCK":145,"WIN_OEM_FJ_JISHO":146,"WIN_OEM_FJ_MASSHOU":147,"WIN_OEM_FJ_TOUROKU":148,"WIN_OEM_FJ_LOYA":149,"WIN_OEM_FJ_ROYA":150,"CIRCUMFLEX":160,"EXCLAMATION":161,"DOUBLE_QUOTE":162,"HASH":163,"DOLLAR":164,"PERCENT":165,"AMPERSAND":166,"UNDERSCORE":167,"OPEN_PAREN":168,"CLOSE_PAREN":169,"ASTERISK":170,"PLUS":171,"PIPE":172,"HYPHEN_MINUS":173,"OPEN_CURLY_BRACKET":174,"CLOSE_CURLY_BRACKET":175,"TILDE":176,"VOLUME_MUTE":181,"VOLUME_DOWN":182,"VOLUME_UP":183,"SEMICOLON":186,"EQUALS":187,"COMMA":188,"MINUS":189,"PERIOD":190,"SLASH":191,"BACK_QUOTE":192,"OPEN_BRACKET":219,"BACK_SLASH":220,"CLOSE_BRACKET":221,"QUOTE":222,"META":224,"ALTGR":225,"WIN_ICO_HELP":227,"WIN_ICO_00":228,"WIN_ICO_CLEAR":230,"WIN_OEM_RESET":233,"WIN_OEM_JUMP":234,"WIN_OEM_PA1":235,"WIN_OEM_PA2":236,"WIN_OEM_PA3":237,"WIN_OEM_WSCTRL":238,"WIN_OEM_CUSEL":239,"WIN_OEM_ATTN":240,"WIN_OEM_FINISH":241,"WIN_OEM_COPY":242,"WIN_OEM_AUTO":243,"WIN_OEM_ENLW":244,"WIN_OEM_BACKTAB":245,"ATTN":246,"CRSEL":247,"EXSEL":248,"EREOF":249,"PLAY":250,"ZOOM":251,"PA1":253,"WIN_OEM_CLEAR":254,
};
const keynames = {
3:"CANCEL",6:"HELP",8:"BACKSPACE",9:"TAB",12:"CLEAR",13:"ENTER",14:"ENTER_SPECIAL",16:"SHIFT",17:"CTRL",18:"ALT",19:"PAUSE",20:"CAPSLOCK",21:"KANA",22:"EISU",23:"JUNJA",24:"FINAL",25:"HANJA",27:"ESC",28:"CONVERT",29:"NONCONVERT",30:"ACCEPT",31:"MODECHANGE",32:"SPACE",33:"PGUP",34:"PGDN",35:"END",36:"HOME",37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",41:"SELECT",42:"PRINT",43:"EXECUTE",44:"PRTSC",45:"INSERT",46:"DELETE",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",58:"COLON",60:"LESS_THAN",62:"GREATER_THAN",63:"QUESTION",64:"AT",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"WIN",93:"MENU",95:"SLEEP",96:"NUMPAD0",97:"NUMPAD1",98:"NUMPAD2",99:"NUMPAD3",100:"NUMPAD4",101:"NUMPAD5",102:"NUMPAD6",103:"NUMPAD7",104:"NUMPAD8",105:"NUMPAD9",106:"MULTIPLY",107:"ADD",108:"SEPARATOR",109:"SUBTRACT",110:"DECIMAL",111:"DIVIDE",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",124:"F13",125:"F14",126:"F15",127:"F16",128:"F17",129:"F18",130:"F19",131:"F20",132:"F21",133:"F22",134:"F23",135:"F24",144:"NUMLOCK",145:"SCROLLLOCK",146:"WIN_OEM_FJ_JISHO",147:"WIN_OEM_FJ_MASSHOU",148:"WIN_OEM_FJ_TOUROKU",149:"WIN_OEM_FJ_LOYA",150:"WIN_OEM_FJ_ROYA",160:"CIRCUMFLEX",161:"EXCLAMATION",162:"DOUBLE_QUOTE",163:"HASH",164:"DOLLAR",165:"PERCENT",166:"AMPERSAND",167:"UNDERSCORE",168:"OPEN_PAREN",169:"CLOSE_PAREN",170:"ASTERISK",171:"PLUS",172:"PIPE",173:"HYPHEN_MINUS",174:"OPEN_CURLY_BRACKET",175:"CLOSE_CURLY_BRACKET",176:"TILDE",181:"VOLUME_MUTE",182:"VOLUME_DOWN",183:"VOLUME_UP",186:"SEMICOLON",187:"EQUALS",188:"COMMA",189:"MINUS",190:"PERIOD",191:"SLASH",192:"BACK_QUOTE",219:"OPEN_BRACKET",220:"BACK_SLASH",221:"CLOSE_BRACKET",222:"QUOTE",224:"META",225:"ALTGR",227:"WIN_ICO_HELP",228:"WIN_ICO_00",230:"WIN_ICO_CLEAR",233:"WIN_OEM_RESET",234:"WIN_OEM_JUMP",235:"WIN_OEM_PA1",236:"WIN_OEM_PA2",237:"WIN_OEM_PA3",238:"WIN_OEM_WSCTRL",239:"WIN_OEM_CUSEL",240:"WIN_OEM_ATTN",241:"WIN_OEM_FINISH",242:"WIN_OEM_COPY",243:"WIN_OEM_AUTO",244:"WIN_OEM_ENLW",245:"WIN_OEM_BACKTAB",246:"ATTN",247:"CRSEL",248:"EXSEL",249:"EREOF",250:"PLAY",251:"ZOOM",253:"PA1",254:"WIN_OEM_CLEAR",
};


function parseEscapedChars(str) {
  let parsedStr = "";
  for (let i = 0; i < str.length; i++) {
    if(str.charAt(i) === '\\' && i !== str.length - 1) {
      i++;
    }
    parsedStr += str.charAt(i);
  }
  return parsedStr;
}

function parseSpecialSymbol(char) {
  switch(char) {
    case '~':
      return "TILDE";
    case '`':
      return "BACK_QUOTE"
    case '!':
      return "EXCLAMATION";
    case '@':
      return "AT";
    case '#':
      return "HASH";
    case '$':
      return "DOLLAR";
    case '%':
      return "PERCENT";
    case '^':
      return "CIRCUMFLEX";
    case '&':
      return "AMPERSAND";
    case '*':
      return "ASTERISK";
    case '(':
      return "OPEN_PAREN";
    case ')':
      return "CLOSE_PAREN";
    case '-':
      return "HYPHEN";
    case '_':
      return "UNDERSCORE";
    case '=':
      return "EQUALS"
    case '+':
      return "ADD";
    case '\\':
      return "BACK_SLASH";
    case '{':
      return "OPEN_CURLY_BRACKET";
    case '[':
      return "OPEN_BRACKET";
    case '}':
      return "CLOSE_CURLY_BRACKET";
    case ']':
      return "CLOSE_BRACKET";
    case '|':
      return "PIPE";
    case ':':
      return "COLON";
    case ';':
      return "SEMICOLON";
    case '"':
      return "DOUBLE_QUOTE";
    case '\'':
      return "QUOTE";
    case '<':
      return "LESS_THAN";
    case ',':
      return "COMMA";
    case '>':
      return "GREATER_THAN";
    case '.':
      return "PERIOD";
    case '?':
      return "QUESTION";
    case '/':
      return "SLASH"
    case '↑':
      return "UP";
    case '←':
      return "LEFT";
    case '↓':
      return "DOWN";
    case '→':
      return "RIGHT";
    default:
      return;
  }
}
function parseLegends(toplegend, bottomlegend) {
  let formatTopLegend = toplegend.replace(/\s/g, '').toUpperCase();
  if (formatTopLegend.length === 1 && !formatTopLegend.match(/^[a-z0-9]+$/i)) {
    formatTopLegend = parseSpecialSymbol(formatTopLegend);
  }
  let formatBottomLegend = bottomlegend.replace(/\s/g, '').toUpperCase();
  if (formatBottomLegend.length === 1 && !formatBottomLegend.match(/^[a-z0-9]+$/i)) {
    formatBottomLegend = parseSpecialSymbol(formatBottomLegend);
  }

  let ansiKey = [formatTopLegend, formatBottomLegend];
  if (ansiKey in ansiMap) {
    return ansiMap[ansiKey];
  }
  return;
}

function keyCodeOf(str) {
  if (str in keycodes) {
    return keycodes[str];
  }
  return -1;
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}

function parseKLE(state, kle) {
  if (!kle) {
    state.highlight = {borderColor:"#ff0033"};
    return;
  }
  let inputLayout = kle.split(/\r\n|\r|\n/);
  if (inputLayout.length === 0) {
    state.highlight = {borderColor:"#ff0033"};
    return;
  }
  for (let i in inputLayout) {
    if (inputLayout[i] == "") {
      inputLayout.splice(i, 1);
      continue;
    }
    inputLayout[i] = inputLayout[i].match(/(["'])(?:(?=(\\?))\2.)*?\1|([{])(?:(?=(\\?))\2.)*?([}])/g);
    if (!inputLayout[i]) {
      state.highlight = {borderColor:"#ff0033"};
      return;
    }
  }
  let keycount = 0;
  let keyInfo = {
    keyid: keycount,
    class: "",
    legend: "",
    sublegend: "",
    x: 0.0,
    y: 0.0,
    width: 1.0,
    height: 1.0,
    keytopcolor: shadeColor(defaultKeyColor, 10),
    keybordercolor: defaultKeyColor,
    textcolor: defaultTextColor,
    pressed: false,
  }
  for (let x = 0; x < inputLayout.length; x++) {
    let formatNextKey = false;
    if (x !== 0) {
      keyInfo = {
        keyid: keycount,
        class: "",
        legend: "",
        sublegend: "",
        x: 0.0,
        y: keyInfo.y + 1,
        width: 1.0,
        height: 1.0,
        keytopcolor: keyInfo.keytopcolor,
        keybordercolor: keyInfo.keybordercolor,
        textcolor: keyInfo.textcolor,
        pressed: false,
      }
    }
    for (let y = 0; y < inputLayout[x].length; y++) {
      if (!formatNextKey && y !== 0) {
        keyInfo = {
          keyid: keycount,
          class: "",
          legend: "",
          sublegend: "",
          x: keyInfo.x + keyInfo.width,
          y: keyInfo.y,
          width: 1.0,
          height: 1.0,
          keytopcolor: keyInfo.keytopcolor,
          keybordercolor: keyInfo.keybordercolor,
          textcolor: keyInfo.textcolor,
          pressed: false,
        }
      }
      if (inputLayout[x][y].charAt(0) === "{" &&
          inputLayout[x][y].charAt(inputLayout[x][y].length - 1) === "}") {
        let keyFormat = inputLayout[x][y].substring(1, inputLayout[x][y].length - 1).replace(/\s/g, '');
        let formatInfo = keyFormat.split(",");
        if (Array.isArray(formatInfo)) {
          for (let format in formatInfo) {
            let formatTuple = formatInfo[format].split(":");
            if (formatTuple.length === 2) {
              switch (formatTuple[0]) {
                case 'w':
                  keyInfo.width = parseFloat(formatTuple[1]);
                  break;
                case 'h':
                  keyInfo.height = parseFloat(formatTuple[1]);
                  break;
                case 'x':
                  keyInfo.x += parseFloat(formatTuple[1]);
                  break;
                case 'y':
                  keyInfo.y += parseFloat(formatTuple[1]);
                  break;
                case 'c':
                  if (formatTuple[1].charAt(0) === '"' &&
                      formatTuple[1].charAt(formatTuple[1].length - 1) === '"') {
                    formatTuple[1] = formatTuple[1].substring(1, formatTuple[1].length - 1);
                  }
                  keyInfo.keybordercolor = formatTuple[1];
                  keyInfo.keytopcolor = shadeColor(formatTuple[1], 10);
                  break;
                case 't':
                  if (formatTuple[1].charAt(0) === '"' &&
                      formatTuple[1].charAt(formatTuple[1].length - 1) === '"') {
                    formatTuple[1] = formatTuple[1].substring(1, formatTuple[1].length - 1);
                  }
                  keyInfo.textcolor = formatTuple[1];
                  break;
              }
            }
            else {
              state.highlight = {borderColor:"#ff0033"};
              return;
            }
          }
        }
        formatNextKey = true;
      }
      else if (inputLayout[x][y].charAt(0) === '"' &&
               inputLayout[x][y].charAt(inputLayout[x][y].length - 1) === '"') {
        let legends = inputLayout[x][y].substring(1, inputLayout[x][y].length - 1)
        legends = legends.split("\\n");
        if (legends.length === 2) {
          keyInfo.sublegend = parseEscapedChars(legends[1]);
        }
        keyInfo.legend = parseEscapedChars(legends[0]);

        formatNextKey = false;
        keycount += 1;
        inputLayout[x][y] = keyInfo;
      }
      else {
        state.highlight = {borderColor:"#ff0033"};
        return;
      }
    }
  }
  for (let x in inputLayout) {
    for (let y in inputLayout[x]) {
      if (typeof(inputLayout[x][y]) === 'string' &&
          inputLayout[x][y].charAt(0) === "{" &&
          inputLayout[x][y].charAt(inputLayout[x][y].length - 1) === "}") {
        inputLayout[x].splice(y, 1);
      }
    }
  }

  let keyboardWidth = 0;
  let keyboardHeight = 0;
  state.keyLocations = {};

  for (let x in inputLayout) {
    for (let y in inputLayout[x]) {
      let keyX = inputLayout[x][y].x + inputLayout[x][y].width;
      if (keyboardWidth < keyX) {
        keyboardWidth = keyX;
      }
      let keyY = inputLayout[x][y].y + inputLayout[x][y].height;
      if (keyboardHeight < keyY) {
        keyboardHeight = keyY;
      }
      let primaryLegend = parseLegends(inputLayout[x][y].legend, inputLayout[x][y].sublegend);
      if (primaryLegend) {
        inputLayout[x][y].class = primaryLegend;
        if (!state.keyLocations[primaryLegend]) {
          state.keyLocations[primaryLegend] = [[x, y]];
        }
        else {
          state.keyLocations[primaryLegend].push([x, y]);
        }
        if (state.pressedKeys.includes(keyCodeOf(primaryLegend))) {
          inputLayout[x][y].pressed = true;
        }
      }
      else {
        inputLayout[x][y].class = "unsupported";
      }
    }
  }

  let borderWidth = 0.25;
  let borderHeight = 0.25;
  state.keyboardStyle = {
    ...state.keyboardStyle,
    width: (keyboardWidth + borderWidth * 2) * keySize,
    minWidth: (keyboardWidth + borderWidth * 2) * keySize,
    height: (keyboardHeight + borderHeight * 3.25) * keySize,
    paddingTop: borderHeight * keySize * 1.75,
    paddingBottom: borderHeight * keySize,
    paddingLeft: borderWidth * keySize,
    paddingRight: borderWidth * keySize,
    marginBottom: keySize * 2,
  }

  state.layout = inputLayout;
}

var switchTypes = {};
var selectedSwitchType = {};
var keyboardLayouts = {};
var selectedKeyboardLayout = {};
var state = {
  layout: [],
  keyLocations: {},
  keyboardStyle: {},
  pressedKeys: [],
  highlight: {},
};
var loaded = false;
var enabled = true;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (selectedSwitchType.press && msg.keyDown && loaded && state.keyLocations[keynames[msg.keyDown]] && state.keyLocations[keynames[msg.keyDown]][0]) {
      var keyInfo = {
          x: state.keyLocations[keynames[msg.keyDown]][0][1],
          y: state.keyLocations[keynames[msg.keyDown]][0][0]
      }
      if (state.layout[keyInfo.x] && state.layout[keyInfo.x][keyInfo.y]) {
          state.layout[keyInfo.x][keyInfo.y].pressed = true;
      }
      if (state.pressedKeys.includes(keynames[msg.keyDown])) return sendResponse("already played sound");
      state.pressedKeys.push(keynames[msg.keyDown]);
      if (!enabled) return sendResponse("Disabled");
      if (keynames[msg.keyDown] in selectedSwitchType.press) {
          new Howl({src: selectedSwitchType.press[keynames[msg.keyDown]]}).play();
      }
      else
      {
          switch(parseInt(keyInfo.y)) {
              case 0:
                  new Howl({src: selectedSwitchType.press.GENERICR0}).play();
                  break;
              case 1:
                  new Howl({src: selectedSwitchType.press.GENERICR1}).play();
                  break;
              case 2:
                  new Howl({src: selectedSwitchType.press.GENERICR2}).play();
                  break;
              case 3:
                  new Howl({src: selectedSwitchType.press.GENERICR3}).play();
                  break;
              case 4:
                  new Howl({src: selectedSwitchType.press.GENERICR4}).play();
                  break;
              default:
                  new Howl({src: selectedSwitchType.press.GENERICR4}).play();
                  break;
          }
      }
      sendResponse("play down sound");
  }
  else if (selectedSwitchType.release && msg.keyUp && loaded && state.keyLocations[keynames[msg.keyUp]] && state.keyLocations[keynames[msg.keyUp]][0]) {
      var keyInfo = {
          x: state.keyLocations[keynames[msg.keyUp]][0][1],
          y: state.keyLocations[keynames[msg.keyUp]][0][0]
      }
      if (state.layout[keyInfo.x] && state.layout[keyInfo.x][keyInfo.y]) {
          state.layout[keyInfo.x][keyInfo.y].pressed = false;
      }
      let keyIndex = state.pressedKeys.indexOf(keynames[msg.keyUp]);
      if (keyIndex > -1) {
          state.pressedKeys.splice(keyIndex, 1);
      }
      if (!enabled) return sendResponse("Disabled");
      if (keynames[msg.keyUp] in selectedSwitchType.release) {
          new Howl({src: selectedSwitchType.release[keynames[msg.keyUp]]}).play();
      }
      else {
          new Howl({src: selectedSwitchType.release.GENERIC}).play();
      }
      sendResponse("play up sound");
  }
  else if (msg.query == "isLoaded") {
      sendResponse(loaded.toString());
  }
  else if (msg.query == "getData") {
      sendResponse({switchTypes, keyboardLayouts, selectedSwitchType, selectedKeyboardLayout, enabled});
  }
  else if (msg.setSwitchType) {
      switchTypes.forEach(element => {
          if (element.caption == msg.setSwitchType) {
              selectedSwitchType = element;
              chrome.storage.sync.set({ selectedSwitchType: msg.setSwitchType });
              for (let sound in selectedSwitchType.press) {
                  new Howl({src: selectedSwitchType.press[sound], volume: 0}).play();
              }
              for (let sound in selectedSwitchType.release) {
                  new Howl({src: selectedSwitchType.release[sound], volume: 0}).play();
              }
              sendResponse(element);
          }
      });
  }
  else if (msg.setKeyboardLayout) {
      keyboardLayouts.forEach(element => {
          if (element.caption == msg.setKeyboardLayout) {
              selectedKeyboardLayout = element;
              chrome.storage.sync.set({ selectedKeyboardLayout: msg.setKeyboardLayout });
              parseKLE(state,selectedKeyboardLayout.kle);
              sendResponse(element);
          }
      });
  }
  else if (msg.setEnabled) {
      enabled = msg.setEnabled == "on" ? true : false;
      chrome.storage.sync.set({ enabled: msg.setEnabled });
      sendResponse(msg.setEnabled == "on" ? "Enabled" : "Disabled");
  }
  else
  {
      sendResponse("not loaded");
  }
});

fetch("https://ihaxu.com/getkbsimjs.php")
  .then(response => response.text())
  .then(async data => {
      var allKeyVars = {};
      var lines = data.split("\n");
      for(var i = 0;i < lines.length;i++){
          var line = lines[i];
          if (line.includes("var ") && line.includes(" = __webpack_require__.p + \"") && line.includes(".mp3\"")) {
              var varNameStart = line.indexOf("var ");
              var varNameEnd = line.indexOf("=");
              var varName = line.substring(varNameStart+4,varNameEnd-1);
              var urlStart = line.indexOf("\"");
              var urlEnd = line.lastIndexOf("\"");
              var url = "https://node.ihaxu.com/kbsim/" + line.substring(urlStart+1,urlEnd);
              allKeyVars[varName] = url;
          }
      }
      var buffer = lines.join("\n");
      switchTypes = getAllSwitches(buffer,allKeyVars);
      var keyboardLayoutsStartIdx = buffer.indexOf("var _hierarchyNodesAncestors = [{");
      var keyboardLayoutsEndIdx = buffer.indexOf("}];",keyboardLayoutsStartIdx);
      keyboardLayouts = buffer.substring(keyboardLayoutsStartIdx+31,keyboardLayoutsEndIdx+2).replaceAll("key : ", "\"key\" : ").replaceAll("caption : ", "\"caption\" : ").replaceAll("kle : ", "\"kle\" : ");
      //preparing to parse
      var keyboardLayoutsLines = keyboardLayouts.split("\n");
      for(var i = 0;i < keyboardLayoutsLines.length;i++){
          var line = keyboardLayoutsLines[i];
          if (line.includes("\"kle\" : '") && line.endsWith("'")) {
              keyboardLayoutsLines[i] = "    \"kle\" : \"" + line.substring(line.indexOf("\"kle\" : '")+9,line.lastIndexOf("'")).replaceAll("\"","\\\"").replaceAll("\\'","'") + "\"";
          }
      }
      keyboardLayouts = keyboardLayoutsLines.join("\n");
      keyboardLayouts = JSON.parse(keyboardLayouts);
      chrome.storage.sync.get("selectedSwitchType", function(items){
          if (typeof items.selectedSwitchType === 'undefined') {
              selectedSwitchType = switchTypes[0];
          }
          else {
              switchTypes.forEach(element => {
                  if (element.caption == items.selectedSwitchType) {
                      selectedSwitchType = element;
                  }
              });
          }
          if (!selectedSwitchType.key) {
              selectedSwitchType = switchTypes[0];
          }
          for (let sound in selectedSwitchType.press) {
              new Howl({src: selectedSwitchType.press[sound], volume: 0}).play();
          }
          for (let sound in selectedSwitchType.release) {
              new Howl({src: selectedSwitchType.release[sound], volume: 0}).play();
          }
      });
      chrome.storage.sync.get("selectedKeyboardLayout", function(items){
          if (typeof items.selectedKeyboardLayout === 'undefined') {
              selectedKeyboardLayout = keyboardLayouts[0];
          }
          else {
              keyboardLayouts.forEach(element => {
                  if (element.caption == items.selectedKeyboardLayout) {
                      selectedKeyboardLayout = element;
                  }
              });
          }
          if (!selectedKeyboardLayout.key) {
              selectedKeyboardLayout = keyboardLayouts[0];
          }
          parseKLE(state,selectedKeyboardLayout.kle);
      });
      chrome.storage.sync.get("enabled", function(items){
          if (typeof items.enabled === 'undefined') {
              enabled = true;
          }
          else {
              enabled = items.enabled == "on" ? true : false;
          }
      });
      await new Promise(resolve => {
          setInterval(() => {
              if (selectedKeyboardLayout.key) return resolve("Found");
          }, 500);
      });
      await new Promise(resolve => {
          setInterval(() => {
              if (selectedSwitchType.key) return resolve("Found");
          }, 500);
      });
      loaded = true;
      chrome.runtime.sendMessage({query: "doneLoading"});
  });