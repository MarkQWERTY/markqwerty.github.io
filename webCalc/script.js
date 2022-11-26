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
punto.addEventListener("click", function(){
    caja.innerHTML+="."
})
raizc.addEventListener("click", function(){
    caja.innerHTML+="**0.5"
})
elevar.addEventListener("click", function(){
    caja.innerHTML+="**"
})
x2.addEventListener("click", function(){
    caja.innerHTML+="**2"
})
n1.addEventListener("click", function(){
    caja.innerHTML+="1"
})
n2.addEventListener("click", function(){
    caja.innerHTML+="2"
})
n3.addEventListener("click", function(){
    caja.innerHTML+="3"
})
n4.addEventListener("click", function(){
    caja.innerHTML+="4"
})

n5.addEventListener("click", function(){
    caja.innerHTML+="5"
})
n6.addEventListener("click", function(){
    caja.innerHTML+="6"
})
n7.addEventListener("click", function(){
    caja.innerHTML+="7"
})
n8.addEventListener("click", function(){
    caja.innerHTML+="8"
})
n9.addEventListener("click", function(){
    caja.innerHTML+="9"
})
n0.addEventListener("click", function(){
    caja.innerHTML+="0"
})
suma.addEventListener("click", function(){
    caja.innerHTML+="+"
})
resta.addEventListener("click", function(){
    caja.innerHTML+="-"
})
multiplicacion.addEventListener("click", function(){
    caja.innerHTML+="*"
})
division.addEventListener("click", function(){
    caja.innerHTML+="/"
})

Reset.addEventListener("click",function(){
    caja.innerHTML=""
})
Resultado.addEventListener("click", function(){
    caja.innerHTML=eval(caja.innerHTML)
})
document.getElementById("del").addEventListener("click",function(){
    caja.innerHTML= caja.innerHTML-" "
    
})
