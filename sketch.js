/* The Game Project 5 - Bring it all together */

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isReached;

var jumpSound;
var usaSound;
var deadSound;
var songTheme;

var clouds;
var sun;
var wind;
var mountains;
var trees_x;
var canyons;
var collectables;
var platforms;
var enemies;
 
var game_score;
var flagpole;
var lives;
var startGame;


function preload()
{
    soundFormats('mp3','wav');
    songTheme = loadSound('sound/Dont_Stop_Me_Now.mp3');
    songTheme.setVolume(0.1);
    jumpSound = loadSound('sound/Jump.mp3');
    jumpSound.setVolume(0.4);
    usaSound = loadSound('sound/USA.mp3');
    usaSound.setVolume(0.8);
    deadSound = loadSound('sound/Dead.mp3');
    deadSound.setVolume(0.6);
}

function setup(){
        createCanvas(1024, 576);
        songTheme.play();
        floorPos_y = height * 3/4;
        lives = 4;
        startGame();
}

function startGame(){
    gameChar_x = width/3;
    gameChar_y = (floorPos_y-500);
    scrollPos = 0;
    gameChar_world_x = gameChar_x - scrollPos;
    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    wind = false;
    // Initialise arrays of scenery objects.
    canyons = [
        {x_pos: 500, width: 100},
        {x_pos: 900, width: 100},
        {x_pos: 1450, width: 90},
        {x_pos: 1650, width: 100},
        {x_pos: 2000, width: 120}
    ];
    clouds = [
        {x_pos: 0, y_pos: 80, radius: 100, scale: 1},
        {x_pos: 250, y_pos: 120, radius: 100, scale: 0.8},
        {x_pos: 600, y_pos: 150, radius: 100, scale: 1.0},
        {x_pos: 850, y_pos: 50, radius: 100, scale: 0.5},
        {x_pos: 1100, y_pos: 120, radius: 100, scale: 1.3},
        {x_pos: 1300, y_pos: 50, radius: 100, scale: 1.0},
        {x_pos: 1600, y_pos: 100, radius: 100, scale: 0.8},
        {x_pos: 1900, y_pos: 140, radius: 100, scale: 0.7},
        {x_pos: 2400, y_pos: 80, radius: 100, scale: 1.1},
        {x_pos: 2000, y_pos: 140, radius: 100, scale: 0.7}
    ];
    collectables = [
        {x_pos: 200, y_pos: floorPos_y, width: 35, height: -50, scale: 0.5, isFound: false},
        {x_pos: 850, y_pos: floorPos_y - 15, width: 35, height: -50, scale: 1.2, isFound: false},
        {x_pos: 1300, y_pos: floorPos_y, width: 35, height: -50, scale: 1.2, isFound: false},
        {x_pos: 2010, y_pos: floorPos_y-100, width: 35, height: -50, scale: 1.6, isFound: false},
        {x_pos: -800, y_pos: floorPos_y, width: 35, height: -50, scale: 5, isFound: false},
        {x_pos: 1770, y_pos: floorPos_y-110, width: 35, height: -50, scale: 1.2, isFound: false},
    ];
    mountains = [
        {x_pos: 500, y_pos: floorPos_y, scale: 1.0},
        {x_pos: 1000, y_pos: floorPos_y, scale: 1.2},
        {x_pos: 1600, y_pos: floorPos_y, scale: 0.8}
    ];
    trees = {
        x_pos: [100, 340, 420, 900, 1100, 1220],
        y_pos: [floorPos_y, floorPos_y,floorPos_y,floorPos_y, floorPos_y, floorPos_y],
        radius: 100,
        height: -60,
        width: 35,
        scale: [1.0, 1.1, 0.9, 1.0, 1.1, 1.0]
    };
    sun = {
        x_pos: gameChar_world_x+300,
        y_pos: 75,
        width: 100,
        height: 100,
    };
    flagpole = {
        x_pos: 2500,
        isReached: false,
    };
    game_score = 0;
    lives = lives -= 1;
    
    platforms = [];
    platforms.push(createPlatform(0,floorPos_y-100,100));
    platforms.push(createPlatform(120,floorPos_y-150,100));
    platforms.push(createPlatform(1650,floorPos_y-100,100));
    
    enemies = [];
    enemies.push( new Enemy(0,floorPos_y,100));
    enemies.push( new Enemy(180,floorPos_y,100));
    enemies.push( new Enemy(1100,floorPos_y,100));
    enemies.push( new Enemy(1450,floorPos_y,100));
}

