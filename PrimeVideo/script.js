let Banner = document.getElementById("banner")

let filmA1= document.getElementById("filmA1")
let filmA2= document.getElementById("filmA2")
let filmA3= document.getElementById("filmA3")
let filmA4= document.getElementById("filmA4")
let filmA5= document.getElementById("filmA5")

let filmB1= document.getElementById("filmB1")
let filmB2= document.getElementById("filmB2")
let filmB3= document.getElementById("filmB3")
let filmB4= document.getElementById("filmB4")
let filmB5= document.getElementById("filmB5")

let filmC1= document.getElementById("filmC1")
let filmC2= document.getElementById("filmC2")
let filmC3= document.getElementById("filmC3")
let filmC4= document.getElementById("filmC4")
let filmC5= document.getElementById("filmC5")

let filmD1= document.getElementById("filmD1")
let filmD2= document.getElementById("filmD2")
let filmD3= document.getElementById("filmD3")
let filmD4= document.getElementById("filmD4")
let filmD5= document.getElementById("filmD5")

let filmE1= document.getElementById("filmE1")
let filmE2= document.getElementById("filmE2")
let filmE3= document.getElementById("filmE3")
let filmE4= document.getElementById("filmE4")
let filmE5= document.getElementById("filmE5")

let Rep=document.querySelector(".film")



