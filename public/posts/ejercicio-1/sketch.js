let data;
let temps = [];
let suma = 0;
let media = 0;
let minTemp, maxTemp;
let w = 0;
let x, y = 0;
let colors = [];
var cnv;
let checkRaton = true;
let saveImg;
let year = 0;

function preload() {
  data = loadTable("https://raw.githubusercontent.com/Saigesp/d3graphs/master/examples/stripelines/temps.scsv", "ssv", "header");
}

function setup() {
  //print(data);
  //createCanvas(windowWidth, windowHeight);
  cnv = createCanvas(864, 600);
  cnv.style('display', 'block');
  background(255);

  for (let i = 0; i < data.getRowCount(); i++) {
    temps[i] = data.getNum(i, 13);
    //print(temps[i]);
    //media
    suma = suma + temps[i];
  }
  //print(suma);
  media = suma / data.getRowCount(); //calculo media historica
  minTemp = min(temps);
  maxTemp = max(temps);

  print("La temperatura mínima histórica es: " + minTemp + " ºC");
  print("La temperatura media histórica es: " + media + " ºC");
  print("La temperatura máxima histórica es: " + maxTemp + " ºC");



  noStroke();


  plot();

}

function draw() {
  plot();
  cnv.mouseOver(mouseDentro); 
  cnv.mouseOut(mouseFuera);
  for (let i = 0; i < temps.length; i++) {
    x = i * w;
    if (mouseX > x && mouseX < x + w && checkRaton == true) {
      fill(255);
      rect(x, y, w, height);
      //texto
      fill(0);
      push();
      translate(x+w/2, height/2);
      rotate(radians(-90));
      textSize(20);
      textAlign(CENTER, CENTER);
      year = data.getNum(i,0);
      text("La temperatura del año "+year+" era de "+temps[i]+" ºC", 0,0);
    }
  }
}

function plot() {
  var palRed = Brewer.sequential("Reds", 8, minTemp, maxTemp);
  var palBlue = Brewer.sequential("Blues", 8, minTemp, maxTemp);

  for (let i = 0; i < temps.length; i++) {
    //temp cálidas
    if (temps[i] > media) {
      colors[i] = palRed.colorForValue(temps[i]);
    }
    //temp frías
    if (temps[i] < media) {
      colors[i] = palBlue.colorForValue(temps[i]);
    }
  }

  w = width / data.getRowCount();
  //print(w);
  for (let i = 0; i < data.getRowCount(); i++) {
    x = i * w;
    fill(colors[i]);
    rect(x, y, w, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseFuera(){
  //print("raton fuera");
  checkRaton = false;
}

function mouseDentro(){
  //  print("raton dentro");
  checkRaton = true;
}

function mousePressed(){
  saveImg = cnv.get(0,0,width,height);
  saveImg.save("warm-stripe-"+year+".png");
}