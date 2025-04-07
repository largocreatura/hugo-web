let urlRoot = "https://api.openweathermap.org/";
let apiGeo = "geo/1.0/direct?q=";
let apiPoll = "data/2.5/air_pollution?";
let apiKey = "&appid=43eca575191b12321f3ed2aab7623830";

let input;
let lat, lon;
let so2, no2, o3, pm2_5;
let cityName;
let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  let button = select("#submit");
  button.mousePressed(geoAsk);
  input = select("#ciudad");
}

function draw() {
  background(255);
  textSize(24);
  textAlign(CENTER, TOP);
  fill(0);

  if (so2 || no2 || o3 || pm2_5) {
    generateCircles();
  }
  moveCircles();
}

function geoAsk() {
  cityName = input.value();
  loadJSON(urlRoot + apiGeo + cityName + apiKey, gotGeoData);
}

function gotGeoData(data) {
  if (data.length === 0) {
    console.log("Ciudad no encontrada.");
    return;
  }
  lat = "lat=" + data[0].lat;
  lon = "&lon=" + data[0].lon;
  pollAsk();
}

function pollAsk() {
  loadJSON(urlRoot + apiPoll + lat + lon + apiKey, gotPollData);
}

function gotPollData(data) {
  let components = data.list[0].components;
  so2 = components.so2;
  no2 = components.no2;
  o3 = components.o3;
  pm2_5 = components.pm2_5;
  console.log("SO2:", so2, "NO2:", no2, "O3:", o3, "PM2.5:", pm2_5);
}

function generateCircles() {
  let dataValues = [so2, no2, o3, pm2_5];
  let labels = ["SO2", "NO2", "O3", "PM2.5"];
  let baseX = width / 5;
  let radius = 100;

  for (let i = 0; i < dataValues.length; i++) {
    let colorLevel = getColor(dataValues[i]);
    let circleX = baseX + i * (2 * radius + 100);
    let circleY = height / 4;

    // Dibujar el borde del círculo contenedor
    noFill();
    noStroke();
    strokeWeight(4);
    ellipse(circleX, circleY, radius * 2, radius * 2);

    // Dibujar el nombre del contaminante encima del círculo
    noStroke();
    fill(0);
    textSize(18);
    textAlign(CENTER, BOTTOM);
    text(labels[i], circleX, circleY - radius - 10);

    // Crear los círculos internos
    createInnerCircles(circleX, circleY, radius, colorLevel);

    // Dibujar la frase descriptiva debajo del círculo, alineada al centro
    displayDescription(circleX, circleY + radius + 20, labels[i], colorLevel);
  }
}

function createInnerCircles(centerX, centerY, radius, colorLevel) {
  let numCircles = 10;
  let angleStep = TWO_PI / numCircles;
  let circleSize = 15;
  let offsetAngle = frameCount * 0.01;

  for (let i = 0; i < numCircles; i++) {
    let angle = offsetAngle + angleStep * i;
    let x = centerX + cos(angle) * (radius - circleSize);
    let y = centerY + sin(angle) * (radius - circleSize);
    circles.push({ x, y, radius: circleSize, color: colorLevel, centerX, centerY, angle });
  }
}

function moveCircles() {
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    c.angle += 0.01;
    c.x = c.centerX + cos(c.angle) * (100 - c.radius);
    c.y = c.centerY + sin(c.angle) * (100 - c.radius);

    noStroke();
    fill(c.color);
    ellipse(c.x, c.y, c.radius * 2, c.radius * 2);
  }
}

function getColor(value) {
  if (value < 60) return color(0, 255, 0);  // Verde (baja contaminación)
  if (value < 150) return color(255, 165, 0); // Naranja (media)
  return color(255, 0, 0); // Rojo (alta contaminación)
}

function displayDescription(x, y, label, colorLevel) {
  textSize(16);
  textAlign(CENTER, TOP);  // Centramos el texto
  fill(0);
  
  let description = "";

  // Determinar la descripción según el contaminante y su nivel de color
  if (label === "SO2") {
    if (colorLevel.levels[0] === 0 && colorLevel.levels[1] === 255 && colorLevel.levels[2] === 0) {
      description = "Los niveles de El dióxido de azufre que se origina a partir de la combustión de combustibles fósiles es leve.";
    } else if (colorLevel.levels[0] === 255 && colorLevel.levels[1] === 165 && colorLevel.levels[2] === 0) {
      description = "Los niveles de El dióxido de azufre que se origina a partir de la combustión de combustibles fósiles son medios, pero se debe estar atento.";
    } else {
      description = "Los niveles de El dióxido de azufre son muy elevados, es importante tomar precauciones.";
    }
  }

  if (label === "NO2") {
    if (colorLevel.levels[0] === 0 && colorLevel.levels[1] === 255 && colorLevel.levels[2] === 0) {
      description = "Los niveles de El dióxido de nitrógeno (NO2) producidos por el tráfico rodado, industrias y grandes instalaciones de combustión es leve.";
    } else if (colorLevel.levels[0] === 255 && colorLevel.levels[1] === 165 && colorLevel.levels[2] === 0) {
      description = "Los niveles de El dióxido de nitrógeno (NO2) son medios, pero se debe estar atento.";
    } else {
      description = "Los niveles de El dióxido de nitrógeno (NO2) son elevados, es importante tomar precauciones.";
    }
  }

  if (label === "O3") {
    if (colorLevel.levels[0] === 0 && colorLevel.levels[1] === 255 && colorLevel.levels[2] === 0) {
      description = "Los niveles de Ozono (O3) son leves, lo que representa una calidad de aire aceptable.";
    } else if (colorLevel.levels[0] === 255 && colorLevel.levels[1] === 165 && colorLevel.levels[2] === 0) {
      description = "Los niveles de Ozono (O3) son medios, pero se debe estar atento.";
    } else {
      description = "Los niveles de Ozono (O3) son elevados, es importante tomar precauciones.";
    }
  }

  if (label === "PM2.5") {
    if (colorLevel.levels[0] === 0 && colorLevel.levels[1] === 255 && colorLevel.levels[2] === 0) {
      description = "Los niveles de partículas finas (PM2.5) son leves, lo que representa una buena calidad del aire.";
    } else if (colorLevel.levels[0] === 255 && colorLevel.levels[1] === 165 && colorLevel.levels[2] === 0) {
      description = "Los niveles de partículas finas (PM2.5) son medios, se recomienda estar atento.";
    } else {
      description = "Los niveles de partículas finas (PM2.5) son elevados, pero se debe estar atento.";
    }
  }

  // Dividir el texto en líneas según el ancho máximo de 50 px
  let maxWidth = 200;  // Ancho máximo de cada línea
  let words = description.split(" ");
  let lines = [];
  let currentLine = "";

  // Recorrer las palabras y crear las líneas
  for (let i = 0; i < words.length; i++) {
    let testLine = currentLine + words[i] + " ";
    if (textWidth(testLine) > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine); // Agregar la última línea

  // Dibujar cada línea de texto centrada
  let lineHeight = 18;  // Espacio entre las líneas
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + i * lineHeight); // Centramos el texto
  }
}
