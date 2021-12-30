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

const MOVE_SPEED = 10;
let globalColor = 'red'; // DEBUG - TEMPORARY 

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
//        this.canvas = document.querySelector('body');
        this.canvasStyle = window.getComputedStyle(canvas);
        console.log(this.openPos.x, this.openPos.y);
    }


    update()
    {
    }

    handleKeyEvent()
    {
        // A Key - Move left
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

        // D Key - Move right
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

        // S Key
        if (keys[83])
        {
            this.players[0].yVel -= MOVE_SPEED;
            this.players[0].yPos -= game.players[0].yVel;
            this.players[0].sprite.style.top = game.players[0].yPos;
        }

        // W Key
        if (keys[87])
        {
            this.players[0].yVel += MOVE_SPEED;
            this.players[0].yPos += game.players[0].yVel;
            this.players[0].sprite.style.top = game.players[0].yPos;
        }

        // E Key - Add Enemy (Debug)
        if (keys[69])
        {
            if (this.openPos.x < SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
            {
                this.openPos.x += 70;
                this.addObject(new Enemy(this.canvas, this.openPos.x, this.openPos.y, 1, 7, 'images/enemy_ship.png'), 'enemy');
            } else if (this.openPos.x >= SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
            {
                this.openPos.x = 20;
                this.openPos.y += 70;
                this.addObject(new Enemy(this.canvas, this.openPos.x, this.openPos.y, 1, 7, 'images/enemy_ship.png'), 'enemy');
            } else
            {
                this.openPos.x = 20;
                this.openPos.y = 50;
                globalColor = 'green';
            }
        }

        // P Key - Debug
        if (keys[80])
        {
            console.log(this.players[0].xVel);
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
//                this.addDomElement(this.players[this.players.length - 1].sprite);
                break;
            case('enemy'):
                this.enemies.push(object);
//                this.addDomElement(this.enemies[this.enemies.length - 1].sprite);
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
        for (let i = 0; i < this.players.length; i++)
        {
            this.players[i].updateSprite();
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].updateSprite();
        }
    }


    quit()
    {
        console.log('Exiting game');
    }


    debug()
    {
        console.log("X: ", this.players[0].sprite.style.left)
        console.log("Y: ", this.players[0].sprite.style.top)
        console.log(SCREEN_WIDTH, ', ', SCREEN_HEIGHT)
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
        const that = this;
        console.log('Position: ', this.xPos, this.yPos);
        let self = this;
        img.onload = function() {
//            self.canvas.width = this.naturalWidth;
//            self.canvas.height = this.naturalHeight;
            self.sprite.draw(context, self.pos, self.xPos, self.yPos);
        };
//        this.sprite.style.boxShadow = '1px 1px rgba(20, 20, 20, 1)';
    }

    updateSprite()
    {
        this.sprite.draw(this.canvas.getContext('2d'), this.pos, this.xPos, this.yPos);
    }
}


class Ship extends Obj
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames);
    }
}


class Player extends Ship
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames);

        this.genSprites(0, 0);
        this.xVel = 0;
        this.yVel = 0;

    }
}


class Enemy extends Ship
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames);

        this.genSprites(6, 0);
        this.xVel = 0;
        this.yVel = 0;
    }
}


class Projectile extends Obj
{
    constructor(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames)
    {
        super(canvas, xPos, yPos, imgPath, nSpriteSheetRows, nSpriteSheetCols, spriteFrames);
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
            SPRITE_WIDTH,
            SPRITE_HEIGHT);
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    game.addObject(new Player(game.canvas, SCREEN_WIDTH / 2, SCREEN_HEIGHT - (SCREEN_HEIGHT / 10), 1, 7, 'images/player_ship.png'), 'player');
    game.addObject(new Enemy(game.canvas, 20, 50, 'images/enemy_ship.png'), 'enemy');

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