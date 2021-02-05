class Vista{
    constructor(arrayNotas,nota,contenedor){//arrayNotas=notas.listaNotas , nota=notaActual de la funcion anadirNota
        //, contenedor=contenedor del main
        this.arrayNotas=arrayNotas;
        this.nota=nota;
        this.contenedor=contenedor;
        this.section=document.createElement("section");
        this.section.id=arrayNotas.length-1;
        this.input=document.createElement("input");
        this.contenidoTextArea=document.createElement("textarea");
        this.parrafoFecha=document.createElement("p");
        this.botonEditar=document.createElement("button");
        this.botonBorrar=document.createElement("button");
    }
    colocarNotas1(){//Horizontalmente
        if(x>this.contenedor.getBoundingClientRect().width-160){
            x=20;
            y+=180;
        }
        this.section.style.left=x+"px";
        this.section.style.top=y+"px";
        x+=160;
    }
    colocarNotas2(){//Verticalmente
        if(y>1000){
            y=document.querySelector("header").getBoundingClientRect().height+20;
            x+=160;
        }
        this.section.style.left=x+"px";
        this.section.style.top=y+"px";
        y+=180;
    }
    disposicionInternaNotas(){//appendChild
        this.section.appendChild(this.input);
        this.input.type="text";
        this.input.value=this.nota.titulo;
        this.contenidoTextArea.appendChild(document.createTextNode(this.nota.contenido));
        this.section.appendChild(this.contenidoTextArea);
        this.parrafoFecha.appendChild(document.createTextNode("Hace "+Math.floor((Date.now()-parseInt(this.nota.fecha))/1000/60)+" minutos"));
        //resto a la fecha actual la fecha de la nota, cambiada a entero, entre 1000 para segundos y 
        //entre 60 para segundos. Por último redondeo a la baja
        this.section.appendChild(this.parrafoFecha);
        this.botonEditar.appendChild(document.createTextNode("Actualizar"));
        this.section.appendChild(this.botonEditar);
        this.botonBorrar.appendChild(document.createTextNode("Borrar"));
        this.section.appendChild(this.botonBorrar);
        this.contenedor.appendChild(this.section);
    }
    eventoBorrar(){
        this.section.remove();
    }
    
}

var titulo,contenido,fecha,contenedor,notaEnMovimiento,vistaNotas;
var pulsacion=false;
var notas={"listaNotas":[]};    //Array JSON vacio
var x=20;
var y;
var estilo;

window.onload=()=>{
    var boton=document.getElementById("botonAnadir");
    boton.addEventListener("click",anadirNota);

    contenedor=document.getElementById("tablero");
    
    //Para recibir el estilo guardado
    if(JSON.parse(localStorage.getItem("estiloJSON"))==null)
        estilo=false;
    else
        estilo=JSON.parse(localStorage.getItem("estiloJSON"));
    //////////
    y=document.querySelector("header").getBoundingClientRect().height+20;
    recibirJSON();
    
    window.addEventListener("mousemove",moverNota);
    document.getElementById("cambiarEstilo").addEventListener("click",()=>{
        contenedor.innerHTML="";
        estilo=!estilo;
        localStorage.setItem("estiloJSON",JSON.stringify(estilo));
        x=20;
        y=document.querySelector("header").getBoundingClientRect().height+20;
        
        recorrerNotas(notas.listaNotas);
        
    });
}

function eventosNotas(vistaNotas,nota){
    
    //Evento editar
    vistaNotas.botonEditar.addEventListener("click",()=>{
        nota.titulo=vistaNotas.input.value;
        nota.contenido=vistaNotas.contenidoTextArea.value;
        localStorage.setItem("listaNotas",JSON.stringify(notas.listaNotas));
    })

    //Evento borrar
    vistaNotas.botonBorrar.addEventListener("click",()=>{
        notas.listaNotas.splice(vistaNotas.section.id,1);
        
        vistaNotas.eventoBorrar();

        localStorage.setItem("listaNotas",JSON.stringify(notas.listaNotas));
    })
}

function anadirNota(){
    //Obtener datos
    titulo=document.getElementById("titulo").value;
    contenido=document.getElementById("textarea").value;
    fecha=Date.now();//al guardarlo en JSON se queda como string de milisegundos

    //Crear array con JSON
    notas.listaNotas.push({"titulo":titulo,"contenido":contenido,"fecha":fecha});

    let notaActual=notas.listaNotas[notas.listaNotas.length-1];
    //.length es la nota actual que hay, -1 porque al haber 1 nota es en el indice cero

    //Montar vista
    if(estilo){
        vistaNotas=new Vista(notas.listaNotas,notaActual,contenedor);
        vistaNotas.disposicionInternaNotas();
        vistaNotas.colocarNotas2();
    }else{
        vistaNotas=new Vista(notas.listaNotas,notaActual,contenedor);
        vistaNotas.disposicionInternaNotas();
        vistaNotas.colocarNotas1();
    }

    eventosNotas(vistaNotas,notaActual);

    vistaNotas.section.addEventListener("click",pulsarNota);
        
    limpiar();
    localStorage.setItem("listaNotas",JSON.stringify(notas.listaNotas));
}

function limpiar(){
    document.getElementById("titulo").value="";
    document.getElementById("textarea").value="";
}

function recibirJSON(){
    let notasJSON=JSON.parse(localStorage.getItem("listaNotas"));
    if(JSON.parse(localStorage.getItem("listaNotas"))!=null){
        notas.listaNotas=notasJSON;
        recorrerNotas(notas.listaNotas);
    }
}

function recorrerNotas(array){
    for(let i=0; i<array.length; i++){
        //Montar vista
        if(estilo){
            vistaNotas=new Vista(notas.listaNotas,array[i],contenedor);
            vistaNotas.disposicionInternaNotas();
            vistaNotas.colocarNotas2();
        }else{
            vistaNotas=new Vista(notas.listaNotas,array[i],contenedor);
            vistaNotas.disposicionInternaNotas();
            vistaNotas.colocarNotas1();
        }

        eventosNotas(vistaNotas,array[i]);
        vistaNotas.section.addEventListener("click",pulsarNota);
    }
}

//Eventos notas

function pulsarNota(e){
    if(e.target.localName=="section"){
        pulsacion=!pulsacion;
        notaEnMovimiento=e.currentTarget;
    }else
        e.stopPropagation();
}

function moverNota(ee){
    let tamanoContenedor = contenedor.getBoundingClientRect();
    if(document.querySelector('section')!=null){
        let tamanoSection = document.querySelector('section').getBoundingClientRect();
        if(pulsacion){
            if(ee.y > tamanoContenedor.y && ee.x < tamanoContenedor.width-tamanoSection.width){
                notaEnMovimiento.style.left = ee.x+"px";//si tuviera margin, se lo restaría aquí
                notaEnMovimiento.style.top = ee.y+"px";
            }
        }
    }
}
