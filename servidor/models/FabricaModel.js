const Palo = require('./PaloModel.js');
const Carta = require('./CartaModel.js');

module.exports = class Fabrica {
    
    constructor(){
        this.mazoMesclaso = [];
        this.mazo = [];
        this.palo = [new Palo("♥"), new Palo("♦"), new Palo("♣"), new Palo("♠")];
        this.rotulas = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    }
    
    crear(){
        
        this.palo.forEach(element => {
            this.rotulas.forEach(element2 => {
                if(this.element2 == "A"){
                    var valor = [1,11]
                }  
                
                let carta = new Carta(element2,element, valor, "corazones");  
                this.mazo.push(carta);
            
            })  
        })
        
        this.mazoMesclaso.push(this.mazo)
        
        return this.mazo
        
        
    }
    
    mezclar(){
        
        return this.mazoMesclaso
    }
    
}