filmA1.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">El hombre de acero</h2><p>El Hombre de Acero es un reinicio de la franquicia de Superman que narra la historia de origen del icónico superhéroe. Clark Kent, un extraterrestre con poderes sobrehumanos, debe enfrentar a su némesis, el general Zod, para proteger a la humanidad y convertirse en el símbolo de esperanza conocido como Superman. La película combina acción, efectos visuales impresionantes y una narrativa emocional para explorar los orígenes y el papel del héroe.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmA1.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
    
})
//A2
filmA2.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">El señor de los Anilos: El retorno del rey</h2><p>El Retorno del Rey es la tercera entrega de la trilogía "El Señor de los Anillos". La trama sigue la lucha final de Frodo y Sam para destruir el Anillo Único en Mordor. Mientras tanto, Aragorn asume su destino como rey de Gondor y lidera una gran batalla contra Sauron. Con la ayuda de sus aliados, incluidos los elfos y los enanos, logran la victoria y Frodo finalmente logra destruir el Anillo. La película culmina con la restauración de la paz en la Tierra Media y la despedida de los personajes principales.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmA2.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//A3
filmA3.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Avengers: Endgame</h2><p>"Avengers: Endgame" es la culminación épica del Universo Cinematográfico de Marvel. Después de la devastación causada por Thanos, los Vengadores restantes buscan una manera de revertir sus acciones y traer de vuelta a los caídos. A través de un viaje en el tiempo, se reúnen con aliados pasados y enfrentan a Thanos una vez más en una batalla final. Tony Stark, el Hombre de Hierro, sacrifica su vida para derrotar a Thanos y salvar el universo. Los Vengadores sobrevivientes regresan y honran a los caídos, estableciendo un nuevo futuro para el equipo.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmA3.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//A4
filmA4.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Avatar: El sentido del agua</h2><p>Jake Sully y Neytiri han formado una familia y hacen todo lo posible por permanecer juntos. Sin embargo, deben abandonar su hogar y explorar las regiones de Pandora cuando una antigua amenaza reaparece.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmA4.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//A5
filmA5.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Super Mario Bros: La Pelicula</h2><p>Un fontanero llamado Mario viaja por un laberinto subterráneo con su hermano, Luigi, intentando salvar a una princesa capturada.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmA5.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//B1
filmB1.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">John Wick: Capitulo 4</h2><p>Una exploración de las aventuras, las desgarradoras experiencias y las hazañas del legendario asesino a sueldo, John Wick.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmB1.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//B2
filmB2.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Casino Royale</h2><p>"Casino Royale" es la primera película de Daniel Craig como James Bond. La trama sigue al agente 007 mientras se enfrenta a Le Chiffre, un banquero terrorista. Bond participa en un juego de póquer de alto riesgo para frustrar los planes de Le Chiffre y desmantelar su organización. A medida que se desarrolla el juego, Bond se involucra con Vesper Lynd, una agente británica. Sin embargo, descubre que Vesper está involucrada con el enemigo, lo que lo lleva a una traición dolorosa. La película termina con Bond superando la traición y persiguiendo su misión como agente secreto.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmB2.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//B3
filmB3.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Terminator: El dia del jucio final</h2><p>En "Terminator 2: Judgment Day", un avanzado Terminator, el T-800, es enviado desde el futuro para proteger a John Connor, el futuro líder de la resistencia humana. Sarah Connor, la madre de John, también se encuentra en la lucha contra los cyborgs asesinos. Sin embargo, un T-1000, un Terminator líquido y letal, también es enviado para eliminar a John. A medida que la persecución se intensifica, Sarah, John y el T-800 forman una improbable alianza para detener al T-1000 y cambiar el futuro. La película culmina con un enfrentamiento emocionante en una fundición y la destrucción del chip de la tecnología Terminator, asegurando un futuro más esperanzador.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmB3.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//B4
filmB4.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">El Caballero oscuro</h2><p>En "El Caballero Oscuro", Batman se enfrenta a su enemigo más despiadado, el Joker, quien sembró el caos en Gotham City. El Joker desata una ola de crímenes y manipula a los ciudadanos para que tomen decisiones moralmente ambiguas. Batman se ve obligado a hacer alianzas inusuales, como trabajar con el fiscal Harvey Dent. A medida que la ciudad se sumerge en el caos, Batman se enfrenta a dilemas éticos y pone en juego su identidad secreta. La película culmina con la muerte de Dent y la decisión de Batman de asumir la culpa por sus acciones, llevando a la persecución de los ciudadanos hacia él y dejando a Gotham en un estado de incertidumbre.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmB4.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//B5
filmB5.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Los Simpson: La pelicula</h2><p>En "Los Simpson: la película", la ciudad de Springfield se enfrenta a una crisis ambiental cuando el irresponsable Homero Simpson contamina el lago local. El gobierno decide cubrir la ciudad con una cúpula gigante. Mientras tanto, la familia Simpson se ve envuelta en una serie de desventuras, incluyendo la huida de una mafia de Springfield y el intento de Homero de salvar su matrimonio con Marge. Finalmente, Homero se da cuenta de su error y lidera a la ciudad en un esfuerzo para destruir la cúpula y salvar Springfield. La película concluye con la ciudad recuperando su libertad y la familia Simpson reunida.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmB5.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//C1
filmC1.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">The Boys</h2><p>"The Boys" es una serie de superhéroes con un enfoque oscuro y subversivo. En un mundo donde los superhéroes son comercializados y corruptos, un grupo de individuos llamado "The Boys" se unen para exponer la verdad y hacer justicia. Liderados por Billy Butcher, persiguen a "Los Siete", el equipo de superhéroes más poderoso y corrupto. Con un equilibrio entre violencia, humor negro y crítica social, "The Boys" revela la corrupción y el poder desmedido de los superhéroes, cuestionando la idea tradicional de los íconos de la justicia y el heroísmo. A medida que avanza la trama, los personajes enfrentan peligros y desafíos mientras luchan por proteger a la humanidad de la amenaza de los superhéroes.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmC1.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//C2
filmC2.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Breaking Bad</h2><p>"Breaking Bad" sigue la historia de Walter White, un profesor de química que se convierte en un fabricante de metanfetamina después de ser diagnosticado con cáncer. Junto con su antiguo estudiante, Jesse Pinkman, se adentran en el mundo del narcotráfico. A medida que Walter se sumerge más en el crimen, se transforma en el poderoso y temido Heisenberg. A lo largo de la serie, enfrentan peligrosos rivales, incluido el narcotraficante mexicano Gus Fring, y se ven envueltos en una red de mentiras y violencia. La serie explora la degradación moral de Walter y cómo su búsqueda de poder y dinero afecta su vida y la de sus seres queridos.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmC2.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//C3
filmC3.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Chernobil</h2><p>Miniserie de televisión de drama histórico creada por Craig Mazin y dirigida por Johan Renck. La serie gira en torno al desastre nuclear de Chernóbil de abril de 1986 y los esfuerzos de limpieza sin precedentes que siguieron. Cuenta con un reparto encabezado por Jared Harris, Stellan Skarsgård y Emily Watson.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmC3.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//C4
filmC4.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Peaky Blinders</h2><p>"Peaky Blinders" es una serie ambientada en Birmingham, Inglaterra, después de la Primera Guerra Mundial. La historia sigue a la familia Shelby, liderada por Tommy Shelby, quien dirige una pandilla criminal llamada los Peaky Blinders. Tommy y sus hermanos se enfrentan a rivales y autoridades mientras buscan expandir su imperio del crimen. La serie presenta intriga política, relaciones complicadas y violencia despiadada. Tommy se enfrenta a enemigos poderosos, como la inspectora Grace Burgess y el líder de la mafia italiana, Luca Changretta. Con ingenio y astucia, los Peaky Blinders luchan por mantener su dominio y enfrentar su pasado turbulento.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmC4.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//C5
filmC5.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">La que se Avecina</h2><p>"La que se avecina" es una comedia de televisión española que sigue las divertidas y caóticas situaciones de un grupo de vecinos en un complejo residencial llamado Mirador de Montepinar. A lo largo de la serie, se presentan conflictos, enredos y malentendidos, generando situaciones cómicas y momentos hilarantes. Cada episodio muestra las vivencias y ocurrencias de estos peculiares personajes en su vida diaria.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmC5.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//D1
filmD1.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">The big bang theory</h2><p>La serie comienza con la llegada de Penny, aspirante a actriz, al apartamento vecino del que comparten Sheldon y Leonard, dos físicos que trabajan en el Instituto Tecnológico de California (Caltech). Leonard se enamora desde el primer momento de Penny.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmD1.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//D2
filmD2.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Friends</h2><p>La historia da inicio en un café de Nueva York, Central Perk, en el cual se encuentran los personajes: Monica Geller, Chandler Bing, Phoebe Buffay y Joey Tribbiani; donde también se incorporan con el paso de los minutos Ross Geller y por último Rachel Green.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmD2.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//D3
filmD3.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">El Pueblo</h2><p>La serie trata de un grupo de gente de ciudad que decide dejarlo todo atrás y mudarse a un ficticio pueblo de Soria llamado Peñafría (pedanía imaginaria perteneciente a San Pedro Manrique), aparentemente abandonado. Al llegar, pronto descubren que el pueblo sí tiene habitantes, quienes les ayudarán a adaptarse a la vida en el pueblo</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmD3.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//D4
filmD4.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Modern Family</h2><p>La serie narra la vida de Jay Pritchett y su familia, todos vecinos del mismo barrio a las afueras de Los Ángeles, y gira en torno a tres tipos de familia: nuclear, extendida y con padres del mismo sexo y está basada en situaciones cómicas que podrían ocurrirle a cualquiera en la vida real.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmD4.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//D5
filmD5.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Los Simpson</h2><p>La ciudad de Springfield está de limpieza y el ayuntamiento prohíbe el vertido de desperdicios en el altamente contaminado lago. Por esta razón, Homer aprovecha para deshacerse de los excrementos de su nueva mascota, un cerdo, provocando un desastre de tal magnitud que amenaza con la destrucción de la ciudad y que ha separado a Los Simpson del resto de sus vecinos.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmD5.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//E1
filmE1.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Coco</h2><p>Miguel es un niño que sueña con ser músico, pero su familia se lo prohíbe porque su tatarabuelo, músico, los abandonó, y quieren obligar a Miguel a ser zapatero, como todos los miembros de la familia. Por accidente, Miguel entra en la Tierra de los Muertos, de donde sólo podrá salir si un familiar difunto le concede su bendición, pero su tatarabuela se niega a dejarlo volver con los vivos si no promete que no será músico.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmE1.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//E2
filmE2.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Shrek</h2><p>Hace mucho tiempo, en una lejana ciénaga, vivía un ogro llamado Shrek. Un día, su preciada soledad se ve interrumpida por un montón de personajes de cuento de hadas que invaden su casa. Todos fueron desterrados de su reino por el malvado Lord Farquaad. Decidido a devolverles su reino y recuperar la soledad de su ciénaga, Shrek llega a un acuerdo con Lord Farquaad y va a rescatar a la princesa Fiona, la futura esposa del rey. Sin embargo, la princesa esconde un oscuro secreto.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmE2.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//E3
filmE3.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Toy Story 4</h2><p>Woody siempre ha tenido claro cuál es su labor en el mundo y cuál es su prioridad: cuidar a su dueño, ya sea Andy o Bonnie. Sin embargo, Woody descubrirá lo grande que puede ser el mundo para un juguete cuando Forky se convierta en su nuevo compañero de habitación. Los juguetes se embarcarán en una aventura de la que no se olvidarán jamás.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmE3.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//E4
filmE4.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Buscando a Dory</h2><p>Con la ayuda de Marlin y su hijo Nemo, Dory, que sufre pérdidas de memoria a corto plazo, decide emprender un largo viaje en busca de sus padres, a los que perdió hace años.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmE4.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})
//E5
filmE5.addEventListener("mouseover", function(){
    Banner.style.animationPlayState="paused"
    Banner.className="banner-paused"
    Banner.innerHTML='<h2 class="text-banner">Phineas y Ferb</h2><p>Phineas y Ferb son dos hermanastros que quieren disfrutar al máximo de las vacaciones de verano. No dejan de hacer trastadas y de inventar instrumentos imposibles como un monopatín gigante para sufrimiento de su hermana mayor Candice, que no les aguanta.</p>'
    console.log("Quiting")
    Banner.style.backgroundColor="rgb(0,0,0)"
})
filmE5.addEventListener("mouseleave",function(){
    Banner.style.animationPlayState="running"
    Banner.innerHTML=""
    Banner.className="banner"
})

