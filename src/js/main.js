require("component-responsive-frame/child");

var counties_by_fips = require("../../data/fips.sheet.json");
var all_results = require("../../data/results_counties.json");
var results = all_results[0].results;
var elements = Array.from(document.querySelectorAll(".county"));

var colors = {
	"Sanders": "#3b99a7",
	"Warren": "#e26e42",
	"Buttigieg": "#bd4579",
	"Biden": "#ffb609",
	"Klobuchar": "#8357aa",
	"Bloomberg": "#5278d8"
};

var template = `<h2>County name</h2>
  <p class="note">TK% of precincts reporting</p>
  <ul class="candidates">
    <li>First Last: TK%</li>
  </ul>`;

results.forEach(function(county_results) {
	var fips = county_results.fips;
	var county_name = counties_by_fips[fips].county;
	var el = document.querySelector("#" + counties_by_fips[fips].el_id);

	var current_winner = county_results.candidates.sort(function(a, b) {
		return b.votes - a.votes;
	})[0];

	el.setAttribute("fill", colors[current_winner.last]);
});

elements.forEach(function(el) {
	el.addEventListener("click", function() {
		document.querySelector("#results").innerHTML = el.id;
	})
});