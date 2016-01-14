var util = {
  tokenize: (input) => input.split(' '),

  detokenize: (input) => input.join(' '),
};

var features = [
  {
    name: "The day of the week is never in the past.",
    transformations: [
      util.tokenize,

      // If first 1 or 2 word are a day of the week, replace with a full date
      function(input, conversion) {
        var output = input.slice();
        if (output[0].toUpperCase() in {THIS: 1, NEXT: 1}) {
          output = output.slice(1);
        }
        output.unshift("next"); // date.js understands "next foo" as 1-7 days from now

        var possible_day = output.slice(0, 2).join(" ");
        output = output.slice(2);

        console.log("possible day: " + possible_day);
        var date = Date.parse(possible_day);

        console.log(date);
        if (date === null) {
          return input; // no modification
        }

        output.unshift(date.toLocaleDateString());
        return output;
      },

      util.detokenize
    ]
  },

  // TODO: "Missing month is allowed"
];


// Register all features.
features.forEach(feature => {
  Array.prototype.push.apply(Conversion.transformations, feature.transformations);
});
