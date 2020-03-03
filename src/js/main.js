require("component-responsive-frame/child");

var	all_statewide_results = require("../../data/results.json"),
	statewide_results = all_statewide_results.races[0].results[0],
	counties_by_fips = require("../../data/fips.sheet.json"),
		all_county_results = require("../../data/results_counties.json"),
	results = all_county_results[0].results,
		all_candidates = require("../../data/candidates.sheet.json"),
		candidates = all_candidates;
	// candidates = all_candidates.filter(c => c.show === true);

var tooltip = document.querySelector("#tooltip"),
	statewide_button = document.querySelector("#statewide-button"),
	place_name = document.querySelector("#place-name"),
	reporting_percentage = document.querySelector("#reporting-percentage"),
	candidates_el = document.querySelector("#candidates");

var html = "";

var colors = {
	"Sanders": "#58b7b4",
	"Warren": "#c45555",
	"Buttigieg": "#d3b537",
	"Biden": "#4995c4",
	"Klobuchar": "#8766aa",
	"Bloomberg": "#cc5c3e"
};

// var showStatewideResults = function() {
// 	statewide_button.classList.remove("shown");
// 	statewide_button.classList.add("hidden");

// 	place_name.innerText = "Washington state";
// 	reporting_percentage.innerText = statewide_results.reportingPercentage;

// 	html = "";
// 	candidates = candidates.sort(function(a, b) {
//   return statewide_results.candidates.find(c => c.last === b.last).votes
//   	- statewide_results.candidates.find(c => c.last === a.last).votes;
// 	});
// 	candidates.forEach(function(c) {
// 		var percentage = (statewide_results.candidates.find(d => d.last === c.last).percentage === null) ? 0 : statewide_results.candidates.find(d => d.last === c.last).percentage;
// 		html = html + "<li><span class='color-block " + c.last + "'></span>" + 
// 			c.first + " " + c.last + 
// 			": " + percentage + 
// 			"%</li>";
// 	});

// 	candidates_el.innerHTML = html;
// };

results.forEach(function(county_results) {
	var fips = county_results.fips;
	var county_name = counties_by_fips[fips].county;
	var el = document.querySelector("#" + counties_by_fips[fips].el_id);
	var current_winner = county_results.candidates.sort(function(a, b) {
		return b.votes - a.votes;
	})[0];

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
		document.querySelector("#statewide-button").classList.remove("hidden");
		document.querySelector("#statewide-button").classList.add("shown");

		place_name.innerText = county_name;
		reporting_percentage.innerText = county_results.reportingPercentage;

		html = "";
		candidates = candidates.sort(function(a, b) {
			return county_results.candidates.find(c => c.last === b.last).votes
  	- county_results.candidates.find(c => c.last === a.last).votes;
		});
		candidates.forEach(function(c) {
			var percentage = (county_results.candidates.find(d => d.last === c.last).percentage === null) ? 0 : county_results.candidates.find(d => d.last === c.last).percentage;

			html = html + "<li><span class='color-block " + c.last + "'></span>" + 
				c.first + " " + c.last + 
				": " + percentage + 
				"%</li>";
		});

		candidates_el.innerHTML = html;
	});
});

// statewide_button.addEventListener("click", function() {
// 	showStatewideResults();
// });