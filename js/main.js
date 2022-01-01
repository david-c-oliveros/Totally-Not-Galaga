/*****************************/
/*         Constants         */
/*****************************/

const SCREEN_WIDTH = document.querySelector('canvas').width;
const SCREEN_HEIGHT = document.querySelector('canvas').height;

// Sprite constants
const SPRITE_SHEETS = ['images/galaga_general_spritesheet.png', 'galaga_screens_and_text_spritesheet.png'];
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 2;
const SPRITE_SCALE = 3;

const GAME_TICK = 20;
const MOVE_SPEED = 10;

console.log('Screen width: ',   SCREEN_WIDTH);
console.log('Screen height: ',   SCREEN_HEIGHT);




/**********************************/
/*        Global Variables        */
/**********************************/
 
let keys = [];
let t1 = new Date().getTime();
let t2 = new Date().getTime();
let elapsedTime = 0;
let executeTime = 0;
let tickCount = 0;




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
        this.spriteSheets = [];
        this.projectiles = [];
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvasStyle = window.getComputedStyle(canvas);
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

        /*******************************************/
        /*       Space Key - FIre Projectile       */
        /*******************************************/
        if (keys[32] && !this.players[0].coolDown)
        {
            this.addObject(new Projectile(this.canvas, this.players[0].xPos, this.players[0].yPos - (SPRITE_HEIGHT * SPRITE_SCALE), 1, 1), 'projectile');
            this.players[0].coolDown = true;
        }
    }


    update()
    {
        if (tickCount % 5 === 0)
        {
            for (let i = 0; i < this.enemies.length; i++)
            {
                this.enemies[i].update();
            }
        }

        for (let i = 0; i < game.projectiles.length; i++)
        {
            game.projectiles[i].yPos -= 10;
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
                this.projectiles.push(object);
                break;
        }
    }


    render()
    {
        this.context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        for (let i = 0; i < this.players.length; i++)
        {
            this.players[i].spriteFrames[this.players[i].currentFrame].draw(this.canvas.getContext('2d'), this.players[i].xPos, this.players[i].yPos);
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].spriteFrames[this.enemies[i].currentFrame].draw(this.canvas.getContext('2d'), this.enemies[i].xPos, this.enemies[i].yPos);
        }

        for (let i = 0; i < this.projectiles.length; i++)
        {
            this.projectiles[i].spriteFrames[0].draw(this.canvas.getContext('2d'), this.projectiles[i].xPos, this.projectiles[i].yPos);
        }
    }


    checkCollision()
    {
        for (let i = 0; i < this.enemies.length; i++)
        {
            for (let j = 0; j < this.projectiles.length; j++)
            {
                if (Math.abs(this.projectiles[j].xPos - this.enemies[i].xPos) < 10 && Math.abs(this.projectiles[j].yPos - this.enemies[i].yPos < 10))
                {
                    this.enemies[i].state = 'exploding';
                }
            }
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
    constructor(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
        this.canvas = canvas;
        this.xPos = xPos;
        this.yPos = yPos;
        this.nSpriteSheetRows = nSpriteSheetRows;
        this.nSpriteSheetCols = nSpriteSheetCols;
        this.spriteFrames = [];
        this.currentFrame = 0;
    }

    genSprites(spriteFile, spriteStartRow, spriteStartCol)
    {
        let sheetPos;
        for (let i = 0; i < this.nSpriteSheetRows; i++)
        {
            for (let j = 0; j < this.nSpriteSheetCols; j++)
            {
                // Add sprite frames to object's sprite array
                sheetPos = spritePosToImagePos(spriteStartRow + i, spriteStartCol + j);
                this.spriteFrames[i + j] = new Sprite(this.canvas, spriteFile, SPRITE_WIDTH, SPRITE_HEIGHT, sheetPos, BORDER_WIDTH, SPACING_WIDTH);
            }
        }
    }
}



class Player extends Obj
{
    constructor(canvas, xPos, yPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, nExplodeSpriteSheetRows = 1, nExplodeSpriteSheetCols = 5)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.genSprites(spriteSheet, 0, 6);
        this.xVel = 0;
        this.yVel = 0;
        this.coolDown = false;
        this.currentSpriteFrames = 0;
    }
}



