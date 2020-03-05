require("component-responsive-frame/child");

var	all_statewide_results = require("../../data/results.json"),
	all_county_results = require("../../data/results_counties.json");

var statewide_results = all_statewide_results.races[0].results[0],
	counties = require("../../data/fips.sheet.json"),
	results_by_county = all_county_results[0].results,
	candidates = require("../../data/candidates.sheet.json");

var tooltip = document.querySelector("#tooltip"),
	county_selector = document.querySelector("#county-selector"),
	county_results_el = document.querySelector("#county-results"),
	county_name_el = document.querySelector("#county-name"),
	reporting_percentage_el = document.querySelector("#reporting-percentage"),
	candidates_el = document.querySelector("#county-results__candidates");

var html = "";

var colors = {
	"Sanders": "#58b7b4",
	"Warren": "#c45555",
	"Buttigieg": "#d3b537",
	"Biden": "#4995c4",
	"Bloomberg": "#cc5c3e"
};

var show_county_results = function(results) {
	county_results_el.classList.remove("hidden");
	county_results_el.classList.add("shown");

	var county_name = counties[results.fips].county;
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
	reporting_percentage_el.innerText = results.reportingPercentage;
	candidates_el.innerHTML = html;

	county_selector.value = results.fips;
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

county_selector.addEventListener('change', function(e) {
	var results = results_by_county.find(e => e.fips === this.value);
	show_county_results(results);
});

show_county_results(results_by_county.find(e => e.fips === "53033"));