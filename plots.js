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


function buildCharts(sample) {   // Create the buildCharts function.
  d3.json("samples.json").then((data) => {   // Use d3.json to load and retrieve the samples.json file 
    var resample =  data.samples.filter(sampleObj => sampleObj.id == sample)[0];
    var washFreq =  data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
    let otu_ids = resample.otu_ids;   // Create variables for the otu_ids, otu_labels, and sample_values
    let otu_labels = resample.otu_labels;
    let sample_values = resample.sample_values;

    var barData = [{
      x: sample_values.slice(0, 10).reverse(), y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(), name: 'Bacteria', type: 'bar', orientation: 'h'
    }];
    var bubbleData = [{
      x: otu_ids, y: sample_values, mode: 'markers', text: otu_labels,
      mode:'markers',marker:{color:otu_ids ,size:sample_values}
    }];
    var gaugeData = [{domain: { x: [0, 1], y: [0, 1] }, value: washFreq,
      title: {text: "Scrubs per Week"}, type: "indicator", mode: "gauge+number",
      gauge: {
        bar: {color:'black'},
        axis: {range: [0,10]},
        steps: [{range: [0,2], color: "red"},{range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},{range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}]
      }
    }];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title:'OTU ID'}
    };
    var gaugeLayout = { 
      title: 'Belly Button Washing Frequency'
    };

    Plotly.newPlot("bar", barData, barLayout);  // Plotly to plot bar
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);  // Plotly to plot bubble
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);  // Plotly to plot gauge 
  });
}

