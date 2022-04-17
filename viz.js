function generateAggregates(dataTable) {
  let aggregates = []
  for (let c = 1; c < dataTable.getColumnCount()-1; c++) {
    let temp = 0;
    for (let r = 1; r < dataTable.getRowCount(); r++) {
      temp += parseFloat(dataTable.getColumn(c)[r]);
    }
    temp /= dataTable.getRowCount();
    aggregates[c-1] = temp;
  }
  console.log(dataTable.getRow(0).arr.slice(1, 49));

  return dataTable.getRow(0).arr.slice(1, 49);
  // return aggregates;
}

function generateSpeciesCounts(dataTable) {
  let counts = []
  for (let c = 1; c < dataTable.getColumnCount()-1; c++) {
    let temp = 0;
    for (let r = 0; r < dataTable.getRowCount(); r++) {
      if (parseFloat(dataTable.getColumn(c)[r])) {
        temp += 1;
      }
    }
    counts[c-1] = temp;
  }
  console.log(counts);
  return counts;
}

function computeMouseOver(x1, y1, w, h) {
  let x2 = x1 + w;
  let y2 = y1 + h;
  if (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2) {
    return true;
  }
  else {
    return false;
  }
}

function totalBarChart() {
  let boxWidth = windowHeight/(maxYear-minYear);

  // Figure out species counts per year
  let speciesCounts = [];
  for (let yr = minYear; yr < maxYear; yr++) {
    speciesCounts[yr-minYear] = tableDict[yr].getRowCount();
  }


  let colorArr = ['#caedff', '#c4e5fb', '#bdddf8', '#b6d4f4', '#afccf0', '#a8c4ed', '#a1bce9', '#99b4e5', '#92ace1', '#8ba4de', '#849cda', '#7c94d6', '#758dd2', '#6d85cf', '#657dcb', '#5d76c7', '#546fc3', '#4b67c0', '#4160bc', '#3659b8'];
  let colorIndex = 0;
  let boxFill = colorArr[colorIndex];
  let textFill = 40;
  noStroke();
  textFont("Trebuchet MS");
  textSize(20);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < speciesCounts.length; i++) {
    colorIndex = floor(map(speciesCounts[i], 30, 350, 0, colorArr.length));
    boxFill = colorArr[colorIndex];
    textFill = 40;

    if (computeMouseOver(0,boxWidth*i,speciesCounts[i]*0.6, boxWidth+1) || currentYear == i+minYear) {
      boxFill = 40;
      textFill = 240;
      if (mouseIsPressed == true && currentYear != i+minYear) {
        currentYear = i+minYear;
      }
    }

    fill(boxFill);
    rect(0, boxWidth*i, speciesCounts[i]*0.6, boxWidth+1);
    fill(textFill);
    text((i+minYear).toString(), 10, boxWidth*i + boxWidth/2);
  }
}

function yearBarChart(yr) {
  push();
  translate(width/3,height/2);

  let aggs = aggregatesDict[yr];
  let specs = speciesDict[yr];

  let boxWidth = windowWidth/100;
  let maxBarHeight = 120;
  let maxChecklistCount = 500;
  let spaceBetween = 20;


  // Draw date labels
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
  noStroke();
  fill(100);
  textSize(20);
  textAlign(LEFT, CENTER);
  for (let m = 0; m < 12; m++) {
    text(months[m], boxWidth*4*m + 4, 0);
  }
  for (let i = 0; i < 49; i++) {
    stroke(0,5);
    strokeWeight(1);
    if (i % 4 == 0) {stroke(0,50)};
    line(boxWidth*i, spaceBetween, boxWidth*i, -spaceBetween);
  }
  push();
  rotate(3*PI/2);
  textSize(15);
  noStroke();
  text("# of species observed", spaceBetween, -10);
  textAlign(RIGHT);
  text("# of checklists submitted", -spaceBetween, -10);
  pop();


  // Plot aggregates in bar plot
  push();
  translate(0,spaceBetween);
  noStroke();
  fill(252,141,98);
  for (let i = 0; i < aggs.length; i++) {
    rect(boxWidth*i, 0, boxWidth-1, map(aggs[i], 0, maxChecklistCount, 0, maxBarHeight));
  }
  pop();

  // Plot average aggregates in line plot
  push();
  translate(0,spaceBetween);
  stroke(10);
  strokeWeight(4);
  let lastX = boxWidth/2;
  let lastY = map(aggregatesAvg[0], 0, maxChecklistCount, 0, maxBarHeight);
  point(lastX, lastY);
  for (let i = 1; i < aggregatesAvg.length; i++) {
    strokeWeight(4);
    point(lastX+boxWidth, map(aggregatesAvg[i], 0, maxChecklistCount, 0, maxBarHeight));
    strokeWeight(1);
    line(lastX, lastY, lastX+boxWidth, map(aggregatesAvg[i], 0, maxChecklistCount, 0, maxBarHeight));
    lastX += boxWidth;
    lastY = map(aggregatesAvg[i], 0, maxChecklistCount, 0, maxBarHeight);
  }
  pop();

  // Plot species counts in bar plot
  push();
  translate(0,-spaceBetween);
  noStroke();
  fill(102,194,165);
  for (let i = 0; i < specs.length; i++) {
    rect(boxWidth*i, 0, boxWidth-1, map(specs[i], 0, 100, 0, -120));
  }
  fill(40);
  textSize(15);
  pop();

  // Plot average aggregates in line plot
  push();
  translate(0,-spaceBetween);
  stroke(10);
  strokeWeight(4);
  lastX = boxWidth/2;
  lastY = map(speciesAvg[0], 0, 100, 0, -120);
  point(lastX, lastY);
  for (let i = 1; i < speciesAvg.length; i++) {
    strokeWeight(4);
    point(lastX+boxWidth, map(speciesAvg[i], 0, 100, 0, -120));
    strokeWeight(1);
    line(lastX, lastY, lastX+boxWidth, map(speciesAvg[i], 0, 100, 0, -120));
    lastX += boxWidth;
    lastY = map(speciesAvg[i], 0, 100, 0, -120);
  }
  noStroke();
  textSize(15);
  text("Average", lastX + 10, lastY);
  pop();

  pop();
}