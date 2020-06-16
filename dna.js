//DNA klasa služi za miješanje gena i uvođenje mutacije u postojeće gene od child rakete.
function DNA(genes) {
    // ako već postoje geni (od prijašnje generacije), uzmi te gene i spremi ih u genes varijablu
    if (genes) {
        this.genes = genes;
    }
    // inače kreiraj random gene (nulta generacija)
    else {
        this.genes = [];
        for (var i = 0; i < lifespan; i++) {
            //dajem random vektore za svaku raketu na kojoj će se nalaziti svaki frame. ovo simulira (de)akceleraciju i skretanje s kursa
            this.genes[i] = p5.Vector.random2D();
            //brzina kojom će se kretati rakete
            this.genes[i].setMag(maxforce);
        }
    }
    //funkcija koja križa gene dvaju roditelja ovisno o središnjoj točki
    this.crossover = function (partner) {
        var newgenes = [];
        //da ne bi uvijek bilo točno na pola, središnju točku uzimam kao nasumičnu vrijednost cijelog arraya
        var mid = floor(random(this.genes.length));
        for (var i = 0; i < this.genes.length; i++) {
            //prva polovica uzima gene od jednog roditelja
            if (i > mid) {
                newgenes[i] = this.genes[i];
            }
            // druga polovica uzima gene od drugog roditelja
            else {
                newgenes[i] = partner.genes[i];
            }
        }
        //Ovim dajem već postojeće gene u DNA objekt, tj. pravi se sljedeća generacija ovisno o postojećim genima. ne rade se novi nasumični geni
        return new DNA(newgenes);
    };
    //uvodi "mutaciju" u postojeću gensku strukturu rakete
    this.mutation = function () {
        //za cijeli array, postoji 1% šansa da će se ubaciti novi vektor smjera s istom brzinom
        //može se mijenjati ali ne preko slidera
        for (var i = 0; i < this.genes.length; i++) {
            if (random(1) < 0.01) {
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(maxforce);
            }
        }
    };
}