function draw(){
    background(100, 155, 255);
    noStroke();
    fill(0,128,0);
    rect(0, floorPos_y, width, height/4);
    push();
    translate(scrollPos,0);

    if (gameChar_y > floorPos_y+250 && lives > 0){
        startGame()
    };
    // Draw sun
    fill(255,238,0);
    ellipse(sun.x_pos, sun.y_pos, sun.width, sun.height);
        if (isLeft){
            sun.x_pos = sun.x_pos -=2.5;
        };
        if (isRight){
        sun.x_pos = sun.x_pos +=2.5;
        };
    //Draw Dead End pole
    fill(255,0,0);
    rect(-360,floorPos_y-40,80,-55);
    textSize(20);
    fill(255,255,0);
    text('DEAD',-350,floorPos_y-70);
    text('END',-340,floorPos_y-50);
    fill(100)
    rect(-330,floorPos_y,15,-40)
    
    drawMountains();
    drawClouds();
    drawTrees();

    // Draw canyons.
    for (var i = 0; i < canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    };
    // Draw collectable items.
    for (var i = 0; i < collectables.length; i++){
        if (collectables[i].isFound == false){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    renderFlagpole();

    if(lives < 1)
    {   
        fill(0);
        noStroke();
        background(255,0,0,150);
        fill(255);
        textSize(40);
        text("Game over. Press space to continue.", width/5, height/2);
        songTheme.stop();
        return
    };
    if(flagpole.isReached == true)
    {
        fill(0);
        noStroke();
        background(0,255,0,125);
        fill(255)
        textSize(40);
        text("Level complete. Press space to continue.",flagpole.x_pos-700 , height/2);
        return
    };
    for (var i = 0; i < platforms.length; i++){
        platforms[i].draw();
    };
    for ( var i=0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].isContact(gameChar_world_x,gameChar_y)){
            deadSound.play();
            startGame();
            break;
            }
    }
    pop();

    // Draw lives
    for(var i = 0;i < lives; i++)
    {
        fill(0,72,186);
        noStroke();
        ellipse(140 + 20*i, 22, -15, -15);
    }
    drawGameChar();
    // Draw screen text
    fill(16,12,8);
    noStroke();
    text("Score: " + game_score, 20, 25);
    text("Lives: ", 100, 25);
     fill(16,12,8,75);
    text("P: play music", 20, 572);
    text("M: mute music", 100, 572);
    // Logic to make the game character move or the background scroll.
    if(isLeft){
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }
    if(isRight)
        {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            scrollPos -= 5; // negative for moving against the background
        }
    }
    // Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {   
        var isContact = false;
        for (var i =0; i<platforms.length; i++){
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
                isContact = true;
                break;
            }
        }
        if(isContact == false){
            gameChar_y += 5;
            isFalling = true;
        }
        else{
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }

    if(isPlummeting)
    {
        gameChar_y += 5;
    }

    if (flagpole.isReached !=true){
        checkFlagpole();
    }
    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
}
// ---------------------
// Key control functions
// ---------------------


