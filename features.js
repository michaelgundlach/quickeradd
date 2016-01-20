// TODO: why does "monday foo" work on tuesday but "mon foo" puts it *on* tuesday?

(function() {
  var allDayNames = [];
  ["dayNames", "abbreviatedDayNames", "shortestDayNames"].forEach(function(key) {
    Array.prototype.push.apply(allDayNames, Date.CultureInfo[key]);
  });
  Date.CultureInfo.allDayNames = allDayNames.map(w => w.toUpperCase());
})();

var features = {
  // If first or last 1 or 2 words are a day of the week, replace with a full date
  "The day of the week is never in the past.": function(input, conversion) {
    var output = input.split(' ');

    var types = { DAY: 0, NEXT: 1, OTHER: 2 };
    var equals = x => (y => x === y);

    var words = output.map(word => {
      word = word.toUpperCase();
      if (Date.CultureInfo.allDayNames.some(equals(word))) {
        return types.DAY;
      } else if (word in {THIS:1, NEXT:1, ON:1}) {
        return types.NEXT;
      } else {
        return types.OTHER;
      }
    });

    var dayCount = words.filter(equals(types.DAY)).length;
    if (dayCount != 1) {
      return input;
    }

    var dayPos = words.indexOf(types.DAY);
    var dayWord = output.splice(dayPos, 1);

    var hasNEXT = (dayPos > 0 && words[dayPos - 1] === types.NEXT);
    if (hasNEXT) {
      output.splice(dayPos - 1, 1); // delete it
    }

    // date.js knows "next sun" is always 1-7 days ahead
    var date = Date.parse("next " + dayWord);

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
