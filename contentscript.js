// TODO: let the user complain and suggest a better/correct translation


// Replace the dumb Quick Add box with a smarter one.  Text entered in the
// smart one will be dumbed down and typed into the dumb Quick Add box.
function waitForQuickAddPopup() {
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      [].slice.call(mutation.addedNodes)
        .filter((node) => node.className === "qab-container gcal-popup")
        .forEach(function(node) {
          observer.disconnect(); // stop watching needlessly

          injectSmartBox(node);

        });
    });    
  });
  observer.observe(document.body, {childList: true});
}

function injectSmartBox(quickAddPopup) {
  var dumbBox = $(quickAddPopup).children("textarea");
  var addButton = $(quickAddPopup).children('[role="button"]');
  var smartBox = dumbBox.clone(false).addClass("quickeradd-box");
  dumbBox.hide();
  addButton.hide();
  smartBox.insertAfter(dumbBox).focus();
  smartBox.on("input", function(e) {
    chrome.runtime.sendMessage({cmd: "wake up, you'll have a job soon."});
    if (!smartBox.val().endsWith('\n')) {
      return;
    }

    var smartText = $.trim(smartBox.val());
    smartBox.val("");
    chrome.runtime.sendMessage({cmd: "convert", text: smartText}, function(dumbText) {
      dumbBox.val(dumbText);
      addButton.click();
    });
  });

  focusOnReshow(quickAddPopup, smartBox);
}

// Re-focus smartBox whenever Quick Add popup is re-shown.
function focusOnReshow(quickAddPopup, smartBox) {
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (quickAddPopup.style.visibility === "visible") {
        smartBox.focus();
      };
    });
  }).observe(quickAddPopup, {attributes: true, attributeFilter: ["style"]});
}

$(function() {
  waitForQuickAddPopup();
});
