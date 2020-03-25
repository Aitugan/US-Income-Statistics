// let subscriberData;
// let countries;
// let states;

// const mappa = new Mappa('Leaflet');
// let trainMap;
// let data = [];
// let avgSal = 0;
// let select = document.getElementById("choice");
// document.getElementById("btn").onclick = function() {
//     let canvas = createCanvas(800,600);
//     trainMap = mappa.tileMap(options);
//     trainMap.overlay(canvas);
//     let maxSal = 0;
//     let minSal = Infinity;

//     for (let state of states) {
//         let latitude = stateSalaries[state].Latitude;
//         let longitude = stateSalaries[state].Longitude;
//         let salary;
//         salary = stateSalaries[state][select.value];

//         if (salary > maxSal) {
//             maxSal = salary;
//         }
//         if (salary < minSal) {
//             minSal = salary
//         }
//         data.push({latitude, longitude, salary});
//         avgSal += salary;
//     }
//     console.log(maxSal);
//     console.log(minSal);

//     avgSal /= 50;
//     console.log(avgSal);
//     for (let stateBall of data) {
//         stateBall.diameter = stateBall.salary/35000;//map(sqrt(stateBall.salary), minDiameter,maxDiameter,1,2);
//     }
// };

// console.log(select.value);
// const options = {
//     lat:0,
//     lng:0,
//     zoom:1.5,
//     style:"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
// };
// function preload() {
//     stateSalaries = loadJSON('salaries.json');
//     states = ["Wisconsin","West Virginia","Vermont","Texas","South Dakota","Rhode Island","Oregon","New York","New Hampshire","Nebraska","Kansas","Mississippi","Illinois","Delaware","Connecticut","Arkansas","Indiana","Missouri","Florida","Nevada","Maine","Michigan","Georgia","Hawaii","Alaska","Tennessee","Virginia","New Jersey","Kentucky","North Dakota","Minnesota","Oklahoma","Montana","Washington State","Utah","Colorado","Ohio","Alabama","Iowa","New Mexico","South Carolina","Pennsylvania","Arizona","Maryland","Massachusetts","California","Idaho","Wyoming","North Carolina","Louisiana"];
// }

// function draw() {
//     clear();
//     for (let stateBall of data) {
//         const pixCoord = trainMap.latLngToPixel(stateBall.latitude,stateBall.longitude);
//         if (avgSal+10000 > stateBall.salary) {
//             fill(0,255,0,100);
//             const zoom = trainMap.zoom();
//             const scl = pow(2,zoom);
//             ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
//         } else if (stateBall.salary > avgSal-20000 && avgSal+15000 > stateBall.salary) {
//             fill(150,150,150,100);
//             const zoom = trainMap.zoom();
//             const scl = pow(2,zoom);
//             ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
//         } else {
//             fill(255,0,0,100);
//             const zoom = trainMap.zoom();
//             const scl = pow(2,zoom);
//             ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
//         }
//     }
// }
let subscriberData;
let countries;
let states;

const mappa = new Mappa('Leaflet');
let trainMap;
let canvas;
let data = [];
let avgSal = 0;


const options = {
    lat:0,
    lng:0,
    zoom:1.5,
    style:"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
};
function preload() {
    // subscriberData = loadTable('/subscribers_geo.csv','header');
    stateSalaries = loadJSON('salaries.json');
    states = ["Wisconsin","West Virginia","Vermont","Texas","South Dakota","Rhode Island","Oregon","New York","New Hampshire","Nebraska","Kansas","Mississippi","Illinois","Delaware","Connecticut","Arkansas","Indiana","Missouri","Florida","Nevada","Maine","Michigan","Georgia","Hawaii","Alaska","Tennessee","Virginia","New Jersey","Kentucky","North Dakota","Minnesota","Oklahoma","Montana","Washington State","Utah","Colorado","Ohio","Alabama","Iowa","New Mexico","South Carolina","Pennsylvania","Arizona","Maryland","Massachusetts","California","Idaho","Wyoming","North Carolina","Louisiana"];
}

function setup() {
    canvas = createCanvas(800,600);
    trainMap = mappa.tileMap(options);
    trainMap.overlay(canvas);
    let maxSal = 0;
    let minSal = Infinity;

    for (let state of states) {
        let latitude = stateSalaries[state].Latitude;
        let longitude = stateSalaries[state].Longitude;
        let salary = stateSalaries[state].Average;
        if (salary > maxSal) {
            maxSal = salary;
        }
        if (salary < minSal) {
            minSal = salary
        }
        data.push({latitude, longitude, salary});
        avgSal += salary;

    }
    let minDiameterStates = sqrt(maxSal);
    let maxDiameterStates = sqrt(minSal);
    avgSal /= 50;

    for (let stateBall of data) {
        stateBall.diameter = map(sqrt(stateBall.salary), minDiameterStates,maxDiameterStates,1,3);
    }
}


function draw() {
    clear();
    for (let stateBall of data) {
        const pixCoord = trainMap.latLngToPixel(stateBall.latitude,stateBall.longitude);
        if (avgSal+15000 <= stateBall.salary) {
            fill(0,255,0,100);
            const zoom = trainMap.zoom();
            const scl = pow(2,zoom);
            ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
        } else if (stateBall.salary > avgSal-10000 && avgSal+15000 > stateBall.salary) {
            fill(150,150,150,100);
            const zoom = trainMap.zoom();
            const scl = pow(2,zoom);
            ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
        } else {
            fill(255,0,0,100);
            const zoom = trainMap.zoom();
            const scl = pow(2,zoom);
            ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    
        }
// // const zoom = trainMap.zoom();
// //         const scl = pow(2,zoom);
//         ellipse(pixCoord.x,pixCoord.y,stateBall.diameter*scl);
    }
}