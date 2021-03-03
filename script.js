const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULTIMO_NIVEL = 2

class Juego {
    constructor() {
        this.inicializar()
        this.generarSecuencia()
        setTimeout(this.siguienteNivel,500)
        
    } /* Similar a como declaramos propiedades, solo que son metodos heredables */

    inicializar() {
        this.siguienteNivel = this.siguienteNivel.bind(this) //Amarramos para que siempres se ate al juego y no cambie el contexto
        this.elegirColor = this.elegirColor.bind(this) /* Asi lo podemos poner directamente para ahorrarnos 'amarrar' este metodo en el event listener */
        this.toggleBtnEmpezar()
        /* btnEmpezar.classList.add('hide')  */
        this.nivel = 1
        this.colores = {
            celeste, 
            violeta, 
            naranja, 
            verde
        }
    }

    toggleBtnEmpezar(){
        if(btnEmpezar.classList.contains('hide')){
            btnEmpezar.classList.remove('hide')
        } else {
            btnEmpezar.classList.add('hide')
        }
    }

    generarSecuencia() {
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
        /* El new array es un constructor, y definimos que queremos que tenga 10 elementos */
    }

    siguienteNivel() {
        this.subnivel = 0
        this.iluminarSecuencia()
        this.agregarEventosClick()
    }

    transformarNumeroAColor(num){
        switch(num){
            case 0:
                return 'celeste' //No hace falta poner break porque no se ejecuta por el return
            case 1:
                return 'violeta'
            case 2:
                return 'naranja'
            case 3:
                return 'verde'
        }
    }

    transformarColorANumero(color){
        switch(color){
            case 'celeste':
                return 0 //No hace falta poner break porque no se ejecuta por el return
            case 'violeta':
                return 1
            case 'naranja':
                return 2
            case 'verde':
                return 3
        }
    }

    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++){
            const color = this. transformarNumeroAColor(this.secuencia[i]) /* Es crucial que sea const en vez de var para que funcione en un ciclo for*/
            setTimeout(() => this.iluminarColor(color), 1000 * i)
            
        }
    }

    iluminarColor(color){
        this.colores[color].classList.add('light')
        setTimeout(() => this.apagarColor(color), 350);
    }

    apagarColor(color){
        this.colores[color].classList.remove('light')
    }

    agregarEventosClick(){
        this.colores.celeste.addEventListener('click', this.elegirColor)
        this.colores.verde.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
    } //El bind sirve para 'amarrar' el listener a nuestro objeto general, y que no pierda el contexto, es como decir this al this

    eliminarEventosClick(){
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
    }

    elegirColor(e){
        //var example = e.target //Aqui tenemos perdido el contexto, obtendremos el boton que pulsamos pero no obtendremos el contexto del juego
        const nombreColor = e.target.dataset.color
        const numeroColor  = this.transformarColorANumero(nombreColor)
        this.iluminarColor(nombreColor)
        if (numeroColor === this.secuencia[this.subnivel]){
            this.subnivel++
            if (this.subnivel === this.nivel) {
                this.nivel++
                this.eliminarEventosClick()
                if (this.nivel === (ULTIMO_NIVEL + 1)) {
                    this.ganoElJuego()
                } else {
                    setTimeout(this.siguienteNivel,1500)
                }
            }
        } else {
            this.perdioElJuego()
        }
    }

    ganoElJuego() {
        swal('Simon Dice', 'Ganaste', 'success').then(this.inicializar.bind(this))
    }

    perdioElJuego(){
        swal('Simon Dice', 'Perdiste', 'error').then(() => {
            this.eliminarEventosClick()
            this.inicializar()
        })
    }
}

function empezarJuego() {
    window.juego = new Juego() //Lo pasamos a window para poder consultarlo directamente con nuestra consola
}