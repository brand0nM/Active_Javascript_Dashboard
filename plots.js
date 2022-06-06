function populateDropDown(){
	var selector = d3.select('#selDataset');
	d3.json('samples.json').then((data) => {
		var sampleNames = data.names;
		sampleNames.forEach((sample) => {
			selector.append('option')
				.text(sample)
				.property('value', sample);
		});
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
	});
};
populateDropDown();


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
     });
  });
};


function buildCharts(sample) {  // Create buildCharts function.
  d3.json("samples.json").then((data) => {  // d3.json to load and retrieve sample rows 
  	var samples = data.samples;  // samples object. 
    var selectedSample = samples.filter(sampleFilt => sampleFilt.id == sample)[0];  // filter desired sample
    var otu_ids = selectedSample.otu_ids;
    var  otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values.sort();
    // 3. Create a variable that holds the washing frequency.

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids most bacteria are last.
    var barData = [{  // Create the mapped data for the bar chart.
    	x: samples.map(row => row.sample_values), y: samples.map(row => row.otu_ids),
    	text: samples.map(row => row.otu_ids), name: "Bacteria", type: "bar", orientation: "h"
  	}];   
    var bubbleData = [  // Create the trace for the bubble chart.
    ];
    var gaugeData = [  // Create the trace for the gauge chart.
    ];
  	var barlayout = {  // Create layout for the bar chart. 
  		title: "Top 10 Bacteria Cultures Found",
  		margin: {l: 100, r: 100, t: 100, b: 100},
  		yaxis:  {tickvals: sample_values,ticktext : otu_labels}
  	};
    var bubbleLayout = {  // Create the layout for the bubble chart.
    };
    var gaugeLayout = {  // Create the layout for the gauge chart.
    };
  	Plotly.newPlot("bar", barData, barlayout);  // Plotly to plot bar
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);  // Plotly to plot bubble
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);  // Plotly to plot gauge 
  });
}