function keyPressed() {
    
    if(flagpole.isReached && key == ' ')
    {
    nextLevel();
    return true;
    }
    else if(lives == 0 && key == ' ')
    {  
    return true;
    }
    
    if (key == 'A' || keyCode == 37) {
        isLeft = true;
    }
    if (key == 'D' || keyCode == 39) {
        isRight = true;
    }
    if ((keyCode == 32 || keyCode == 87 || keyCode == 38) && (gameChar_y == floorPos_y || isFalling==false)) {
        gameChar_y -= 150;
        jumpSound.play();
    }
    if (key == 'M' || keyCode == 77) {
        songTheme.stop();
    }
    if (key == 'P' || keyCode == 80) {
        songTheme.play();
    }
}

function keyReleased() {
    if (key == 'A' || keyCode == 37) {
        isLeft = false;
    }
    if (key == 'D' || keyCode == 39) {
        isRight = false;
    }
}
// ------------------------------
// Game character render function
// ------------------------------
function drawGameChar()
{
    if (isLeft && isFalling) {
        //   jumping-left code
        fill(139, 69, 19); // brown
        rect(gameChar_x + 1, gameChar_y - 5, -20, -5); // shoes
        stroke(94, 49, 15); // dark brown
        line(gameChar_x, gameChar_y - 7, gameChar_x - 19, gameChar_y - 7); // sole line
        noStroke();
        fill(0, 0, 255); // blue
        quad(gameChar_x + 1, gameChar_y - 10, gameChar_x - 15, gameChar_y - 10,
        gameChar_x - 15, gameChar_y - 17, gameChar_x - 3, gameChar_y - 17)
        quad(gameChar_x - 3, gameChar_y - 17, gameChar_x - 15, gameChar_y - 17,
        gameChar_x - 15, gameChar_y - 27, gameChar_x + 1, gameChar_y - 27)
        fill(0, 0, 255);
        ellipse(gameChar_x - 14, gameChar_y - 34, 12, 19); // belly
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 3, gameChar_y - 22, -8, -5); //hand
        fill(255);
        rect(gameChar_x - 3, gameChar_y - 28, -8, 2); // sleeve
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 27, -16, -23); // torso
        fill(255);
        quad(gameChar_x + 1, gameChar_y - 53, gameChar_x - 11, gameChar_y - 53,
        gameChar_x - 15, gameChar_y - 50, gameChar_x + 1, gameChar_y - 50); // collar
        fill(255, 0, 0);
        triangle(gameChar_x - 11, gameChar_y - 53, gameChar_x - 15, gameChar_y - 53,
        gameChar_x - 15, gameChar_y - 50); // tie knott
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 1, gameChar_y - 53, -16, -18); // head
        fill(255, 255, 0);
        beginShape(); // hair
        vertex(gameChar_x + 1, gameChar_y - 58);
        vertex(gameChar_x + 1, gameChar_y - 74);
        vertex(gameChar_x - 15, gameChar_y - 74);
        vertex(gameChar_x - 18, gameChar_y - 76);
        vertex(gameChar_x - 23, gameChar_y - 76);
        vertex(gameChar_x - 15, gameChar_y - 68);
        endShape(CLOSE);
    }
    else if (isRight && isFalling) {
        // jumping-right code
        fill(139, 69, 19); // brown
        rect(gameChar_x + 1, gameChar_y - 5, 20, -5); // shoes
        stroke(94, 49, 15); // dark brown
        line(gameChar_x + 1, gameChar_y - 7, gameChar_x + 20, gameChar_y - 7); // sole line
        noStroke();
        fill(0, 0, 255); // blue
        //rect(gameChar_x+1,gameChar_y-7,16,-20);
        // pants
        quad(gameChar_x + 1, gameChar_y - 10, gameChar_x + 17, gameChar_y - 10,
        gameChar_x + 17, gameChar_y - 17, gameChar_x + 5, gameChar_y - 17)
        quad(gameChar_x + 5, gameChar_y - 17, gameChar_x + 17, gameChar_y - 17,
        gameChar_x + 17, gameChar_y - 27, gameChar_x + 1, gameChar_y - 27)
        fill(0, 0, 255);
        ellipse(gameChar_x + 15, gameChar_y - 34, 12, 19); // belly
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 5, gameChar_y - 22, 8, -5); //hand
        fill(255);
        rect(gameChar_x + 5, gameChar_y - 28, 8, 2); // sleeve
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 27, 16, -23); // torso
        fill(255);
        quad(gameChar_x + 1, gameChar_y - 53, gameChar_x + 14, gameChar_y - 53,
        gameChar_x + 17, gameChar_y - 50, gameChar_x + 1, gameChar_y - 50); // collar
        fill(255, 0, 0);
        triangle(gameChar_x + 13, gameChar_y - 53, gameChar_x + 17, gameChar_y - 53,
        gameChar_x + 17, gameChar_y - 50); // tie knott
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 1, gameChar_y - 53, 16, -18); // head
        fill(255, 255, 0);
        beginShape(); // hair
        vertex(gameChar_x + 1, gameChar_y - 58);
        vertex(gameChar_x + 1, gameChar_y - 74);
        vertex(gameChar_x + 17, gameChar_y - 74);
        vertex(gameChar_x + 20, gameChar_y - 76);
        vertex(gameChar_x + 25, gameChar_y - 76);
        vertex(gameChar_x + 17, gameChar_y - 68);
        endShape(CLOSE);
    }
    else if (isLeft) {
        // walking left code
        stroke(94, 49, 15); // dark brown
        line(gameChar_x, gameChar_y + 1, gameChar_x - 16, gameChar_y + 1); // sole line
        noStroke();
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 2, -16, -20); // pants
        triangle
        fill(139, 69, 19); // brown
        rect(gameChar_x + 1, gameChar_y + 3, -20, -5); // shoes
        fill(0, 0, 255);
        ellipse(gameChar_x - 13, gameChar_y - 29, 12, 19); // belly
        fill(255);
        rect(gameChar_x - 3, gameChar_y - 23, -8, 2); // shirt
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 22, -16, -23); // torso
        fill(255);
        quad(gameChar_x + 1, gameChar_y - 48, gameChar_x - 11, gameChar_y - 48,
        gameChar_x - 15, gameChar_y - 45, gameChar_x + 1, gameChar_y - 45); // collar
        fill(255, 0, 0);
        triangle(gameChar_x - 11, gameChar_y - 48, gameChar_x - 15, gameChar_y - 48,
        gameChar_x - 15, gameChar_y - 45); // tie knott
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 1, gameChar_y - 48, -16, -18); // head
        point(gameChar_x - 15, gameChar_y - 59); // eye
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 3, gameChar_y - 16, -8, -5); // hand
        fill(255, 255, 0);
        beginShape(); // hair
        vertex(gameChar_x + 1, gameChar_y - 53);
        vertex(gameChar_x + 1, gameChar_y - 69);
        vertex(gameChar_x - 15, gameChar_y - 69);
        vertex(gameChar_x - 18, gameChar_y - 71);
        vertex(gameChar_x - 23, gameChar_y - 71);
        vertex(gameChar_x - 15, gameChar_y - 63);
        endShape(CLOSE);
        stroke(0); // black
        strokeWeight(2);
        point(gameChar_x - 15, gameChar_y - 59); // left eye
        strokeWeight(1);
    }
    else if (isRight) {
        // walking right code
        fill(139, 69, 19); // brown
        rect(gameChar_x + 1, gameChar_y + 3, 20, -5); // shoes
        stroke(94, 49, 15); // dark brown
        line(gameChar_x + 1, gameChar_y + 1, gameChar_x + 20, gameChar_y + 1); // sole line
        noStroke();
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 2, 16, -20); // pants
        fill(0, 0, 255);
        ellipse(gameChar_x + 15, gameChar_y - 29, 12, 19); // belly
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 5, gameChar_y - 17, 8, -5); //hand
        fill(255);
        rect(gameChar_x + 5, gameChar_y - 23, 8, 2); // sleeve
        fill(0, 0, 255); // blue
        rect(gameChar_x + 1, gameChar_y - 22, 16, -23); // torso
        fill(255);
        quad(gameChar_x + 1, gameChar_y - 48, gameChar_x + 14, gameChar_y - 48,
        gameChar_x + 17, gameChar_y - 45, gameChar_x + 1, gameChar_y - 45); // collar
        fill(255, 0, 0);
        triangle(gameChar_x + 13, gameChar_y - 48, gameChar_x + 17, gameChar_y - 48,
        gameChar_x + 17, gameChar_y - 45); // tie knott
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 1, gameChar_y - 48, 16, -18); // head
        stroke(0); // black
        strokeWeight(2);
        point(gameChar_x + 17, gameChar_y - 59); // eye
        strokeWeight(0);
        fill(255, 255, 0);
        beginShape(); // hair
        vertex(gameChar_x + 1, gameChar_y - 53);
        vertex(gameChar_x + 1, gameChar_y - 69);
        vertex(gameChar_x + 17, gameChar_y - 69);
        vertex(gameChar_x + 20, gameChar_y - 71);
        vertex(gameChar_x + 25, gameChar_y - 71);
        vertex(gameChar_x + 17, gameChar_y - 63);
        endShape(CLOSE);
        strokeWeight(1);
    }
    else if (isFalling || isPlummeting) {
        // jumping facing forwards code
        fill(139, 69, 19); // brown
        rect(gameChar_x - 9, gameChar_y - 2, 16, -5); // shoes
        stroke(94, 49, 15); // dark brown
        line(gameChar_x - 9, gameChar_y - 4, gameChar_x + 6, gameChar_y - 4); //sole line
        noStroke();
        fill(0, 0, 255); // blue
        rect(gameChar_x - 9, gameChar_y - 7, 16, -20); // pants
        stroke(20);
        line(gameChar_x - 1, gameChar_y - 3, gameChar_x - 1, gameChar_y - 22); // division line
        noStroke();
        fill(0, 0, 255); // blue
        rect(gameChar_x - 15, gameChar_y - 27, 28, -23); // torso
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 9, gameChar_y - 22, -6, -5); //left hand
        fill(255);
        rect(gameChar_x - 9, gameChar_y - 27, -6, -2); // left sleeve
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 7, gameChar_y - 22, 6, -5); // right hand
        fill(255);
        rect(gameChar_x + 7, gameChar_y - 27, 6, -2); // right sleeve
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 9, gameChar_y - 53, 16, -18); // head
        fill(255); // white
        rect(gameChar_x - 9, gameChar_y - 53, 16, 3); // collar
        fill(255, 0, 0); // red
        triangle(gameChar_x - 1, gameChar_y - 50, gameChar_x - 3, gameChar_y - 53,
        gameChar_x + 1, gameChar_y - 53); // tie knott
        rect(gameChar_x - 3, gameChar_y - 50, 4, 19); // tie
        triangle(gameChar_x - 3, gameChar_y - 31, gameChar_x + 1, gameChar_y - 31,
        gameChar_x - 1, gameChar_y - 29);
        fill(245, 245, 27);
        beginShape(); // hair
        vertex(gameChar_x - 9, gameChar_y - 70);
        vertex(gameChar_x - 9, gameChar_y - 74);
        vertex(gameChar_x + 7, gameChar_y - 74);
        vertex(gameChar_x + 10, gameChar_y - 76);
        vertex(gameChar_x + 15, gameChar_y - 76);
        vertex(gameChar_x + 7, gameChar_y - 70);
        endShape(CLOSE);
        fill(40); // black-ish
        ellipse(gameChar_x - 1, gameChar_y - 57, 16, 6); // mouth
        stroke(0); // black
        line(gameChar_x - 7, gameChar_y - 63, gameChar_x - 5, gameChar_y - 65); // left eye
        line(gameChar_x - 5, gameChar_y - 65, gameChar_x - 3, gameChar_y - 63);
        line(gameChar_x, gameChar_y - 63, gameChar_x + 2, gameChar_y - 65); // right eye
        line(gameChar_x + 2, gameChar_y - 65, gameChar_x + 4, gameChar_y - 63);
    }
    else // standing front facing code
    {
        noStroke();
        // shoes
        fill(139, 69, 19); // brown
        rect(gameChar_x - 9, gameChar_y, 16, -5);
        // sole line
        stroke(94, 49, 15); // dark brown
        line(gameChar_x - 9, gameChar_y - 2, gameChar_x + 6, gameChar_y - 2);
        noStroke();
        // pants
        fill(0, 0, 255); // blue
        rect(gameChar_x - 9, gameChar_y - 5, 16, -20);
        stroke(20);
        // division line
        line(gameChar_x - 1, gameChar_y - 17, gameChar_x - 1, gameChar_y - 1);
        noStroke();
        // torso
        fill(0, 0, 255); // blue
        rect(gameChar_x - 15, gameChar_y - 22, 28, -23);
        fill(255, 0, 0)
        //tie
        rect(gameChar_x - 3, gameChar_y - 45, 4, 19);
        triangle(gameChar_x - 3, gameChar_y - 26, gameChar_x + 1, gameChar_y - 26,
        gameChar_x - 1, gameChar_y - 24);
        // hands and sleeves
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 9, gameChar_y - 17, -6, -5); //left hand
        fill(255);
        rect(gameChar_x - 9, gameChar_y - 22, -6, -2); // left sleeve
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x + 7, gameChar_y - 17, 6, -5); // right hand
        fill(255);
        rect(gameChar_x + 7, gameChar_y - 22, 6, -2); // right sleeve
        //head
        fill(255, 128, 0); // tramp orange
        rect(gameChar_x - 9, gameChar_y - 48, 16, -18);
        //neck
        fill(255); // white
        rect(gameChar_x - 9, gameChar_y - 48, 16, 3); // collar
        fill(255, 0, 0); // red
        triangle(gameChar_x - 1, gameChar_y - 45, gameChar_x - 3, gameChar_y - 48,
        gameChar_x + 1, gameChar_y - 48); // tie knott
        fill(245, 245, 27);
        beginShape(); // hair
        vertex(gameChar_x - 9, gameChar_y - 65);
        vertex(gameChar_x - 9, gameChar_y - 69);
        vertex(gameChar_x + 7, gameChar_y - 69);
        vertex(gameChar_x + 10, gameChar_y - 71);
        vertex(gameChar_x + 15, gameChar_y - 71);
        vertex(gameChar_x + 7, gameChar_y - 65);
        endShape(CLOSE);
        fill(40); // black-ish
        ellipse(gameChar_x - 1, gameChar_y - 52, 16, 1); // mouth
        stroke(0); // black
        strokeWeight(2);
        point(gameChar_x - 4, gameChar_y - 59); // left eye
        point(gameChar_x + 2, gameChar_y - 59); // right eye
        strokeWeight(1);
    }
}
// ---------------------------
// Background render functions
// ---------------------------
function drawClouds(){
      for (var i = 0; i < clouds.length; i++)
    {
        noStroke();
        fill(255);
        ellipse(clouds[i].x_pos , clouds[i].y_pos, clouds[i].radius * clouds[i].scale);
        ellipse(clouds[i].x_pos + (60 * clouds[i].scale), clouds[i].y_pos, clouds[i].radius * clouds[i].scale);
        ellipse(clouds[i].x_pos + (120 * clouds[i].scale), clouds[i].y_pos, clouds[i].radius * clouds[i].scale);
        if (wind == false){
            clouds[i].x_pos = clouds[i].x_pos + 0.15;
        };
        if (wind == true){
            clouds[i].x_pos = clouds[i].x_pos - 0.15;
        }
        if (clouds[i].x_pos > 2600){
            wind = true;
        };
        if (clouds[i].x_pos < -100){
            wind = false;
        };
    };
}

