require("component-responsive-frame/child");

var counties_by_fips = require("../../data/fips.sheet.json"),
		all_results = require("../../data/results_counties.json"),
	results = all_results[0].results,
		all_candidates = require("../../data/candidates.sheet.json"),
	candidates = all_candidates.filter(candidate => candidate.show === true);

var colors = {
	"Sanders": "#58b7b4",
	"Warren": "#c45555",
	"Buttigieg": "#d3b537",
	"Biden": "#4995c4",
	"Klobuchar": "#8766aa",
	"Bloomberg": "#cc5c3e"
};

results.forEach(function(county_results) {
	var fips = county_results.fips;
	var county_name = counties_by_fips[fips].county;
	var el = document.querySelector("#" + counties_by_fips[fips].el_id);

	var current_winner = county_results.candidates.sort(function(a, b) {
		return b.votes - a.votes;
	})[0];

	el.setAttribute("fill", colors[current_winner.last]);

	el.addEventListener("click", function() {
		document.querySelector("#place-name").innerText = county_name;
		document.querySelector("#reporting-percentage").innerText = county_results.reportingPercentage;
		
		var html = "";
		candidates.forEach(function(c) {
			var percentage = county_results.candidates.find(d => d.last === c.last).percentage;

			html = html + "<li><span class='color-block " + c.last + "'></span>" + 
				c.first + " " + c.last + 
				": " + percentage + 
				"%</li>";
		});
		document.querySelector("#candidates").innerHTML = html;
	})
});