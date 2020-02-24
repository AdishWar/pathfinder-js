
// GLOBAL VARIABLES
canvasSize = 600;  // 600 X 600 pixels canvas

// you can modify below 3 variables.
arrSize = 15;      // 15 X 15 size map
startCoord = [1,1];  // starting coord 
endCoord = [13,12];  // destination coord 

// dont modify cellsize and blockedPoints[]
cellSize = canvasSize/arrSize;  
blockedPoints = [
    // [4,6],
    // [5,6],
    // [6,6],
    // [7,6]
];

// END OF GLOBAL VARIABLES

function setup() {
    createCanvas(canvasSize,canvasSize);

    pixelDensity(1);
    // noStroke();
    stroke('grey');
    background('black');
    // alert('Close this popup, click on canvas so that it gets in focus and press any key to advance the path. Click on cells to add a "wall" there.')
    noLoop();
}



// arr is the map matrix
arr = []
for(i = 0; i < arrSize; i++) {
    a = []
    for(j = 0; j < arrSize; j++) {
        a.push(0)
    }
    arr.push(a)
}

function cell (x, y, size) {
    // draws square cell at x,y 
    rect(x,y,size,size);
};

function heurstic(currCoord, endCoord) {
    // returns distance b/w currCoord and endCoord
    distance = Math.abs(currCoord[0] - endCoord[0]) + Math.abs( currCoord[1] - endCoord[1] );
    return(distance);
}

// unused function
function dist2here(startCoord, currCoord) {
    distance = Math.abs(currCoord[0] - startCoord[0]) + Math.abs( currCoord[1] - startCoord[1] );
    return(distance);
}

function contained_in(coord, arr) {
    // UNUSED FUNCTION
    // returns false if coord is not in arr
    // returns true if coord is in arr

    // flag = false;

    for(k = 0; k < arr.length; k++) {
        if(arr[k][0] == coord[0] && arr[k][1] == coord[1] ) {
            return(true);
        }
    }
    // console.log("flag", flag);
    return(false);
}

function clean_array(nayborArr, blockedArr) {
    // removes the points in nayborArray that are also present in blockedArr

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
    // this returns the list of neighbourhood coords of a given coords.
    // neighbourhood coords present in the blockedCells list are ignored.
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

    // removing blockedPoints from the list of neighbours, and returning the cleaned list
    clean_neighbours = clean_array(neighbours, blockedPoints);
    
    return(clean_neighbours);
}

function bestNeigbour(currCoord, endCoord) {
    // get the coords of neighbour cells of the current cell
    naybours = neighbourCoords(currCoord);

    //
    minHeuristicIndex = 0;
    minHeuristic = heurstic(naybours[0], endCoord);

    for(i = 0; i < naybours.length ; i++) {
        // get heuristic value of current cell. If less than minHeuristic, then set it as the new minHeuristic
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
    // initializng empty pathCoords array which will be filled later on
    pathCoords = []

    currCoord = startCoord;

    // run loop while heuristic (distance) b/w currCoord and endCoord is non zero
    while( heurstic(currCoord, endCoord) != 0 ) {
        // get the next Cell to hop to
        nextHop = bestNeigbour(currCoord, endCoord);

        pathCoords.push(nextHop);
        currCoord = nextHop;
    }

    return(pathCoords);
}

function drawCells(amountPathDraw) {
    // call path() to get array of points with the best path from startCoord to endCoord
    path_full = path(startCoord, endCoord);

    // use below 3 LOC if amountpathdraw is in percentage
    // ppd = amountPathDraw;
    // ppd = map( ppd, 0, 100, 0, path_full.length );
    // path_slice = path_full.slice(0,ppd);

    // use below 2 LOC if amountpathdraw is in number of blocks of path to draw
    apd = amountPathDraw;
    // if(apd == path_full.length) { alert('Destination reached'); }
    path_slice = path_full.slice(0,apd);

    // run nested loop i, j for every point in the "map"
    for( i = 0; i < arrSize; i++) {
        for(j = 0; j < arrSize; j++) {

            // initilizing variables 
            thisCell = [i,j];
            n_blockedPoints = blockedPoints.length;
            n_path = path_slice.length;
            isContainedInBlocked = false;
            isContainedInPath = false;

            // checking if current cell is in blockedPoints array
            for (k=0; k < n_blockedPoints; k++) {
                if( i == blockedPoints[k][0] && j == blockedPoints[k][1] ) {
                    isContainedInBlocked = true;
                    break;
                }
            }

            // checking if current cell is in pathh array
            for(k=0; k < n_path; k++) {
                if( i == path_slice[k][0] && j == path_slice[k][1] ) {
                    isContainedInPath = true;
                    break;
                }
            }            
            
            // filling correct color as per type of cell
                if(thisCell[0] == startCoord[0] && thisCell[1] == startCoord[1]) {
                    // thisCell is startcell
                    fill('red');
                } 
                else if ( isContainedInBlocked == true ) {
                    // thisCell is blockedCell
                    fill('blue');
                } 
                else if (isContainedInPath == true) {
                    // thisCell is in path
                    fill('white');
                }
                else if( thisCell[0] == endCoord[0] && thisCell[1] == endCoord[1] ) {
                    // thisCell is endCell
                    fill('green');
                } 
                else {
                    fill(200);
                }
            
            // draw rect at i,j; alternatively, cell() can be called
            rect(i*cellSize,j*cellSize,cellSize,cellSize);
            // cell(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
}

function keyTyped() {
    qq++;
    drawCells( qq );
}
qq = 0;

function mouseClicked() {
    x = floor(mouseX / cellSize);
    y = floor(mouseY / cellSize);
    cell = [x,y];
    blockedPoints.push(cell);
    drawCells( qq );
};

function draw() {
    // // time taken to finish animation times 10
    // finishTime = 30;

    // // sec = seconds passed since start of program divided by 10
    // sec = Math.round(millis()/100);

    // // percentagePathDraw = 100;

    // // ppd is percentagePathDraw
    // // for(ppd = 0; ppd <= 100; ppd++){
    // // }
    // pft = map(sec, 0, finishTime, 0, 100)

    drawCells( 0 );

}

// isContainedInPath = contained_in([3,4], [ [2,4],[4,4] ] );
// console.log(isContainedInPath);