function drawMountains()
{
    for (var i=0; i < mountains.length; i++)
    {
        fill(139,69,19);//big mountain
        triangle(mountains[i].x_pos+400 * mountains[i].scale,mountains[i].y_pos-302 * mountains[i].scale,mountains[i].x_pos+540 * mountains[i].scale,mountains[i].y_pos,mountains[i].x_pos+240 * mountains[i].scale,mountains[i].y_pos);
        fill(245, 239, 239)
        triangle(mountains[i].x_pos+400 * mountains[i].scale,mountains[i].y_pos-302 * mountains[i].scale,mountains[i].x_pos+414 * mountains[i].scale,mountains[i].y_pos-272 * mountains[i].scale,mountains[i].x_pos+384 * mountains[i].scale,mountains[i].y_pos-272 * mountains[i].scale)
        fill(102,51,0);//small mountain
        triangle(mountains[i].x_pos+300 * mountains[i].scale,mountains[i].y_pos-202 * mountains[i].scale,mountains[i].x_pos+400 * mountains[i].scale,mountains[i].y_pos,mountains[i].x_pos+180 * mountains[i].scale,mountains[i].y_pos);
        fill(64,40,16,100);//shadow
        triangle(mountains[i].x_pos+120 * mountains[i].scale,mountains[i].y_pos+38 * mountains[i].scale,mountains[i].x_pos+400 * mountains[i].scale,mountains[i].y_pos,mountains[i].x_pos+180 * mountains[i].scale,mountains[i].y_pos);
    };
}

