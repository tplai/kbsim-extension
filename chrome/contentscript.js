//This code is used to detect when keys are pushed and released so it can play the key press/release audios when the events happen

//this has no copied code from kbs.im

function keyDown(e) {
    chrome.runtime.sendMessage({keyDown: e.which});
}
function keyUp(e) {
    chrome.runtime.sendMessage({keyUp: e.keyCode});
}
(function checkForNewIframe(doc) {
    if (!doc) return;

    doc.addEventListener('keydown', keyDown, true);
    doc.addEventListener('keyup', keyUp, true);
    for (var i = 0, contentDocument; i<frames.length; i++) {
        try {
            contentDocument = iframes[i].document;
        } catch (e) {
            continue;
        }
        if (contentDocument) {
            checkForNewIframe(iframes[i].contentDocument);
        }
    }
    setTimeout(checkForNewIframe, 250, doc);
})(document);