class Enemy extends Obj
{
    constructor(canvas, xPos, yPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, enemyNum)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.enemyNum = enemyNum + 2;
        this.genSprites(spriteSheet, this.enemyNum, 0);
        this.currentState = 'resting';
        this.xVel = 0;
        this.yVel = 0;
    }

    update()
    {
        switch(this.currentState)
        {
            case('resting'):
                if (this.currentFrame != this.nSpriteSheetCols - 1)
                {
                    this.currentFrame = this.nSpriteSheetCols - 1;
                } else {
                    this.currentFrame = this.nSpriteSheetCols - 2;
                }
                break;
            case('attacking'):
                break;
            case('exploding'):
                break;
        }
    }

    destroy()
    {
    }
}



class Projectile extends Obj
{
    constructor(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);
        this.genSprites(6.5, 17);
        this.xPos = xPos;
        this.yPos = yPos;
        this.yVel = 10;
    }

    update()
    {
        this.yPos += this.yVel;
    }
}



class Explosion extends Obj
{
    constructor(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
    }
}


class Sprite
{
    constructor(canvas, spriteSheet, spriteWidth, spriteHeight, sheetPos, borderWidth, spacingWidth)
    {
        this.canvas = canvas;
        this.spriteSheet = spriteSheet;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.borderWidth = borderWidth;
        this.spacingWidth = spacingWidth;
        this.sheetPos = sheetPos;
        this.spriteImage = new Image();
        this.spriteImage.src = this.spriteSheet;
    }

    draw(context, xPos, yPos)
    {
        context.drawImage(
            this.spriteSheet,
            this.sheetPos.x,
            this.sheetPos.y,
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
    // First we'll add our elayer spaceship
    const playerPos = (SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
    game.addObject(new Player(game.canvas, playerPos, SCREEN_HEIGHT - (SCREEN_HEIGHT / 7), game.spriteSheets[0], 1, 7), 'player');

    // Lets add an assortment of differnet enemies to test the API
    const nEnemies = 10;
    const spacing = 1.2;
    const startPos = (SCREEN_WIDTH / 2) - ((nEnemies / 2) * SPRITE_WIDTH * spacing * SPRITE_SCALE);
    let eNum;
    for (let i = 0; i < nEnemies; i++)
    {
        eNum = Math.floor(Math.random() * 4);
        game.addObject(new Enemy(game.canvas, (i * SPRITE_WIDTH * spacing * SPRITE_SCALE) + startPos, 50, game.spriteSheets[0], 1, 8, eNum), 'enemy');
    }

    game.update();


    // Event Listeners
    document.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
    });

    document.addEventListener('keyup', function(e) {
        delete keys[e.keyCode];
    });
}

function spritePosToImagePosSmall(row, col)
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

function spritePosToImagePosMedium(row, col)
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
    t2 = new Date().getTime();
    elapsedTime = t2 - t1;
    t1 = t2;
    executeTime += elapsedTime;

    if (tickCount > 9000000000)
    {
        tickCount = 0;
    }

    if (executeTime >= GAME_TICK)
    {
        tickCount++;
        game.update();
        executeTime = 0;
    }

    game.handleKeyEvent();

    game.render();
    window.requestAnimationFrame(gameLoop);
}




/******************************/
/*            Main            */
/******************************/

const game = new Game();
game.spriteSheets = [];

for (let i = 0; i < SPRITE_SHEETS.length; i++)
{
    game.spriteSheets[i] = new Image();
    game.spriteSheets[i].src = SPRITE_SHEETS[i];
}

let context = game.canvas.getContext('2d');

init();
window.requestAnimationFrame(gameLoop);
