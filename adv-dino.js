//board
//to ref canvas tag
let board;

let boardWidth = 770;
let boardHeight = 250;

//to draw on canvas
let context;



//dino variables
let dinoWidth = 88;
let dinoHeight =94;
let dinoX = 50; //dino position on x-axis (right 50px from left side)
let dinoY = boardHeight - dinoHeight; //default y positon of dino, dino on ground
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus to move physics
//to move right # need be positive, to move left # need be negative
let velocityX = -8; //cactus moving left speed, towards dino
let velocityY = 0; //grounded entire time
let gravity = .4;


let gameOver = false;
let score = 0;


//cactus to insert
//use array for multiple cacti
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;// cactus position on x-axis (right 700px from left side)
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//hide the 'press any key to start'
//  startScreenElem = document.querySelector("[data-start-screen]");


//page loads call a function to initalize
window.onload = function() {
    board = document.getElementById("board");//get tag from canvas
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");//draw on board with this

    //draw example dino
    //should show a green box 50px from the left side
    // context.fillStyle = "green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    //loads dino image
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        
    }

    //loads all the cactus images
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";


    
    
    //every second will generate a cactus
    setInterval(placeCactus, 1000) //1000ms  = 1s
    //event listener for web page
    //listen for pressing a key, calls moveDino, then checks which key pressed
    document.addEventListener("keydown", moveDino);
    //listen for the press a key to start the game
    //run only once so space and jump aren't the same once game 'starts'
    document.addEventListener("keydown", handleStart, {once: true});
}

//to be able to jump later
//to draw frames for game
function update() {
    requestAnimationFrame(update);
    //no need to draw if game over
    if (gameOver) {
        return;
    }
    //reset canvas so cactus not on top of each other
    context.clearRect(0, 0, board.width, board.height);

    //jump
    velocityY += gravity;
    //apply gravity to current dino.y, not go past ground
    dino.y = Math.min(dino.y + velocityY, dinoY);//dinoY helps to cap it

    //draw the dino
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //draw cactus - loop cactusArray
    for(let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        //before cactus is drawn, need to update x position
        cactus.x += velocityX;//cactus moving left speed towards dino
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        //detect collision for each cacti
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            //same as load dino image in line 72
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); 
            }
        }
    }

    //score of dino game
    context.fillStyle = "black";
    context.font = "20px courier"
    score++;
    context.fillText(score, 15, 30); //15 from left, 30 from top
};

//press to start game
function handleStart() {
    // startScreenElem.classList.add("hide");
    requestAnimationFrame(update);
}



//dino movement
//listen for 'key' events, i.e. spacebar or up arrow
function moveDino(e) {//e for event
    
    //dino.y == dinoY check that dino on ground to jump only once, not mutiple times in air
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10;// negative equals going up y-axis
    }
   //user cannot jump if game over
    //reset the game
    if (gameOver) {
        dino.y = dinoY;
        cactusArray = [];
        score = 0;
        gameOver = false;
        //load dino alive again after press key to restart
        dinoImg = new Image();
        dinoImg.src = "./img/dino.png";
        dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        
    }
    }
}



//set up where cactus goes 
function placeCactus() {
    //if gameover, no need for cactus
    if (gameOver) {
        return;
    } 

    let cactus = {
        img: null, //unknown for now bec vary based on which cactus used
        x : cactusX,
        y : cactusY,
        width : null,//unknown for now bec vary based on which cactus used
        height: cactusHeight
    }

    //every second there is a 'chance' a cactus may appear
    let placeCactusChance = Math.random(); //gives random # between 0 - 0.9999...

    if(placeCactusChance > .90)  {//10% chance of cactus3 appear
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } 
    else if (placeCactusChance > .70) {//30% chance of cactus2 appear
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) {//50% chance of cactus1 appear
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    //limit # of cacti in array bec too much memory used if cacti continue to generate forever
    //i.e. cannot load properly later
    if (cactusArray.length > 5) {
        cactusArray.shift();//removes first element from array so that array doesn't keep growing
    }
};

//check for when dino and cacti collide
function detectCollision(a, b) {
    return a.x < b.x + b.width && //a's top left corner don't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner don't reach b's top left corner
    a.y < b.y + b.height && //a's top left corner don't reach b's bottom left corner
    a.y + a.height > b.y; //a's bottom left corner passes b's top left corner
}