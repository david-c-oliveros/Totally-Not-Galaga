/*****************************/
/*         Constants         */
/*****************************/
//const SCREEN_WIDTH = document.querySelector('canvas').offsetWidth;
//const SCREEN_HEIGHT = document.querySelector('canvas').offsetHeight;
const SCREEN_WIDTH = document.querySelector('canvas').width;
const SCREEN_HEIGHT = document.querySelector('canvas').height;

// Sprite constants
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 2;
const SPRITE_SCALE = 3;

const MOVE_SPEED = 10;

console.log('Screen width: ',   SCREEN_WIDTH);
console.log('Screen height: ',   SCREEN_HEIGHT);




/**********************************/
/*        Global Variables        */
/**********************************/
 
let keys = [];




/*****************************/
/*          Classes          */
/*****************************/

class Game
{

    constructor()
    {
        // Next available position for an enemy *****TEMPORARY*****
        this.openPos = {
            x: 20,
            y: 50
        }

        this.players = [];
        this.enemies = [];
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvasStyle = window.getComputedStyle(canvas);
        console.log(this.openPos.x, this.openPos.y);
    }


    update()
    {
    }

    handleKeyEvent()
    {
        /*********************************/
        /*       A Key - Move Left       */
        /*********************************/
        if (keys[65])
        {
            if (this.players[0].xPos < 0)
            {
                this.players[0].xPos = 1;
            } else
            {
                this.players[0].xVel -= MOVE_SPEED;
                this.players[0].xPos += this.players[0].xVel;
            }
        } else
        {
            this.players[0].xVel = 0;
        }

        /**********************************/
        /*       D Key - Move Right       */
        /**********************************/
        if (keys[68])
        {
            if (this.players[0].xPos > SCREEN_WIDTH)
            {
                this.players[0].xPos = SCREEN_WIDTH - 1;
            } else
            {
                this.players[0].xVel += MOVE_SPEED;
                this.players[0].xPos += this.players[0].xVel;
            }
        } else
        {
            this.players[0].xVel = 0;
        }

//        /*******************************/
//        /*       W Key - Move Up       */
//        /*******************************/
//        if (keys[87])
//        {
//            if (this.players[0].yPos < 0)
//            {
//                this.players[0].yPos = 1;
//            } else
//            {
//                this.players[0].yVel -= MOVE_SPEED;
//                this.players[0].yPos += this.players[0].yVel;
//            }
//        } else
//        {
//            this.players[0].yVel = 0;
//        }
//
//        /*********************************/
//        /*       S Key - Move Down       */
//        /*********************************/
//        if (keys[83])
//        {
//            if (this.players[0].yPos > SCREEN_HEIGHT)
//            {
//                this.players[0].yPos = SCREEN_HEIGHT - 1;
//            } else
//            {
//                this.players[0].yVel += MOVE_SPEED;
//                this.players[0].yPos += this.players[0].yVel;
//            }
//        } else
//        {
//            this.players[0].yVel = 0;
//        }


//        /*****************************************/
//        /*       E Key - Add Enemy (Debug)       */
//        /*****************************************/
//        if (keys[69])
//        {
//            if (this.openPos.x < SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
//            {
//                this.openPos.x += SPRITE_WIDTH;
//                this.addObject(new Enemy(this.canvas, this.openPos.x, this.openPos.y, '', 1, 7), 'enemy');
//            } else if (this.openPos.x >= SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
//            {
//                this.openPos.x = 20;
//                this.openPos.y += SPRITE_HEIGHT;
//                this.addObject(new Enemy(this.canvas, this.openPos.x, this.openPos.y, '', 1, 7), 'enemy');
//            } else
//            {
//                this.openPos.x = 20;
//                this.openPos.y = 50;
//            }
//        }

        // P Key - Debug
        if (keys[80])
        {
            this.debug();
        }

        // Space Key - Fire projectile
        if (keys[32])
        {
            this.addObject(new Projectile(this.players[0].xPos, this.players[0].yPos), 'projectile');
        }
    }


    addObject(object, type)
    {
        switch(type)
        {
            case('player'):
                this.players.push(object);
                break;
            case('enemy'):
                this.enemies.push(object);
                break;
            case('projectile'):
                console.log('Fired projectile');
                break;
        }
    }


    addDomElement(element)
    {
        this.canvas.appendChild(element);
    }


    render()
    {
        this.context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        for (let i = 0; i < this.players.length; i++)
        {
            this.players[i].sprite.draw(this.canvas.getContext('2d'), this.players[i].pos, this.players[i].xPos, this.players[i].yPos);
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].sprite.draw(this.canvas.getContext('2d'), this.enemies[i].pos, this.enemies[i].xPos, this.enemies[i].yPos);
        }
    }


    quit()
    {
        console.log('Exiting game');
    }


    debug()
    {
        // Put any console logs here
    }
}



