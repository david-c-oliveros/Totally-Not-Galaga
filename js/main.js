/*****************************/
/*         Constants         */
/*****************************/

const SCREEN_WIDTH = document.querySelector('canvas').width;
const SCREEN_HEIGHT = document.querySelector('canvas').height;

// Sprite constants
const SPRITE_SHEETS = ['images/galaga_general_spritesheet_alpha.png', 'images/galaga_screens_and_text_spritesheet.png'];
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 2;
const SPRITE_SCALE = 3;

const BIG_SPRITE_WIDTH = 32;
const BIG_SPRITE_HEIGHT = 32;

// Audio
const AUDIO_FILES = ['audio/8bit_explosion.wav', 'audio/8bit_laser.wav', 'audio/8bit_hit.wav']
const AUDIO_VOL = 0.5

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
let difficultyScalar = 0.8;




/*****************************/
/*          Classes          */
/*****************************/

class Game
{

    constructor()
    {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.players = [];
        this.enemies = [];
        this.nEnemies = [{type: 1, num:  4, rows: 1},
                         {type: 3, num: 20, rows: 2},
                         {type: 4, num: 24, rows: 2}];

        this.renderedEntities = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.renderQueue = [];

        this.spriteSheets = [];
        this.loadSpriteSheets();
    }


    loadSpriteSheets()
    {
        for (let i = 0; i < SPRITE_SHEETS.length; i++)
        {
            this.spriteSheets[i] = new Image();
            this.spriteSheets[i].src = SPRITE_SHEETS[i];
        }
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
        let startX;
        let x;
        let y;
        let yRest;
        const startY = -100;
        let openRow = 0;
        for (let i = 0; i < this.nEnemies.length; i++)
        {
            for (let j = 0; j < this.nEnemies[i].rows; j++)
            {
                startX = ((SCREEN_WIDTH / 2) - (this.nEnemies[i].num / (2 * this.nEnemies[i].rows)) * spacing);
                yRest = 100 + (openRow * spacing);
                for (let k = 0; k < this.nEnemies[i].num / this.nEnemies[i].rows; k++)
                {
                    x = startX + (k * spacing);
                    y = startY - (openRow * spacing);
                    this.addObject(new Enemy(this.canvas, x, y, yRest, this.spriteSheets[0], 1, 8, this.nEnemies[i].type), 'enemy');
                }
                openRow++;
            }
        }
    }


    handleKeyEvent()
    {
        /*********************************/
        /*       A Key - Move Left       */
        /*********************************/
        if (keys[65] && !this.players[0].hit)
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
        if (keys[68] && !this.players[0].hit)
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
        if (keys[32] && !this.players[0].coolDown && !this.players[0].hit)
        {
            const audio = new Audio(AUDIO_FILES[1]);
            audio.volume = AUDIO_VOL;
            audio.play();
            this.addObject(new Projectile(this.canvas, this.players[0].xPos, this.players[0].yPos - (SPRITE_HEIGHT * SPRITE_SCALE),
                                          this.spriteSheets[0], 1, 1, 'player'), 'player-projectile');
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

        if (tickCount % 50 === 0)
        {
            if (this.players[0].hit)
            {
            this.players[0].hit = false;
            }
        }

        /********************************/
        /*        Update Enemies        */
        /********************************/
        for (let i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].currentState === 'entering')
            {
                if (this.enemies[i].yPos >= this.enemies[i].restingYPos)
                {
                    this.enemies[i].currentState = 'resting';
                }
            }
            if (this.enemies[i].update())
            {
                this.addObject(new Projectile(this.canvas, this.enemies[i].xPos + 3, this.enemies[i].yPos + (SPRITE_HEIGHT * SPRITE_SCALE * 0.1),
                                              this.spriteSheets[0], 1, 1, 'enemy'), 'enemy-projectile');
            }
        }

