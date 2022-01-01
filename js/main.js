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
        this.players = [];
        this.enemies = [];
//        this.nEnemies = [4, 10, 10, 12, 12];
        this.nEnemies = [4, 20, 24];
        this.spriteSheets = [];
        this.playerProjectiles = [];
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvasStyle = window.getComputedStyle(canvas);
    }


    generateLevel()
    {
        /*********************************/
        /*        Add Player Ship        */
        /*********************************/
        const playerPos = (SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
        this.addObject(new Player(this.canvas, playerPos, SCREEN_HEIGHT - (SCREEN_HEIGHT / 7), this.spriteSheets[0], 1, 7), 'player');

        /*********************************/
        /*          Add Enemies          */
        /*********************************/
        const spacing = 1.2 * SPRITE_WIDTH * SPRITE_SCALE;
        console.log("Spacing:", spacing);
        let startX;
        let x;
        let y;
        const startY = 50;
        for (let i = 0; i < this.nEnemies.length; i++)
        {
            startX = ((SCREEN_WIDTH / 2) - (this.nEnemies[i] / 2) * spacing);
            for (let j = 0; j < this.nEnemies[i]; j++)
            {
                x = startX + (j * spacing);
                y = startY - (i * spacing);
                this.addObject(new Enemy(this.canvas, x, y, 100 + (i * spacing), this.spriteSheets[0], 1, 8, i), 'enemy');
            }
        }
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
        /*       Space Key - Fire Projectile       */
        /*******************************************/
        if (keys[32] && !this.players[0].coolDown)
        {
            this.addObject(new Projectile(this.canvas, this.players[0].xPos, this.players[0].yPos - (SPRITE_HEIGHT * SPRITE_SCALE),
                                          this.spriteSheets[0], 1, 1), 'projectile');
            this.players[0].coolDown = true;
        }
    }


    update()
    {
        if (tickCount % 10 === 0)
        {
            if (this.players[0].coolDown === true)
            {
                this.players[0].coolDown = false;
            }
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].currentState === 'entering')
            {
                if (this.enemies[i].yPos >= this.enemies[i].restingYPos)
                {
                    this.enemies[i].currentState = 'resting';
                }
            }
            this.enemies[i].update();
        }

        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            this.playerProjectiles[i].update();
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            for (let j = 0; j < this.playerProjectiles.length; j++)
            {
                if (this.collide(this.playerProjectiles[j], this.enemies[i]))
                {
                    // Handle collision
                    this.removeObject(this.enemies, i);
                    this.players[0].score += 50;
                }
            }
        }
    }


    collide(first, second)
    {
        if (first === undefined || second === undefined)
        {
            return false;
        }

        let firstLeft    = first.xPos;
        let firstRight   = first.xPos + (SPRITE_WIDTH * SPRITE_SCALE / 1.5);
        let firstTop     = first.yPos;
        let firstBottom  = first.yPos + (SPRITE_HEIGHT * SPRITE_SCALE / 1.5);

        let secondLeft   = second.xPos;
        let secondRight  = second.xPos + (SPRITE_WIDTH * SPRITE_SCALE / 1.5);
        let secondTop    = second.yPos;
        let secondBottom = second.yPos + (SPRITE_HEIGHT * SPRITE_SCALE / 1.5);

        return !(firstRight < secondLeft || firstLeft > secondRight || firstTop > secondBottom || firstBottom < secondTop);
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
                this.playerProjectiles.push(object);
                break;
        }
    }


    removeObject(array, index)
    {
        array.splice(index, 1);
    }


    render()
    {
        this.context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        for (let i = 0; i < this.players.length; i++)
        {
            document.querySelector('#score').innerText = `Score: ${this.players[i].score}`;
            this.players[i].spriteFrames[this.players[i].currentFrame].draw(this.canvas.getContext('2d'), this.players[i].xPos, this.players[i].yPos);
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].spriteFrames[this.enemies[i].currentFrame].draw(this.canvas.getContext('2d'), this.enemies[i].xPos, this.enemies[i].yPos);
        }

        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            this.playerProjectiles[i].spriteFrames[0].draw(this.canvas.getContext('2d'), this.playerProjectiles[i].xPos, this.playerProjectiles[i].yPos);
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
                sheetPos = spritePosToImagePosSmall(spriteStartRow + i, spriteStartCol + j);
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

        this.lives = 3;
        this.score = 0;
    }
}



class Enemy extends Obj
{
    constructor(canvas, xPos, yPos, restingYPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, enemyType)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.enemyType = enemyType;
        this.genSprites(spriteSheet, this.enemyType + 2, 0);
        this.currentState = 'entering';
        this.xVel = 0;
        this.yVel = 0;
        this.restingYPos = restingYPos;
    }

    update()
    {
        switch(this.currentState)
        {
            case('entering'):
                this.yPos += MOVE_SPEED / 2;
                if (tickCount % 10 === 0)
                {
                    if (this.currentFrame != this.nSpriteSheetCols - 1)
                    {
                        this.currentFrame = this.nSpriteSheetCols - 1;
                    } else {
                        this.currentFrame = this.nSpriteSheetCols - 2;
                    }
                }
                break;
            case('resting'):
                if (tickCount % 10 === 0)
                {
                    if (this.currentFrame != this.nSpriteSheetCols - 1)
                    {
                        this.currentFrame = this.nSpriteSheetCols - 1;
                    } else {
                        this.currentFrame = this.nSpriteSheetCols - 2;
                    }
                }
                break;
            case('attacking'):
                break;
        }
    }

    destroy()
    {
    }
}



class Projectile extends Obj
{
    constructor(canvas, xPos, yPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);
        this.genSprites(spriteSheet, 6.5, 17);
        this.xPos = xPos;
        this.yPos = yPos;
        this.yVel = 30;
    }

    update()
    {
        this.yPos -= this.yVel;
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
    game.generateLevel();
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
