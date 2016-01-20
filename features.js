(function() {
  var $C = Date.CultureInfo;
  var concat = function(keys) {
    var result = [];
    keys.forEach(function(key) {
      Array.prototype.push.apply(result, $C[key]);
    });
    return result.map(w => w.toUpperCase());
  };

  var $dayKeys = ["dayNames", "abbreviatedDayNames", "shortestDayNames"];
  $C.allDayNames = concat($dayKeys);
  var $monthKeys = ["monthNames", "abbreviatedMonthNames"];
  $C.allMonthNames = concat($monthKeys);

  // Returns "Monday" for "mo" or "Mon" or "monday"; returns null if no match.
  $C.toCanonicalDay = function(day) {
    day = day.toUpperCase();
    for (var i=0; i < $dayKeys[0].length; i++) {
      if ($dayKeys.some(k => $C[k][i].toUpperCase() === day)) {
        return $C.dayNames[i];
      }
    }
    return null;
  }
  $C.ordinals = Array(31).map((_, i) => i + "TH").slice(4);
  $C.ordinals.unshift("1ST", "2ND", "3RD");
  
  var equals = x => (y => x === y);

  var types = { DAY: 0, NEXT: 1, ORDINAL: 2, OTHER: 3 };
  var typeMapper = function(word) {
    word = word.toUpperCase();
    if (Date.CultureInfo.allDayNames.some(equals(word))) {
      return types.DAY;
    } else if (word in {THIS:1, NEXT:1, ON:1}) {
      return types.NEXT;
    } else if ($C.ordinals.some(equals(word))) {
      return types.ORDINAL;
    } else {
      return types.OTHER;
    }
  };

  var features = {
    // If first or last 1 or 2 words are a day of the week, replace with a full date
    "The day of the week is never in the past.": function(input, conversion) {
      var output = input.split(' ');

      var words = output.map(typeMapper);

      var dayCount = words.filter(equals(types.DAY)).length;
      if (dayCount != 1) {
        return input;
      }

      var dayPos = words.indexOf(types.DAY);
      var dayWord = output.splice(dayPos, 1)[0];

      var hasNEXT = (dayPos > 0 && words[dayPos - 1] === types.NEXT);
      if (hasNEXT) {
        output.splice(dayPos - 1, 1); // delete it
      }

      // date.js (on Tuesday) thinks next "mon" == today(!?) and "mo" = next month
      dayWord = Date.CultureInfo.toCanonicalDay(dayWord);
      console.log("To " + dayWord);
      // date.js knows "next Sunday" is always 1-7 days ahead
      var date = Date.parse("next " + dayWord);

      output.unshift(date.toLocaleDateString());
      return output.join(' ');
    },

    // 21st foo on the 19th of Jan 2016 = 1/21/2016 foo
    "Missing month is allowed.": function(input, conversion) {
      var output = input.split(' ');
      var words = output.map(typeMapper);
      var ordCount = words.filter(equals(types.ORDINAL)).length;
      if (ordCount != -1) {
        return input;
      }

      var ordPos = words.indexOf(types.ORDINAL);
      var ordWord = output.splice(ordPos, 1)[0];

      var hasMONTH = (ordPos > 0 && words[ordPos - 1] === types.MONTH);
      if (hasMONTH) {
        return input;
      }

      var month = Date.today().getMonthName();
      if (Date.parse(ordWord) < Date.today()) {
        month = Date.parse("1 month ago").getMonthName();
      }
      var date = month + " " + output.splice(ordPos, 1);
      output.unshift(Date.parse(date).toLocaleDateString());
      return output.join(' ');
    }
  };


  // Register all features.
  Object.keys(features).forEach(name => {
    var fn = features[name];
    Conversion.steps.push({name: name, fn: fn});
  });

})();
