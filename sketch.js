//ova aplikacija je napravljena po uzoru na youtube kanal "The Coding Train" - https://www.youtube.com/watch?v=bGz7mv2vD6g
//koristimo p5.js library (služi za grafiku te ima dosta lakše metode za iscrtavanje i praćenje pozicije oblika) za lakšu vizualizaciju genetskih algoritama - https://p5js.org/

//inicijaliziram par varijabli s defaultnim vrijednostima, koje kasnije ovise o korisnikovom inputu
var population;
//defaultni, ujedno i maksimalni životni ciklus
var lifespan = 400;
//nagrada koju korisnik može mijenjati. o ovoj varijabli ovisi fitness vrijednost za pojedinu "raketu"
var reward = 300;
//prati trenutnu generaciju raketa
var currGen = 0;
//temporary varijabla koju koristim jedino za prikaz maks fitness na ekranu
var tempMaxFit = 0;
//prikazujem trenutni životni ciklus
var count = 0;
//cilj
var target;
//warp 2 pogon, zastrajeli motor, ali može se upgrejdat (nema slidera, služi samo za promjenu "brzine" vektora, tj. za brzinu promjene promjene pozicije)
var maxforce = 0.2;

//inicijaliziram par kontrola
var lifespanSlider;
var barrierCheck;
var popSizeSlider;
var rewardSlider;

//inicijaliziram barijeru za rakete
var rx = 0;
var ry = 0;
var rw = 0;
var rh = 0;

function setup() {
    //kreiram kanvas na koji će se iscrtavati razni elementi
    createCanvas(windowWidth, windowHeight);

    //kreiram slidere koji će uzimati korisnikov input
    lifespanSlider = createSlider(200, 400, 400, 1);
    lifespanSlider.position(400, 60);
    lifespanSlider.style('width', '200px');
    popSizeSlider = createSlider(10, 1000, 50, 10);
    popSizeSlider.position(400, 110);
    popSizeSlider.style('width', '200px');
    rewardSlider = createSlider(100, 100000, 300, 100);
    rewardSlider.position(400, 160);
    rewardSlider.style('width', '200px');
    barrierCheck = createCheckbox('Barrier?', true);
    barrierCheck.position(700, 60);

    //kreiram defaultnu populaciju raketa, ujedno inicijalizira ostale funkcije potrebne za rad aplikacije
    population = new Population(popSizeSlider.value());

    //kreiram cilj za rakete i prepreku koju bi trebalo izbjeći
    target = createVector(random(width / 3, width / 1.5), random(height / 3, height / 1.5));
    rx = target.x - 100;
    ry = target.y + 100;
    rw = 200;
    rh = 20;

    //event listener za promjenu populacije rakete. ne mogu napraviti hot swap raketa, budući da količina raketa za sobom vuče i količinu DNA i ostale potrebne arrayeve.
    //budući da vuće dosta toga za sobom, na svaku promjenu količine rakete resetira se trenutna generacija raketa
    popSizeSlider.input(resetSketch);
}

//opisao sam par redaka iznad
function resetSketch() {
    population = new Population(popSizeSlider.value());
    count = 0;
}

//poziva se svaki frame koji je po defaultu 60 puta u sekundi.
function draw() {
    //crtam crni background
    background(0);
    //dohvaćam vrijednosti sa slidera
    lifespan = lifespanSlider.value();
    reward = rewardSlider.value();

    //poziva funkciju koja prati a ujedno i iscrtava stanje svake rakete na ekranu
    population.run(count, barrierCheck.checked());
    // iscrtavam razne informacije za korisnika poput trenutnog života generacije, renutnu generaciju, max fitness vrijednost
    //ujedno pišem opis za slidere da korisnik zna što je što
    textSize(20);
    text("lifespan slider (200-400)", 400, 50);
    text("Rocket count slider (10-1000)", 400, 100);
    text("reward value", 400, 150);
    text("Generation lifespan: " + count, 40, 50);
    text("Current generation: " + currGen, 40, 80);
    tempMaxFit = floor(population.getFit());
    text("Current generation max fitness: " + tempMaxFit, 40, 110);
    fill(255, 255, 255);
    //svaki frame povećavam count za jedan te time pratim životni ciklus populacije
    count++;
    //provjeravam granične uvjete, tj. ako je trenutni život jednak konačnom životu, i ujedno ako je veće od 400 da se izbjegne bug vezan uz slider
    if (count == lifespan || count > 400) {
        //nakon kraja života pozivam funkcije potrebne za izračun fitnessa raketa
        population.evaluate(reward);
        //te za selekciju gena i "nasljeđivanje" najboljih gena za raketu
        population.selection();
        //resetiram trenutni život i povećavam broj da se vidi da je došla sljedeća generacija raketa
        count = 0;
        currGen++;
    }
    // ovo služi samo za prikaz barikade i cilja, nema nikakav physics engine u sebi
    fill(255);
    if (barrierCheck.checked()) {
        rect(rx, ry, rw, rh);
    }
    ellipse(target.x, target.y, 16, 16);
}