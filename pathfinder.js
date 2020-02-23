
canvasSize = 600;
function setup() {
    createCanvas(canvasSize,canvasSize);

    pixelDensity(1);
    noStroke();
    noLoop();
    background('black');
}

// GLOBAL PARAMETERS
arrSize = 50;
startCoord = [1,1];
endCoord = [40,32];
cellSize = canvasSize/arrSize;

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

function cell (x, y, size) {
    rect(x,y,size,size);
};

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
    // returns true if coord is in arr

    flag = false;

    for(i = 0; i < arr.length; i++) {
        if(arr[i][0] == coord[0] && arr[i][1] == coord[1] ) {
            flag = true;
        }
    }
    console.log("flag", flag);
    return(flag);
}

function clean_array(nayborArr, blockedArr) {
    cleanArr = [];

    for(i = 0; i < nayborArr.length; i++) {
        x = nayborArr[i][0];
        y = nayborArr[i][1];
        
        isClean = true;
        
        for(j = 0; j < blockedArr.length; j++) {
            blockedX = blockedArr[j][0];
            blockedY = blockedArr[j][1];

            if(x == blockedX && y == blockedY ) {
                isClean = false;
            }
        }

        if (isClean) {
            cleanArr.push([x,y]);
        }
    }

    return(cleanArr);
}

function neighbourCoords(coord) {
    x = coord[0];
    y = coord[1];

    neighbours = []

    for(i = -1; i < 2; i++) {
        for(j = -1; j < 2; j++) {
            neighbourCell = [ x+i, y+j ];
            
            if((i == 0 && j==0)) {
                // do nothin
            }
            else {
                neighbours.push(neighbourCell);
            }
            
        }
    }

    clean_neighbours = clean_array(neighbours, blockedPoints);
    
    return(clean_neighbours);
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

function path(startCoord, endCoord) {
    pathCoords = []

    currCoord = startCoord;

    while( heurstic(currCoord, endCoord) != 0 ) {
        nextHop = bestNeigbour(currCoord, endCoord);

        pathCoords.push(nextHop);
        currCoord = nextHop;
    }

    return(pathCoords);
}

function drawCells() {

    blockedPts = [
        [4,6],
        [5,6],
        [6,6],
        [7,6]
    ];

    pathh = path(startCoord, endCoord);
    // console.log(pathh);

    for( i = 0; i < arrSize; i++) {
        for(j = 0; j < arrSize; j++) {
            thisCell = [i,j];
            
            isContainedInBlocked = contained_in(thisCell, blockedPts);
            console.log(isContainedInBlocked);
            // isContainedInPath = contained_in(thisCell, pathh);
            
            if(thisCell[0] == startCoord[0] && thisCell[1] == startCoord[1]) {
                // thisCell is startcell
                fill('red');
            } else if( thisCell[0] == endCoord[0] && thisCell[1] == endCoord[1] ) {
                // thisCell is endCell
                fill('green');
            }
            // else if ( isContainedInBlocked == true ) {
            //     // thisCell is blockedCell
            //     fill('blue');
            // }

            // else if (isContainedInPath == true) {
            //     // thisCell is in path
            //     // fill('white');
            // }

            else {
                fill(200);
            }


            cell(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }

}

function draw() {

    drawCells();

}

// isContainedInPath = contained_in([2,3], [ [2,4],[4,4] ] );
// console.log(isContainedInPath);