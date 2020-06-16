//osnovni physics engine i kalkulacija fitness vrijednosti rakete
function Rocket(dna) {
    //inicijaliziram poziciju rakete(s početnim uvjetima), brzinu i akceleraciju rakete
    this.pos = createVector(width / 2, height - 50);
    this.vel = createVector();
    this.acc = createVector();
    //globalne varijable(za ovu klasu) koje prate sudar rakete s ciljem, preprekom ili rubom ekrana
    this.completed = false;
    this.crashed = false;
    //varijabla za praćenje vremena života rakete
    this.currTimer = 0;
    //ako postoji DNA kao argument (nove generacije) onda stavi to kao novi vektor smjera, inače kreiraj novi random DNA i nadaj se da ćeš pogoditi cilj
    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }
    //resetiram vrijednost fitness za novu generaciju
    this.fitness = 0;
    //dodajem vrijednosti akceleracije ovisno o argumentu koji je sila koja pogurava ovu raketu
    this.applyForce = function (force) {
        this.acc.add(force);
    };
    //funkcija za kalkulaciju fitness vrijednosti rakete
    this.calcFitness = function (rewardConstant) {
        //računam udaljenost rakete od cilja
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        //mapiram/normaliziram vrijednosti za ovu raketu
        this.fitness = map(d, 0, width, width, 0);
        //ako raketa je dotakla cilj, pomnoži fitness vrijednost s vrijednošću sa slidera (korisnikov input - ako je veća vrijednost, veći je fitness, veće su šanse prenošenja gena)
        //ujedno i dijelim s vremenom stizanja do cilja, ali pošto je vrijednost rewarda puno veća nego vrijednost vremena, ima mali utjecaj na fitness score
        //osim u specifičnom slučaju kada postoje 2 "grupacije" raketa, jedna ide s lijeve a druga s desne strane.
        //tada se "natječu" koja će prije stići do cilja i tu vrijeme stizanja igra veliku ulogu jer obje grupacije imaju podjednaki fitness score.
        if (this.completed) {
            this.fitness *= (rewardConstant / this.currTimer);
        }
        // ako se raketa udre, smanji fitness vrijednost za vrijednost s rewardSlidera
        if (this.crashed) {
            this.fitness /= rewardConstant;
        }
    };
    //prati trenutno stanje rakete, je li leti, je li udrila ili je stigla na cilj
    this.update = function (rTime, barrierCheckValue) {
        //računam distancu od cilja
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        //budući da je cilj kružnica, gledam je li raketa stigla u radijus te kružnicee. ako je teleportiraj ju u centar kružnice do kraja životnog ciklusa
        //ujedno mijenjam vrijednost bool varijable da bi se fitness score povećao i spremam vrijeme dolaska do cilja
        if (d < 10) {
            this.completed = true;
            this.pos = target.copy();
            this.currTimer = rTime;
        }
        //je li raketa udrila u prepreku
        if (barrierCheckValue) {
            if (
                this.pos.x > rx &&
                this.pos.x < rx + rw &&
                this.pos.y > ry &&
                this.pos.y < ry + rh
            ) {
                this.crashed = true;
                this.currTimer = rTime;
            }
        }
        //je li raketa udrila u lijevi i desni rub ekrana
        if (this.pos.x > width || this.pos.x < 0) {
            this.crashed = true;
            this.currTimer = rTime;
        }
        // je li raketa udrila u gornji i donji rub ekrana
        if (this.pos.y > height || this.pos.y < 0) {
            this.crashed = true;
            this.currTimer = rTime;
        }
        //funkcija koja pravi akceleraciju iz sile, međutim dajemo joj argument koji ima random vektore u slučaju nulte generacije i vektore napravljene pomoću crossovera ako su nove generacije rakete
        this.applyForce(this.dna.genes[count]);
        //sve dok raketa nije udrila u cilj ili neku prepreku pravi update na toj raketi
        if (!this.completed && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            this.vel.limit(4);
        }
    };
    //služi sa prikaz i iscrtavanje rakete na ekranu
    this.show = function () {
        //push i pop su funkcije iz p5.js koje spremaju trenutnu verziju kanvasa i omoguću da promijenim (translatiram i rotiram) samo jedan objekt bez učinka na ostale objekte
        //samo radi toga mogu iscrtavati svaku raketu posebno
        push();
        //mijenjam boju rakete ovisno je li u zraku = bijelo, udrila u cilj = zeleno ili udrila u prepreku = crveno
        noStroke();
        if (this.completed) {
            fill(0, 255, 0);
        } else if (this.crashed) {
            fill(255, 0, 0);
        } else {
            fill(255, 100);
        }
        //translatiram cijeli kanvas na poziciju rakete
        translate(this.pos.x, this.pos.y);
        //rotiram kanvas u smjeru gdje raketa "putuje"
        rotate(this.vel.heading());
        //kreiram bazični trokut
        triangle(-10, 5, -10, -5, 10, 0);
        //i gasim transformacije i iscrtavanje za trenutnu raketu
        pop();
    };
}