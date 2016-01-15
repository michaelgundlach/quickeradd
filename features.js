(function() {
  var allDayNames = [];
  ["dayNames", "abbreviatedDayNames", "shortestDayNames"].forEach(function(key) {
    Array.prototype.push.apply(allDayNames, Date.CultureInfo[key]);
  });
  Date.CultureInfo.allDayNames = allDayNames;
})();

var features = {
  // If first or last 1 or 2 words are a day of the week, replace with a full date
  "The day of the week is never in the past.": function(input, conversion) {
    var output = input.split(' ');

    if (output.length < 2) {
      return input;
    }

    function isDay(pos) {
      if (pos < 0) pos = output.length + pos;
      return Date.CultureInfo.allDayNames.some(day => 
        day.toUpperCase() === output[pos].toUpperCase()
      );
    }
    function isNext(pos) {
      if (pos < 0) pos = output.length + pos;
      return (output[pos].toUpperCase() in {THIS:1, NEXT:1, ON:1});
    }

    // Remove possible "next/this/on" words, all of which we want to
    // interpret as "the next day excluding today".
    if (isNext(0) && isDay(1)) {
      output.splice(0, 1);
    }
    if (isNext(-2) && isDay(-1)) {
      output.splice(output.length - 2, 1);
    }
    if (!(isDay(0) ^ isDay(-1))) {
      return input; // ambiguous or missing days
    }

    var dayword = output.splice((isDay(0) ? 0: -1), 1);

    // date.js knows "next sun" is always 1-7 days ahead
    var date = Date.parse("next " + dayword); 

    output.unshift(date.toLocaleDateString());
    return output.join(' ');
  },

  // TODO: "Missing month is allowed"
};


// Register all features.
Object.keys(features).forEach(name => {
  var fn = features[name];
  Conversion.steps.push({name: name, fn: fn});
});