function drawTrees()
{
    for (var i =0; i<trees.x_pos.length; i++)
    {
        fill(115, 50, 6); //brown rect
        rect(trees.x_pos[i], trees.y_pos[i], trees.width * trees.scale[i], trees.height * trees.scale[i]);
        fill(34, 139, 34); //green rect
        ellipse(trees.x_pos[i]+(trees.width/2), trees.y_pos[i]+(trees.height*1.6), trees.radius * trees.scale[i]); //treetop
    }
}
// ---------------------------------
// canyons render and check functions
// -----------------------------
function drawCanyon(t_canyon)
{
    fill(37,53,41);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 150);
}

function checkCanyon(t_canyon)
{
    if ((gameChar_world_x > t_canyon.x_pos)&&(gameChar_world_x < t_canyon.x_pos+t_canyon.width)&&(gameChar_y >= floorPos_y)) {
        isPlummeting = true;
        isLeft = false;
        isRight = false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
function drawCollectable(t_collectable)
{
    fill(130);
    strokeWeight(1);
    stroke(0);
    rect(t_collectable.x_pos, t_collectable.y_pos, t_collectable.width * t_collectable.scale, t_collectable.height * t_collectable.scale);
    fill(255);
    textSize(t_collectable.scale * 6)
    text('FREEDOM', t_collectable.x_pos + (t_collectable.width / 10) * t_collectable.scale, t_collectable.y_pos + ((t_collectable.height / 1.5) * t_collectable.scale));

    fill(100);
    // top ellipse
    ellipse(t_collectable.x_pos + (t_collectable.width / 2) * t_collectable.scale, t_collectable.y_pos + (t_collectable.height * t_collectable.scale), t_collectable.width * t_collectable.scale, t_collectable.width * t_collectable.scale * 0.05);
    //middle ellipse
    ellipse(t_collectable.x_pos + (t_collectable.width / 2) * t_collectable.scale, t_collectable.y_pos + ((t_collectable.height / 2) * t_collectable.scale), t_collectable.width * t_collectable.scale, t_collectable.width * t_collectable.scale * 0.05);
    //bottom ellipse
    ellipse(t_collectable.x_pos + (t_collectable.width / 2) * t_collectable.scale, t_collectable.y_pos, t_collectable.width * t_collectable.scale, t_collectable.width * t_collectable.scale * 0.05);
}

function checkCollectable(t_collectable)
{
    if (dist (gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40*t_collectable.scale)
    {
        t_collectable.isFound = true;
        game_score += t_collectable.scale*10;
        usaSound.play();
    }
}

function renderFlagpole(){
    push()
    stroke(93,138,168);
    strokeWeight(3);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 205)
    if (flagpole.isReached){
        noStroke();
        fill(211,33,45)
        rect(flagpole.x_pos, floorPos_y - 200, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 194, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 188, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 182, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 176, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 170, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 164, 80, 3);
        fill(254,253,255)
        rect(flagpole.x_pos, floorPos_y - 197, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 191, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 185, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 179, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 173, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 167, 80, 3);
        fill(0,72,186)
        rect(flagpole.x_pos+52, floorPos_y - 182,28,21);
    }
    else{
        noStroke();
        fill(211,33,45)
        rect(flagpole.x_pos, floorPos_y - 70, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 64, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 58, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 52, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 46, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 40, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 34, 80, 3);
        fill(254,253,255)
        rect(flagpole.x_pos, floorPos_y - 67, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 61, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 55, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 49, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 43, 80, 3);
        rect(flagpole.x_pos, floorPos_y - 37, 80, 3);
        fill(0,72,186)
        rect(flagpole.x_pos+52, floorPos_y - 52,28,21);
    }
    pop()
}

function checkFlagpole(){
    var d = abs(gameChar_world_x - flagpole.x_pos)
        if (d < 30){
            flagpole.isReached = true;
        };
};

function createPlatform(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255,0,0);
            stroke(0);
            rect(this.x, this.y, this.length, 10);
        },
        checkContact: function(gc_x, gc_y){
        // check if game char is on the platform
            if (gc_x > this.x && gc_x < this.x + this.length){
                var d = this.y - gameChar_y;
                if ( d>=0 && d <5){
                return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x,y,range){
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function(){
        fill(255,204,153);
        rect(this.current_x,this.y - 50, 45,50);
        textSize(15);
        fill(0,0,0,20);
        text('imp',this.current_x+5,this.y-17);
        text('each',this.current_x+5,this.y-5);
        fill(255,0,0);
        ellipse(this.current_x + 20, this.y -37, 10);
        ellipse(this.current_x + 35, this.y -37, 10);
}
    
    this.update = function(){
        this.current_x += this.incr;
        if(this.current_x < this.x){
            this.incr = 1;
            this.y += 20;
        }
        else if(this.current_x > this.x + this.range){
            this.incr = -1;
            this.y -=20;
        }
    }
    
    this.isContact = function(gc_x, gc_y){
        if (dist(gc_x,gc_y,this.current_x, this.y) < 40){
            return true;
        }
        return false;
    }
}
/*<----- Commentary report ----->*/

/* In this report I will talk to more than one extension because I was so excited with the chance to use them that I skipped the part saying, “you can do this by opting for one of four possible extensions”.
Firstly, I have chosen the enemies extension because it made so much sense for my character. Through this choice, I have learned how to use a constructor function. This new type of function is more complex than any other that I have coded and although it makes sense after coded, while coding can easily be messy. I have learned that the constructor function makes the object for me. Additionally, it aggregates code of different objects into itself, avoiding rewriting the same code in different functions.
I also chose the sound extension to add more life to my game. Through the use of this extension I have learned the benefit of preload, how to use the sound library and how easier it is to add sound thanks to the existence of such code. Moreover, I have learned how to apply different types of sound into different situations and triggers hence making my game unique and hopefully appealing.
To complete the game, I also used platforms. This extension seemed easier than enemies, but I couldn’t figure it out the logic that was preventing my character from jumping when on a platform. I’m sure that the solution is way simpler than I think but I have not been able to deconstruct the issue to its core.
Overall, this extension made my game more interesting, unique and allowed to fulfil my vision on the game while learning more complex tools.
 */
/*Finished in 13/01/2020 @ 03:35*/