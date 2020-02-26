import React, {Component} from 'react';
import '../Home/Home.css'


export default class Juego extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        baraja: [],
        repartidor: null,
        jugador: null,
        cartera: 0,
        inputValue: '',
        apuestaActual: null,
        perdiste: false,
        mensaje: null
      };
    }
  
    generarBaraja() {
      const cartas = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
      const palos = ['♦','♣','♥','♠'];
      const baraja = [];
      for (let i = 0; i < cartas.length; i++) {
        for (let j = 0; j < palos.length; j++) {
          baraja.push({numero: cartas[i], palo: palos[j]});
        }
      }
      return baraja;
    }
    
    repartoCarta(baraja) {
      const jugadorCarta1 = this.traerTarjetaAleatorio(baraja);
      const repartoCarta1 = this.traerTarjetaAleatorio(jugadorCarta1.actualizarMazo);
      const jugadorCarta2 = this.traerTarjetaAleatorio(repartoCarta1.actualizarMazo);    
      const manoInicialJugador = [jugadorCarta1.tarjetaAzar, jugadorCarta2.tarjetaAzar];
      const repartoInicioMano = [repartoCarta1.tarjetaAzar, {}];
      
      const jugador = {
        cartas: manoInicialJugador,
        contar: this.obtenerCuenta(manoInicialJugador)
      };
      const repartidor = {
        cartas: repartoInicioMano,
        contar: this.obtenerCuenta(repartoInicioMano)
      };
      
      return {actualizarMazo: jugadorCarta2.actualizarMazo, jugador, repartidor};
    }
  
    inicioNuevoJuego(tipo) {
      if (tipo === 'continuar') {
        if (this.state.cartera > 0) {
          const baraja = (this.state.baraja.length < 10) ? this.generarBaraja() : this.state.baraja;
          const { actualizarMazo, jugador, repartidor } = this.repartoCarta(baraja);
  
          this.setState({
            baraja: actualizarMazo,
            repartidor,
            jugador,
            apuestaActual: null,
            perdiste: false,
            mensaje: null
          });
        } else {
          this.setState({ mensaje: '¡Juego terminado! Estás en quiebra! Por favor comienza un nuevo juego.' });
        }
      } else {
        const baraja = this.generarBaraja();
        const { actualizarMazo, jugador, repartidor } = this.repartoCarta(baraja);
  
        this.setState({
          baraja: actualizarMazo,
          repartidor,
          jugador,
          cartera: 100,
          inputValue: '',
          apuestaActual: null,
          perdiste: false,
          mensaje: null
        });
      }
    }
         
    traerTarjetaAleatorio(baraja) {
      const actualizarMazo = baraja;
      const indiceAleatorio = Math.floor(Math.random() * actualizarMazo.length);
      const tarjetaAzar = actualizarMazo[indiceAleatorio];
      actualizarMazo.splice(indiceAleatorio, 1);
      return { tarjetaAzar, actualizarMazo };
    }
    
    apuestaLugar() {
      const apuestaActual = this.state.inputValue;
  
      if (apuestaActual > this.state.cartera) {
        this.setState({ mensaje: 'Fondos insuficientes para apostar esa cantidad.' });
      } else if (apuestaActual % 1 !== 0) {
        this.setState({ mensaje: 'Por favor apueste solo números enteros.' });
      } else {
        // Deduct current bet from cartera
        const cartera = this.state.cartera - apuestaActual;
        this.setState({ cartera, inputValue: '', apuestaActual });
      }
    }
    
    pasar() {
      if (!this.state.perdiste) {
        if (this.state.apuestaActual) {
          const { tarjetaAzar, actualizarMazo } = this.traerTarjetaAleatorio(this.state.baraja);
          const jugador = this.state.jugador;
          jugador.cartas.push(tarjetaAzar);
          jugador.contar = this.obtenerCuenta(jugador.cartas);
  
          if (jugador.contar > 21) {
            this.setState({ jugador, perdiste: true, mensaje: 'Perdiste' });
          } else {
            this.setState({ baraja: actualizarMazo, jugador });
          }
        } else {
          this.setState({ mensaje: 'apostar' });
        }
      } else {
        this.setState({ mensaje: 'Juego terminado' });
      }
    }
    
    dibujarPartidor(repartidor, baraja) {
      const { tarjetaAzar, actualizarMazo } = this.traerTarjetaAleatorio(baraja);
      repartidor.cartas.push(tarjetaAzar);
      repartidor.contar = this.obtenerCuenta(repartidor.cartas);
      return { repartidor, actualizarMazo };
    }
    
    obtenerCuenta(cartas) {
      const reorganizado = [];
      cartas.forEach(carta => {
        if (carta.numero === 'A') {
          reorganizado.push(carta);
        } else if (carta.numero) {
          reorganizado.unshift(carta);
        }
        
      });
      
      return reorganizado.reduce((total, carta) => {
        if (carta.numero === 'J' || carta.numero === 'Q' || carta.numero === 'K') {
          return total + 10;
        } else if (carta.numero === 'A') {
          return (total + 11 <= 21) ? total + 11 : total + 1;
        } else {
          return total + carta.numero;
        }
      }, 0);
    }
    
    pedirCarta() {
      if (!this.state.perdiste) {
        const tarjetaAzar = this.traerTarjetaAleatorio(this.state.baraja);
        let baraja = tarjetaAzar.actualizarMazo;
        let repartidor = this.state.repartidor;
        repartidor.cartas.pop();
        repartidor.cartas.push(tarjetaAzar.tarjetaAzar);
        repartidor.contar = this.obtenerCuenta(repartidor.cartas);
  
        while(repartidor.contar < 17) {
          const dibujar = this.dibujarPartidor(repartidor, baraja);
          repartidor = dibujar.repartidor;
          baraja = dibujar.actualizarMazo;
        }
  
        if (repartidor.contar > 21) {
          this.setState({
            baraja,
            repartidor,
            cartera: this.state.cartera + this.state.apuestaActual * 2,
            perdiste: true,
            mensaje: 'Buena Partida! Ganaste!'
          });
        } else {
          const ganador = this.obtenederGanador(repartidor, this.state.jugador);
          let cartera = this.state.cartera;
          let mensaje;
          
          if (ganador === 'repartidor') {
            mensaje = 'Repartidor gana ....';
          } else if (ganador === 'jugador') {
            cartera += this.state.apuestaActual * 2;
            mensaje = 'Ganaste!';
          } else {
            cartera += this.state.apuestaActual;
            mensaje = 'Empujar.';
          }
          
          this.setState({
            baraja, 
            repartidor,
            cartera,
            perdiste: true,
            mensaje
          });
        } 
      } else {
        this.setState({ mensaje: '¡Juego terminado! Por favor comienza un nuevo juego.' });
      }
    }
    
    obtenederGanador(repartidor, jugador) {
      if (repartidor.contar > jugador.contar) {
        return 'repartidor';
      } else if (repartidor.contar < jugador.contar) {
        return 'jugador';
      } else {
        return 'Empujar';
      }
    }
    
    cambioValor(e) {
      const inputValue = +e.target.value;
      this.setState({inputValue});
    }
    
    handleKeyDown(e) {
      const enter = 13;
      console.log(e.keyCode);
      
      if (e.keyCode === enter) {
        this.apuestaLugar();
      }
    }
    
    componentWillMount() {
      this.inicioNuevoJuego();
      const body = document.querySelector('body');
      body.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    render() {
      let dealerCount;
      const carta1 = this.state.repartidor.cartas[0].numero;
      const carta2 = this.state.repartidor.cartas[1].numero;
      if (carta2) {
        dealerCount = this.state.repartidor.contar;
      } else {
        if (carta1 === 'J' || carta1 === 'Q' || carta1 === 'K') {
          dealerCount = 10;
        } else if (carta1 === 'A') {
          dealerCount = 11;
        } else {
          dealerCount = carta1;
        }
      }
  
      return (
        <div>
            <h1>BlackJack</h1>
            
          <div className="buttons">
            <button onClick={() => {this.inicioNuevoJuego()}}>Nuevo Juego</button>
            <button onClick={() => {this.pasar()}}>Pasar</button>
            <button onClick={() => {this.pedirCarta()}}>Carta Nueva</button>
          </div>
          
          <p>Banco: ${ this.state.cartera }</p>
          {
            !this.state.apuestaActual ? 
            <div className="input-bet">            
              <form>
                <input type="text" name="bet" placeholder="" value={this.state.inputValue} onChange={this.cambioValor.bind(this)}/>
              </form>
              <button onClick={() => {this.apuestaLugar()}}>Apuesta</button>
            </div>
            : null
          }
          {
            this.state.perdiste ?
            <div className="buttons">
              <button onClick={() => {this.inicioNuevoJuego('continuar')}}>Continuar</button>
            </div>
            : null
          }
          <p>Mano ({ this.state.jugador.contar })</p>
          <table className="cards">
            <tr>
              { this.state.jugador.cartas.map((carta, i) => {
                return <Card key={i} numero={carta.numero} palo={carta.palo}/>
              }) }
            </tr>
          </table>
          
          <p>Mano Adversario ({ this.state.repartidor.contar })</p>
          <table className="cards">
            <tr>
              { this.state.repartidor.cartas.map((carta, i) => {
                return <Card key={i} numero={carta.numero} palo={carta.palo}/>;
              }) }
            </tr>
          </table>
          
          <p>{ this.state.mensaje }</p>
        </div>
      );
    }
  };
  
  const Card = ({ numero, palo }) => {
    const combo = (numero) ? `${numero}${palo}` : null;
    const color = (palo === '♦' || palo === '♥') ? 'card-red' : 'card';
    
    return (
      <td>
        <div className={color}>
          { combo }
        </div>
      </td>
    );
  };
  