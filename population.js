//ova klasa služi za inicijalizaciju, praćenje i evaluaciju trenutne populacije.
//tu ujedno pozivam funkcije za praćenje stanja raketa i promjenu DNA rakete.
function Population(popSliderValue) {
    // inicijaliziram array raketa
    this.rockets = [];
    // mijenjam količinu raketa
    this.popsize = popSliderValue;
    // inicijaliziram genski pool od roditelja koji imaju "među" najboljim fitness scorovima.
    //radi se na način da ako raketa ima viši score, ima veću šansu za ući u mating pool i obratno.
    this.matingpool = [];
    //koristi se jedino za slanje informacije o max fitness vrijednost u sketch.js za prikaz na ekran
    this.sendMaxFit = 0;
    // pravim novu raketu i stavljam je u array ovisno o količini polpulacije
    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i] = new Rocket();
    }
    //funkcija koja služi za izračun fitness vrijednosti rakete
    this.evaluate = function (reward) {
        //ovdje ću spremiti maximalni fitness
        var maxfit = 0;
        // idem kroz svaku raketu i računam njenu fitness vrijednost
        for (var i = 0; i < this.popsize; i++) {
            // pozivam funkciju koja će izračunati vrijednost fitnessa
            this.rockets[i].calcFitness(reward);
            // te ako je nova fitness vrijednost veća od neke prijašnje, spremam ju privremeno u varijablu maxfit
            if (this.rockets[i].fitness > maxfit) {
                maxfit = this.rockets[i].fitness;
            }
        }
        //spremam vrijednost maxfita u globalnu (za ovu klasu) varijablu da je pomoću druge funkcije mogu poslati na drugu stranu programa
        this.sendMaxFit = maxfit;
        // normaliziram fitness vrijednosti
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxfit;
        }
        //praznim "prošli" genski pool
        this.matingpool = [];
        // uzimam vrijednosti da budu između 1 i 100
        for (var i = 0; i < this.popsize; i++) {
            var n = this.rockets[i].fitness * 100;
            // ako je fitness bio veliki, imati će više vrijednosti u matingpool-u. to je Glavna pretpostavka evolucije. bolji fitness znači veća šansa za "reprodukciju".
            for (var j = 0; j < n; j++) {
                this.matingpool.push(this.rockets[i]);
            }
        }
    };
    //provjeravam uvjet ima li podatka uopće u maxfitu i ako ima, šaljem vrijednost da se prikaže na ekranu
    this.getFit = function () {
        if (typeof this.maxfit !== "undefined") {
        return this.sendMaxFit;
        }
        return 0;
    };
    // funkcija za selekciju "dobrih" gena za sljedeću generaciju
    this.selection = function () {
        //inicijaliziram array za novu generaciju
        var newRockets = [];
        for (var i = 0; i < this.rockets.length; i++) {
            // uzimam nasumično vrijednosti iz matingpoola. tu dolazi ono da što je veći fitness, ima više svojih vrijednosti zapisanih u matingpool, što znači da će imati više šanse za prenijeti svoje gene
            var parentA = random(this.matingpool).dna;
            var parentB = random(this.matingpool).dna;
            // uzme gene od 2 roditelja te radim križanje gena ovisno o "midpointu", prva polovica će bit geni od jednog roditelja, druga polovica od drugog.
            var child = parentA.crossover(parentB);
            //uvodim mogućnost mutacije za novonastalo dijete raketu
            child.mutation();
            // novonastalo dijeteRaketu spremam u array novih raketa
            newRockets[i] = new Rocket(child);
        }
        // te onda povećanjem generacije dijeteraketa postane odrasla raketa
        this.rockets = newRockets;
    };
    // prati stanje i iscrtava trenutnu generaciju raketa na ekranu
    this.run = function (rTime, bCV) {
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].update(rTime, bCV);
            this.rockets[i].show();
        }
    };
}