        /************************************/
        /*        Update Projectiles        */
        /************************************/
        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            this.playerProjectiles[i].update(1);
        }

        for (let i = 0; i < this.enemyProjectiles.length; i++)
        {
            this.enemyProjectiles[i].update(-1);
        }

        /***************************************/
        /*        Update Other Entities        */
        /***************************************/
        for (let i = 0; i < this.renderedEntities.length; i++)
        {
            this.renderedEntities[i].update();
            if (this.renderedEntities[i].destroyed)
            {
                this.removeObject(this.renderedEntities, i);
            }
        }


        /************************************/
        /*         Check Enemy Hits         */
        /************************************/
        for (let i = 0; i < this.enemies.length; i++)
        {
            for (let j = 0; j < this.playerProjectiles.length; j++)
            {
                if (this.collide(this.playerProjectiles[j], this.enemies[i]))
                {
                    // Handle collision
                    const audio = new Audio(AUDIO_FILES[2]);
                    audio.volume = AUDIO_VOL * 0.7;
                    audio.play();
                    if (this.enemies[i].enemyType <= 2)
                    {
                        this.players[0].score += 80;
                    } else
                    {
                        this.players[0].score += 50;
                    }
                    this.explode(this.enemies[i].xPos - SPRITE_WIDTH - 5, this.enemies[i].yPos - SPRITE_HEIGHT - 5, 2);
                    this.removeObject(this.enemies, i);
                    this.removeObject(this.playerProjectiles, j);
                }
            }
        }

        /*************************************/
        /*         Check Player Hits         */
        /*************************************/
        for (let i = 0; i < this.players.length; i++)
        {
            for (let j = 0; j < this.enemyProjectiles.length; j++)
            {
                if (this.collide(this.enemyProjectiles[j], this.players[i]) && !this.players[i].hit)
                {
                    // Handle collision
                    const audio = new Audio(AUDIO_FILES[0]);
                    audio.volume = AUDIO_VOL;
                    audio.play();
                    this.removeObject(this.enemyProjectiles, j);
                    this.players[i].lives--;
                    this.players[i].hit = true;
                    this.explode(this.players[i].xPos - SPRITE_WIDTH - 5, this.players[i].yPos - SPRITE_HEIGHT - 5, 1);
                    console.log("Lives:", this.players[i].lives);
                }
            }
        }

        /********************************************/
        /*       Remove Offscreen Projectiles       */
        /********************************************/
        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            if (this.playerProjectiles[i].yPos < -(SPRITE_HEIGHT + 25))
            {
                this.removeObject(this.playerProjectiles, i);
            }
        }

        for (let i = 0; i < this.enemyProjectiles.length; i++)
        {
            if (this.enemyProjectiles[i].yPos > SCREEN_HEIGHT - (SPRITE_HEIGHT + 5))
            {
                this.removeObject(this.enemyProjectiles, i);
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
            case('player-projectile'):
                this.playerProjectiles.push(object);
                break;
            case('enemy-projectile'):
                this.enemyProjectiles.push(object);
                break;
            case('explosion'):
                this.renderedEntities.push(object);
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

        for (let i = 0; i < this.enemyProjectiles.length; i++)
        {
            this.enemyProjectiles[i].spriteFrames[0].draw(this.canvas.getContext('2d'), this.enemyProjectiles[i].xPos, this.enemyProjectiles[i].yPos);
        }

        for (let i = 0; i < this.renderedEntities.length; i++)
        {
            this.renderedEntities[i].spriteFrames[this.renderedEntities[i].currentFrame].drawBig(this.canvas.getContext('2d'), this.renderedEntities[i].xPos, this.renderedEntities[i].yPos);
        }
    }


    quit()
    {
        console.log('Exiting game');
    }

    explode(xPos, yPos, type)
    {

        const explosion = new Explosion(this.canvas, xPos, yPos, this.spriteSheets[0], type);
        this.addObject(explosion, 'explosion');
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
        this.hit = false;
    }
}



class Enemy extends Obj
{
    constructor(canvas, xPos, yPos, restingYPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, enemyType)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.enemyType = enemyType;
        this.genSprites(spriteSheet, this.enemyType + 1, 0);
        this.currentState = 'entering';
        this.xVel = 0;
        this.yVel = 0;
        this.restingYPos = restingYPos;
    }

    update()
    {
        let fire = false;
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
                if (Math.floor(Math.random() * 500 * difficultyScalar) === 0)
                {
                    fire = true;
                }
                break;
            case('attacking'):
                break;
        }

        return fire;
    }
}



class Projectile extends Obj
{
    constructor(canvas, xPos, yPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, type)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);
        switch(type)
        {
            case('player'):
                this.genSprites(spriteSheet, 7.5, 17);
                break;
            case('enemy'):
                this.genSprites(spriteSheet, 6.5, 17);
        }
        this.xPos = xPos;
        this.yPos = yPos;
        this.yVel = 30;
    }

    update(direction)
    {
        this.yPos -= this.yVel * direction;
    }
}



class Explosion extends Obj
{
    constructor(canvas, xPos, yPos, spriteSheet, type)
    {
        super(canvas, xPos, yPos);
        if (type === 1)
        {
            this.nSpriteSheetRows = 1;
            this.nSpriteSheetCols = 4;
            this.genSprites(spriteSheet, 0, 4.2353)
            this.speed = 4;
        } else {
            this.nSpriteSheetRows = 1;
            this.nSpriteSheetCols = 5;
            this.genSprites(spriteSheet, 0, 8.48)
            this.speed = 2;
        }
        this.destroyed = false;
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
                sheetPos = spritePosToImagePosMedium(spriteStartRow + i, spriteStartCol + j);
                this.spriteFrames[i + j] = new Sprite(this.canvas, spriteFile, BIG_SPRITE_WIDTH, BIG_SPRITE_HEIGHT, sheetPos, BORDER_WIDTH, SPACING_WIDTH);
            }
        }
    }

    update()
    {
        if (tickCount % this.speed === 0)
        {
            if (this.currentFrame === this.spriteFrames.length - 1)
            {
                this.currentFrame = 0;
                this.destroyed = true;
            } else {
                this.currentFrame++;
            }
        }
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

    drawBig(context, xPos, yPos)
    {
        context.drawImage(
            this.spriteSheet,
            this.sheetPos.x,
            this.sheetPos.y,
            BIG_SPRITE_WIDTH - 0.5,
            BIG_SPRITE_HEIGHT,
            xPos, yPos,
            BIG_SPRITE_WIDTH * SPRITE_SCALE,
            BIG_SPRITE_HEIGHT * SPRITE_SCALE);
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    game.generateLevel();
    game.update();

//    const explosion =  new Explosion(game.canvas, 50, 50, game.spriteSheets[0], 1, 4);
//    game.addObject(explosion, 'explosion');


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
                col * (SPACING_WIDTH + BIG_SPRITE_WIDTH)
        ),
        y: (
            BORDER_WIDTH +
            row * (SPACING_WIDTH + BIG_SPRITE_HEIGHT)
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


let context = game.canvas.getContext('2d');

init();
window.requestAnimationFrame(gameLoop);
