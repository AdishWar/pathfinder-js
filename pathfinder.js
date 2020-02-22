

function setup() {
    createCanvas(650,650);

    pixelDensity(1);
    noStroke();
    noLoop();
    background('black');
}

// GLOBAL PARAMETERS
arrSize = 10;
startCoord = [1,1];
endCoord = [8,9];

// END 


arr = []

blockedPoints = [
    [4,6],
    [5,6],
    [6,6],
    [7,6]
];

for(i = 0; i < arrSize; i++) {
    a = []
    for(j = 0; j < arrSize; j++) {
        a.push(0)
    }
    arr.push(a)
}

function heurstic(currCoord, endCoord) {
    distance = Math.abs(currCoord[0] - endCoord[0]) + Math.abs( currCoord[1] - endCoord[1] );
    return(distance);
}

function dist2here(startCoord, currCoord) {
    distance = Math.abs(currCoord[0] - startCoord[0]) + Math.abs( currCoord[1] - startCoord[1] );
    return(distance);
}

function contained_in(coord, arr) {
    // returns false if coord is not in arr
    len = arr.length;
    flag = false;

    for(i = 0; i < len; i++) {
        if(arr[i][0] == coord[0] && arr[i][1] == coord[1] ) {
            flag = true;
        }
    }
    return(flag);
}

function neighbourCoords(coord) {
    x = coord[0];
    y = coord[1];

    neighbours = []

    for(i = -1; i < 2; i++) {
        for(j = -1; j < 2; j++) {
            neighbourX = x + i;
            neighbourY = y + j;
            cell = [neighbourX, neighbourY];

            if(i == 0 && j==0) {
                continue;
            }
            else if ( !contained_in(cell, blockedPoints) ) {
                neighbours.push(cell);
            }
            else {
                
            }
        }
        
    }
    return(neighbours);
}

function bestNeigbour(currCoord, endCoord) {
    naybours = neighbourCoords(currCoord);
    minHeuristicIndex = 0;
    minHeuristic = heurstic(naybours[0], endCoord);

    for(i = 0; i < naybours.length ; i++) {

        currH = heurstic(naybours[i], endCoord);
        if( currH < minHeuristic ) {
            minHeuristic = currH;
            minHeuristicIndex = i;
        }
    }

    bestNaybor = naybours[minHeuristicIndex];
    return(bestNaybor);
}

function  path(startCoord, endCoord) {
    pathCoords = []

    currCoord = startCoord;

    while( heurstic(currCoord, endCoord) != 0 ) {

        nextHop = bestNeigbour(currCoord, endCoord);

        pathCoords.push(nextHop);
        console.log(nextHop);
        currCoord = nextHop;
    }

    return(pathCoords);
}

console.log( path( [2,2], [8,8] ) );

function draw() {


}
