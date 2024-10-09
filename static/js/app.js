// Define the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// INITIALIZE THE DASHBOARD
// Create a function to initialize the details
function init() {

    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        
        let names = data.names;
        names.forEach((id) => {

            console.log(id);
            dropdownMenu.append("option").text(id).property("value", id);
        });

        let sampleFirst = names[0];

        console.log(sampleFirst);

        charts(sampleFirst);
        demoInfo(sampleFirst);
        gaugeChart(sampleFirst);
    });
    };

// Change the charts and demographic info box based on dropdown selection
function optionChanged(sampleNew) {
    charts(sampleNew);
    demoInfo(sampleNew);
    gaugeChart(sampleNew);
    };

// Create a function to build the charts
function charts(sampleID) {

    d3.json(url).then((data) => {
    let sampleData = data.samples;

    let filteredSample = sampleData.filter(sample => sample.id == sampleID);
    let firstSample = filteredSample[0]
    let otu_ids = firstSample.otu_ids;
    let otu_labels = firstSample.otu_labels;
    let sample_values = firstSample.sample_values;

    // ----- HORIZONTAL BAR CHART ----- //
    
    let traceBar = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    let dataBar = [traceBar];
    let layoutBar = {
        title: `<b>Top 10 OTUs found in Individual ${sampleID}</b>`,
    };

    Plotly.newPlot("bar", dataBar, layoutBar);


    // ----- BUBBLE CHART ----- //

    let traceBubble = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };

    let dataBubble = [traceBubble];
    let layoutBubble = {
        title: "<b>Sample information</b>",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
  });
};
  

// SAMPLE METADATA
function demoInfo(sampleID) {

    d3.json(url).then((data) => {
    let metadata = data.metadata;
    let filteredSample = metadata.filter(sample => sample.id == sampleID);
    let firstSample = filteredSample[0]

    let demoInfoBox = d3.select("#sample-metadata").html("");
    Object.entries(firstSample).forEach(([key, value]) => {

        demoInfoBox.append("h5").text(`${key.toUpperCase()}: ${value}`);
        });
  });
};


// GAUGE CHART
function gaugeChart(sampleID) {

    d3.json(url).then((data) => {
    let metadata = data.metadata;
    let filteredSample = metadata.filter(sample => sample.id == sampleID);
    let firstSample = filteredSample[0]

    let traceGauge = {
        domain: { x: [0, 1], y: [0, 1] },
        value: firstSample.wfreq,
        title: {
            text: "<b>Belly Button Washing frequency</b><br>Scrubs per Week", 
            font: {size: 20}
        },
        type: "indicator",
        direction: "clockwise",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 9],
                tickmode: "linear"},
            shape: "angular",
            bgcolor: "gray",
            borderwidth: 1,
            bordercolor: "black",
            steps: [
                { range: [0, 1], color: "rgba(230, 220, 200, .5)" },
                { range: [1, 2], color: "rgba(210, 205, 150, .5)" },
                { range: [2, 3], color: "rgba(190, 200, 90, .5)" },
                { range: [3, 4], color: "rgba(170, 200, 40, .5)" },
                { range: [4, 5], color: "rgba(120, 160, 20, .5)" },
                { range: [5, 6], color: "rgba(20, 130, 0, .5)" },
                { range: [6, 7], color: "rgba(15, 100, 0 ,.5)" },
                { range: [7, 8], color: "rgba(10, 80, 0, .5)" },
                { range: [8, 9], color: "rgba(7, 60, 0, .5)" }
            ],
            threshold: {
                line: { color: "red", width: 5 },
                thickness: 1.5,
                value: firstSample.wfreq
              }
        }
   };

    let dataGauge = [traceGauge];

    let layoutGauge = {
        width: 400,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
      };
    
    Plotly.newPlot("gauge", dataGauge, layoutGauge);
    
  });
};

init();