class Obj
{
    constructor(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols, imgPath = 'images/player.png')
    {
        this.canvas = canvas;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imgPath = imgPath;
        this.nSpriteSheetRows = nSpriteSheetRows;
        this.nSpriteSheetCols = nSpriteSheetCols;
        this.spriteFrames = [];
    }

    genSprites(spriteStartRow, spriteStartCol)
    {
        for (let i = 0; i < this.nSpriteSheetRows; i++)
        {
            for (let j = 0; j < this.nSpriteSheetCols; j++)
            {
                // Add sprite frames to object's sprite array
            }
        }
        this.pos = spritePosToImagePos(spriteStartRow, spriteStartCol);
        this.sprite = new Sprite(this.canvas, img, this.pos.x, this.pos.y, this.nSpriteSheetRows, this.nSpriteSheetCols, BORDER_WIDTH, SPACING_WIDTH)
        let self = this;
        img.onload = function() {
//            self.canvas.width = this.naturalWidth;
//            self.canvas.height = this.naturalHeight;
            self.sprite.draw(context, self.pos, self.xPos, self.yPos);
        };
    }
}


class Player extends Obj
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols);

        this.genSprites(0, 6);
        this.xVel = 0;
        this.yVel = 0;

    }
}


class Enemy extends Obj
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, enemyNum)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols);

        this.enemyNum = enemyNum + 2;
        this.genSprites(this.enemyNum, 0);
        this.xVel = 0;
        this.yVel = 0;
    }
}


class Projectile extends Obj
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols);
        this.xPos = xPos;
        this.yPos = yPos;
    }
}


class Sprite
{
    constructor(canvas, spriteSheet, spriteWidth, spriteHeight, startRow, startCol, nRows, nCols, borderWidth, spacingWidth)
    {
        this.canvas = canvas;
        this.spriteSheet = spriteSheet;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.borderWidth = borderWidth;
        this.spacingWidth = spacingWidth;
        this.startRow = startRow;
        this.startCol = startCol;
        this.nRows = nRows;
        this.nCols = nCols;
        this.spriteImage = new Image();
        this.spriteImage.src = this.spriteSheet;
    }

    draw(context, sheetPos, xPos, yPos)
    {
        context.drawImage(
            this.spriteSheet,
            sheetPos.x,
            sheetPos.y,
            SPRITE_WIDTH,
            SPRITE_HEIGHT,
            xPos, yPos,
            SPRITE_WIDTH * SPRITE_SCALE,
            SPRITE_HEIGHT * SPRITE_SCALE);
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    // First we'll add our player spaceship
    const playerPos = (SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
    console.log('Player Position:', playerPos);
    console.log('Screen Width:', SCREEN_WIDTH);
    game.addObject(new Player(game.canvas, playerPos, SCREEN_HEIGHT - (SCREEN_HEIGHT / 7), 1, 7, 'images/player_ship.png'), 'player');

    // Lets add an assortment of differnet enemies to test the API
    const nEnemies = 10;
    const spacing = 1.2;
    const startPos = (SCREEN_WIDTH / 2) - ((nEnemies / 2) * SPRITE_WIDTH * spacing * SPRITE_SCALE);
    let eNum;
    for (let i = 0; i < nEnemies; i++)
    {
        eNum = Math.floor(Math.random() * 10);
        console.log('eNum:', eNum);
        game.addObject(new Enemy(game.canvas, (i * SPRITE_WIDTH * spacing * SPRITE_SCALE) + startPos, 50, '', 1, 7, eNum), 'enemy');
    }


    // Event Listeners
    document.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
    });

    document.addEventListener('keyup', function(e) {
        console.log(e.keyCode);
        delete keys[e.keyCode];
    });

//    setInterval(gameLoop, 2000);
}

function spritePosToImagePos(row, col)
{
    return {
        x: (
            BORDER_WIDTH +
                col * (SPACING_WIDTH + SPRITE_WIDTH)
        ),
        y: (
            BORDER_WIDTH +
            row * (SPACING_WIDTH + SPRITE_HEIGHT)
        )
    }
}

function gameLoop()
{
    game.handleKeyEvent();

    game.update();
    game.render();
    window.requestAnimationFrame(gameLoop);
}




/******************************/
/*            Main            */
/******************************/

const game = new Game();

//game.addObject(500, 500, 'images/enemy.png');
const img = new Image();
img.src = 'images/galaga_general_spritesheet.png';
let context = game.canvas.getContext('2d');
//let pos = spritePosToImagePos(4, 3);
//let sprite = new Sprite(game.canvas, img, pos.x, pos.y, 1, 7, BORDER_WIDTH, SPACING_WIDTH)
//img.onload = sprite.draw(context, pos, 100, 100);
//img.onload = sprite.draw;
/*
img.onload = function() {
    game.canvas.width = this.naturalWidth;
    game.canvas.height = this.naturalHeight;
    sprite.draw(context, pos, 100, 100);
};
*/

init();
window.requestAnimationFrame(gameLoop);
