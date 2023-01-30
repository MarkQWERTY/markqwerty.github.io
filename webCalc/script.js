let n1=document.getElementById("1")
let n2=document.getElementById("2")
let n3=document.getElementById("3")
let n4=document.getElementById("4")
let n5=document.getElementById("5")
let n6=document.getElementById("6")
let n7=document.getElementById("7")
let n8=document.getElementById("8")
let n9=document.getElementById("9")
let n0=document.getElementById("0")

let suma= document.getElementById("SUMA")
let resta=document.getElementById("RESTA")
let multiplicacion=document.getElementById("POR")
let division = document.getElementById("ENTRE")
let x2=document.getElementById("e2")
let raizc=document.getElementById("raiz")
let elevar=document.getElementById("elv")
let punto = document.getElementById(".")

let Reset= document.getElementById("Reset")
let Resultado=document.getElementById("Resultado")
let caja=document.getElementById("caja")
let value="0"
punto.addEventListener("click", function(){
    caja.innerHTML+="."
    value+="."
})
raizc.addEventListener("click", function(){
    caja.innerHTML+="√"
    value+="**0.5"
})
elevar.addEventListener("click", function(){
    caja.innerHTML="^"
    value+="**"
})
x2.addEventListener("click", function(){
    caja.innerHTML+="^2"
    value+="**2"
})
n1.addEventListener("click", function(){
    caja.innerHTML+="1"
    value+="1"
})
n2.addEventListener("click", function(){
    caja.innerHTML+="2"
    value+="2"
})
n3.addEventListener("click", function(){
    caja.innerHTML+="3"
    value+="3"
})
n4.addEventListener("click", function(){
    caja.innerHTML+="4"
    value+="4"
})

n5.addEventListener("click", function(){
    caja.innerHTML+="5"
    value+="5"
})
n6.addEventListener("click", function(){
    caja.innerHTML+="6"
    value+="6"
})
n7.addEventListener("click", function(){
    caja.innerHTML+="7"
    value+="7"
})
n8.addEventListener("click", function(){
    caja.innerHTML+="8"
    value+="8"
})
n9.addEventListener("click", function(){
    caja.innerHTML+="9"
    value+="9"
})
n0.addEventListener("click", function(){
    caja.innerHTML+="0"
    value+="0"
})
suma.addEventListener("click", function(){
    caja.innerHTML+="+"
    value+="+"
})
resta.addEventListener("click", function(){
    caja.innerHTML+="-"
    value+="-"
})
multiplicacion.addEventListener("click", function(){
    caja.innerHTML+="x"
    value+="*"
})
division.addEventListener("click", function(){
    caja.innerHTML+=":"
    value+="/"
})

Reset.addEventListener("click",function(){
    caja.innerHTML=""
    value=""
})
Resultado.addEventListener("click", function(){
    a=eval(value)
    caja.innerHTML=a
})
document.getElementById("del").addEventListener("click",function(){
    caja.innerHTML= caja.innerHTML-" "
    
})
document.querySelector(".settings").addEventListener("click", function(){
    document.writeln("")
})
document.getElementById("ans").addEventListener("click", function(){
    caja.innerHTML+=a
    value+=a
})
document.getElementById("p1").addEventListener("click", function(){
    caja.innerHTML+="("
    value+="("
})
document.getElementById("p2").addEventListener("click", function(){
    caja.innerHTML+=")"
    value+=")"
})

document.querySelector("#i").addEventListener("click",function(){
    document.write('<div class="conetnt">AS</div>')
})