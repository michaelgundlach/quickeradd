chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  var response = undefined;
  if (req.cmd === "convert") {
    response = new Conversion(req.text).convert();
  }
  // eventually: other messages

  if (response !== undefined) {
    sendResponse(response);
  }
});


// Represents a conversion from smart text to dumb text as a series of
// steps.
function Conversion(text) {
  this._outputs = [text];
}
Conversion.prototype = {
  convert: function() {
    var that = this;
    Conversion.steps.forEach(function(step) {
      var result = step.fn(that.current(), that);
      that._outputs.push(result);

      console.log("step '" + step.name + "': " + 
                  that.previous() + "' => '" + that.current() + "'");
    });

    return this.current();
  },
  current:  function() { return this._outputs[this._outputs.length - 1]; },
  previous: function() { return this._outputs[this._outputs.length - 2]; },
  first:    function() { return this._outputs[0]; },
  all:      function() { return this._outputs.slice() },
};
Conversion.steps = [];
