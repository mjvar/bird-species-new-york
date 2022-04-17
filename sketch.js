let canvasWidth = 1400;
let canvasHeight = 800;

let tableDict = {};
let aggregatesDict = {};
let speciesDict = {};

let aggregatesAvg;
let speciesAvg;

let minYear = 2006;
let maxYear = 2022;

let currentYear = 2016;

function preload() {
  for (let yr = minYear; yr < maxYear; yr++) {
    let fn = "data/ebird_US-NY-061__" + yr.toString() + "_" + yr.toString() + "_1_12_barchart.tsv.txt";
    tableDict[yr] = loadTable(fn, "tsv");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // process data from tables
  for (let yr = minYear; yr < maxYear; yr++) {
    aggregatesDict[yr] = generateAggregates(tableDict[yr]);
    speciesDict[yr] = generateSpeciesCounts(tableDict[yr]);
  }
  // get averages
  aggregatesAvg = new Array(48).fill(0);
  speciesAvg = new Array(48).fill(0);

  for (let yr = minYear; yr < maxYear; yr++) {
    for (let i = 0; i < aggregatesDict[yr].length; i++) {
      aggregatesAvg[i] += aggregatesDict[yr][i]/(maxYear-minYear);
      speciesAvg[i] += speciesDict[yr][i]/(maxYear-minYear);
    }
  }

  textFont("Trebuchet MS");
}

function draw() {
  background(250, 100);
  totalBarChart();
  yearBarChart(currentYear);
}

