for (i=0; i<3; i++){
    console.log("--------------------------------------------------------------------------------------")
}
console.log("Welcome to the Federal Reserve Simulator. Your goal is to bring the economy under control and keep your job.");

// let vars = prompt
let prompt = require('prompt-sync')();
let length = prompt("How many years will you go?");
let un = prompt("Unemployment Rate?");
let inf = prompt("Inflation Rate?");
let change = "a"
let intr
while (change.toUpperCase() != "Y" && change.toUpperCase() != "N"){
    change = prompt("Your current interest rate is 6%, do you want to change it? Y or N?").toString();
    if (change.toUpperCase()=="Y"){
        intr = prompt("What will your new interest rate be?");
    } else if (change.toUpperCase() == "N"){
        intr = 6;
    }
}
console.log("intr: "+intr)
let count = 1;
// From string to number
un = parseFloat(un)
inf = parseFloat(inf)
intr = parseFloat(intr)
length = parseFloat(length)
length *= 4
console.log("intr: "+intr)
// interest variables
let f = {
    "arr": [intr, 6],
    "difs": [0],
    "tot": 0
}
f.difs = [f.arr[0]-f.arr[1], 0, 0, 0, 0, 0]
f.tot = f.difs[0]
console.log("intr: "+intr)
console.log("arr fed: "+f.arr)
console.log("difs fed: "+f.difs)
console.log("total fed: "+f.tot)

let ex = {
    "con": 55,
    "inf": inf/10
}

const target = {
    "inf": 2,
    "un": 4,
    "pubUn": 5,
    "pubIntr": 6
}

let d = {
    "g": 0,
    "gInf": 0,
    "gUn": 0,
    "intr": intr - 6,
    "inf": 0,
    "un": 0,
    "con": 0
}
// Taylor Rule
function taylor(){
    return ((inf - target.inf)/2) - ((un - target.un)/2)
}
d.g = taylor()

function taylorInflation(){
    return (inf - target.inf)/2
}
d.gInf = taylorInflation()

function taylorUnemployment(){
    return (un - target.un)/-2
}
d.gUn = taylorUnemployment()

let t = f.tot - (d.g / 2)
let tInf = f.tot - (d.gInf / 2)
let tUn = f.tot - (d.gUn / 2)
console.log("total fed: "+f.tot)
// Functions
let factor = 0
function infChange(){
    // return (Math.pow(tayDif * -1, 3)/2) + (ex.inf/2)
    let core = .25*((-0.5 * inf) + 1 - tInf)
    if (Math.abs(ex.inf) > 2) {
        factor = .90
    } else if (Math.abs(ex.inf) > 1){
        factor = .85
    } else if (Math.abs(ex.inf) > .75){
        factor = .75
    } else if (Math.abs(ex.inf) > .5){
        factor = .5
    } else if (Math.abs(ex.inf) > .25){
        factor = .25
    } else {
        factor = 0
    }
    console.log(`core: ${core} --- factor: ${factor} --- ex.inf: ${ex.inf}`)
    return (core * (1 - factor)) + (ex.inf * factor)
}
function unChange(){
    // return (Math.pow(tayDif, 3)/2) + (d.un/2)
    return .25*((-0.5 * un) + 2 + tUn)
}
function infex(){
    return .5*(d.inf - tInf/3) + .5*ex.inf
    // intr should be total intr over the past 6 quarters
}
let base
function confidence(){
    if (inf > 10){
        base = ((target.pubUn - un)*(9/50))+((d.un)*(9/50))+((target.pubIntr - intr)*(9/50))+((d.intr)*(9/50))+((ex.inf)*(14/50))
    } else {
        base = ((target.pubUn - un)/4)+((d.un)/4)+((target.pubIntr - intr)/4)+((d.intr)/4)
    }
    // let adjusted = 10/(.1 + (.95**(base-5)))
    return Math.round(base)
}

let quickExit = false;

while (count < length){
    if (quickExit == true) break
    if (ex.con < 25){
        console.log("Unemployment: " + un);
        console.log("Inflation: " + inf);
        console.log("Interest: " + intr);
        console.log("Inflationary expectations: " + ex.inf)
        console.log("Consumer Confident: " + ex.con)
        console.log("You were fired because consumer confidence was too low")
    }

    console.log("dgInf: "+d.gInf)
    console.log("tInf: "+tInf)
    console.log("dgUn: "+d.gUn)
    console.log("tUn: "+tUn)

    d.inf = infChange()
    inf += d.inf

    d.un = unChange()
    un += d.un

    d.con = confidence()
    ex.con += d.con

    ex.inf = infex()

    console.log("--------------------------------------------------------------------------------------")
    if (count == 1){
        console.log("After your first month...");
    } else if (count == 12){
        console.log("After your first year");
    } else if (count % 12 ==0){
        console.log(`Year ${count % 12}`);
    } else if (count > 12){
        console.log(`Year ${count % 12} Month ${count - (count % 12)}`);
    } else if (count<12 && count!=1){
        console.log(`Month ${count}`);
    }

    console.log("Unemployment: " + un);
    console.log("Inflation: " + inf);
    console.log("Interest: " + intr);
    console.log("Inflationary expectations: " + ex.inf)
    console.log("Consumer Confident: " + ex.con)

    if (un > 12) console.log("You are in an unemployment crisis. You need to produce more growth in the economy.");
    if (inf > 12) console.log("You are in an inflation crisis. You need to limit the growth in the economy.");
    if (un < 6 && un > 1 && inf < 5 && inf > 0) console.log("Your economy is in incredible shape. Keep it up!");
    if (inf < 0) console.log("You are currently in a deflation crisis. You need to stimulate the economy.");

    change = "";
    while (change.toUpperCase() != "Y" && change.toUpperCase() != "N"){
        change=prompt(`Your current interest rate is ${intr}%, do you want to change it? Y or N?`).toString();
        switch (change.toUpperCase()){
            case "Y":
                intr = prompt("What will your new interst rate be?")
                intr = parseInt(intr)
                break
            case "N":
                break
            case "QE":
                quickExit = true
                break
        }
    }

    f.arr.unshift(intr)
    f.difs.unshift(f.arr[0] - f.arr[1])
    f.arr.pop()
    f.tot = 0
    // console.log(i)
    for (i=0; i<6; i++){
        f.tot += f.difs[i]
    }

    d.g = taylor()
    d.gInf = taylorInflation()
    d.gUn = taylorUnemployment()

    t = f.tot - (d.g / 2)
    tInf = f.tot - (d.gInf / 2)
    tUn = f.tot - (d.gUn / 2)

    count++
}


if (length > 24 && length % 12 != 0){
    console.log(`After ${length % 12} years and ${length - (length % 12)}`);
} else if (length < 12){
    console.log(`After ${length} months`);
} else if (length == 12){
    console.log(`After one year`);
} else {
    console.log(`After ${length % 12} years`)
}
console.log("Unemployment: " + un);
console.log("Inflation: " + inf);
console.log("Interest: " + intr);
console.log("Inflationary expectations: " + ex.inf)
console.log("Consumer Confident: " + ex.con)