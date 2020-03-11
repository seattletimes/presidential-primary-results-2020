require("component-responsive-frame");

// Polyfill for Array.prototype.find
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

var	all_statewide_results = require("../../data/results.json"),
	all_county_results = require("../../data/results_counties.json");

var statewide_results = all_statewide_results.races[0].results[0],
	counties = require("../../data/fips.sheet.json"),
	results_by_county = all_county_results[0].results,
	candidates = require("../../data/candidates.sheet.json");

var tooltip = document.querySelector("#tooltip"),
	county_selector = document.querySelector("#county-selector"),
	county_results_el = document.querySelector("#county-results"),
	county_elements = document.querySelectorAll(".county"),
	county_name_el = document.querySelector("#county-name"),
	candidates_el = document.querySelector("#county-results__candidates");

var html = "";

var colors = {
	"Sanders": "#58b7b4",
	"Warren": "#c45555",
	"Buttigieg": "#d3b537",
	"Bloomberg": "#CC5C3E",
	"Biden": "#1B6387"
};

var show_county_results = function(results) {
	county_results_el.classList.remove("hidden");
	county_results_el.classList.add("shown");

	var county_name = counties[results.fips].county,
		el_id = counties[results.fips].el_id;
	html = "";
	candidates = candidates.sort(function(a, b) {
		return results.candidates.find(c => c.last === b.last).votes
			- results.candidates.find(c => c.last === a.last).votes;
		});
	candidates.forEach(function(c) {
		var percentage = (results.candidates.find(a => a.last === c.last).percentage === null) ? 0 : results.candidates.find(d => d.last === c.last).percentage.toFixed(1);

		html = html + "<p class='candidate " + 
			(c.dropped_out ? "dropout'" : "'") + 
			"><span class='color-block " + c.last + "'></span>" + 
			c.last + 
			": " + percentage + 
			"%</p>";
	});

	// county_name_el.innerText = county_name;
	candidates_el.innerHTML = html;

	county_selector.value = results.fips;
	Array.from(county_elements).forEach(el => {
		el.classList.remove("selected");
	});
	document.querySelector("#" + el_id).classList.add("selected");
};

results_by_county.forEach(function(results) {
	var fips = results.fips,
		county_name = counties[fips].county,
		el = document.querySelector("#" + counties[fips].el_id);
	
	var current_winner = "";
	if (results.reportingPercentage > 0) {
		current_winner = results.candidates.sort(function(a, b) {
			return b.votes - a.votes;
		})[0];
	};

	var fill = (colors[current_winner.last] ? colors[current_winner.last] : "rgb(224, 224, 224)")
	el.setAttribute("fill", fill);

	el.addEventListener("mouseenter", function(e) {
		tooltip.classList.remove("hidden");
		tooltip.classList.add("shown")
		tooltip.innerHTML = county_name;

		var mouseX = e.pageX,
			mouseY = e.pageY;

		tooltip.style.left = mouseX - 30 + "px";
		tooltip.style.top = mouseY - 30 + "px";
	});

	el.addEventListener("mousemove", function(e) {
		var mouseX = e.pageX,
			mouseY = e.pageY;

		tooltip.style.left = mouseX - 30 + "px";
		tooltip.style.top = mouseY - 30 + "px";
	});

	el.addEventListener("mouseout", function(e) {
		tooltip.classList.remove("shown");
		tooltip.classList.add("hidden");
	});

	el.addEventListener("click", function() {
		show_county_results(results);
	});
});

county_selector.addEventListener('change', function() {
	var results = results_by_county.find(c => c.fips === this.value);
	show_county_results(results);
});

show_county_results(results_by_county.find(c => c.fips === "53033"));
