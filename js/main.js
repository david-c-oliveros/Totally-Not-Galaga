/*****************************/
/*         Constants         */
/*****************************/

const SCREEN_WIDTH = document.querySelector('canvas').width;
const SCREEN_HEIGHT = document.querySelector('canvas').height;
const PLAYER_SCREEN_WIDTH = SCREEN_WIDTH - 400;

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
const AUDIO_VOL = 0.07;

// Fonts
const FONT = new FontFace("'Press Start 2P'", "url(fonts/PressStart2P-Regular.ttf)")
FONT.load().then((font) => {
    document.fonts.add(font);
});

const GAME_TICK = 20;
const MOVE_SPEED = 10;

const COUNTER_VALUES = [15,     // [0] Restart cooldown
                        10,     // [1] Player fire cooldown
                        80,    // [2] Player respawn cooldown
                        120,    // [3] Enemy hit cooldown
                       ];





/**********************************/
/*        Global Variables        */
/**********************************/
 
let keys = [];
let t1 = new Date().getTime();
let t2 = new Date().getTime();
let elapsedTime = 0;
let executeTime = 0;
let tickCount = 0;
let difficulty = 5;
let enemyFireRateScalar = 1 - (difficulty / 10);
let enemyProjectileSpeed = difficulty * 3;
let playerProjectileSpeed = 30;




/*****************************/
/*          Classes          */
/*****************************/

class Game
{

    constructor()
    {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.player;
        this.playerScore = 0;
        this.highScore = 0;
        this.level = 0;
        this.enemies = [];
        this.counters = [];
        for (let i = 0; i < COUNTER_VALUES.length; i++)
        {
            const c = new Counter(COUNTER_VALUES[i]);
            this.counters.push(c);
        }

        this.levelGen = [[{type: 1, num:  4, rows: 1}],

                         [{type: 1, num:  4, rows: 1},
                         {type: 3, num: 12, rows: 1},
                         {type: 4, num: 16, rows: 2}],

                         [{type: 1, num:  4, rows: 1},
                         {type: 3, num: 20, rows: 2},
                         {type: 4, num: 24, rows: 2}],

                         [{type: 1, num:  8, rows: 1},
                         {type: 3, num: 24, rows: 2},
                         {type: 4, num: 28, rows: 2}],

                         [{type: 1, num:  10, rows: 1},
                         {type: 3, num: 28, rows: 2},
                         {type: 4, num: 32, rows: 2}],

                         [{type: 1, num:  12, rows: 1},
                         {type: 3, num: 32, rows: 2},
                         {type: 4, num: 36, rows: 3}],

                         [{type: 1, num:  16, rows: 2},
                         {type: 3, num: 36, rows: 3},
                         {type: 4, num: 34, rows: 4}],

                         [{type: 1, num: 80, rows: 8}],
                        ];
        this.explosions = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];

        this.spriteSheets = [];
        this.loadSpriteSheets();

        this.gameState = 'menu';
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
        this.gameState = 'playing';

        /*********************************/
        /*        Add Player Ship        */
        /*********************************/
        const playerPos = (PLAYER_SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
        this.player = new Player(this.canvas, playerPos, SCREEN_HEIGHT - (SCREEN_HEIGHT / 7), this.spriteSheets[0], 1, 7), 'player';

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
        for (let i = 0; i < this.levelGen[this.level].length; i++)
        {
            for (let j = 0; j < this.levelGen[this.level][i].rows; j++)
            {
                startX = ((PLAYER_SCREEN_WIDTH / 2) - (this.levelGen[this.level][i].num / (2 * this.levelGen[this.level][i].rows)) * spacing);
                yRest = 100 + (openRow * spacing);
                for (let k = 0; k < this.levelGen[this.level][i].num / this.levelGen[this.level][i].rows; k++)
                {
                    x = startX + (k * spacing);
                    y = startY - (openRow * spacing);
                    if (this.levelGen[this.level][i].type === 1)
                    {
                        this.addEntity(new Enemy(this.canvas, x, y, yRest, this.spriteSheets[0], 2, 8, this.levelGen[this.level][i].type), 'enemy');
                    } else {
                        this.addEntity(new Enemy(this.canvas, x, y, yRest, this.spriteSheets[0], 1, 8, this.levelGen[this.level][i].type), 'enemy');
                    }
                }
                openRow++;
            }
        }
    }


    handleKeyEvent()
    {
        if (this.gameState === 'playing')
        {
            this.handleGamePlayKeyEvents();
        } else {
            this.handleScreenEvents();
        }

    }


    handleScreenEvents()
    {
        if (keys[13])
        {
            switch(this.gameState)
            {
                case('menu'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        this.playerScore = 0;
                        this.generateLevel();
                    }
                    break;
                case('game-over'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        this.level = 0;
                        this.checkHighScore();
                        this.gameState = 'score-card';
                    }
                    break;
                case('score-card'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        this.gameState = 'menu';
                    }
                    break;
                case('level-success'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        if (++this.level >= this.levelGen.length)
                        {
                            this.level = 0;
                            this.gameState = 'win';
                        } else {
                            this.generateLevel();
                        }
                    }
                    break;
                case('win'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        this.checkHighScore();
                        this.gameState = 'menu';
                    }
                    break;
            }
        }
    }


    handleGamePlayKeyEvents()
    {
        /*********************************/
        /*       A Key - Move Left       */
        /*********************************/
        if (keys[65] && !this.player.hit)
        {
            if (this.player.xPos < 0)
            {
                this.player.xPos = 1;
            } else
            {
                this.player.xVel -= MOVE_SPEED;
                this.player.xPos += this.player.xVel;
            }
        } else
        {
            this.player.xVel = 0;
        }

        /**********************************/
        /*       D Key - Move Right       */
        /**********************************/
        if (keys[68] && !this.player.hit)
        {
            if (this.player.xPos > PLAYER_SCREEN_WIDTH)
            {
                this.player.xPos = PLAYER_SCREEN_WIDTH - 1;
            } else
            {
                this.player.xVel += MOVE_SPEED;
                this.player.xPos += this.player.xVel;
            }
        } else
        {
            this.player.xVel = 0;
        }

        /*******************************************/
        /*       Space Key - Fire Projectile       */
        /*******************************************/
        if ((keys[32] || keys[96]) && !this.player.coolDown && !this.player.hit)
        {
            if (!this.player.OP)
            {
                this.player.coolDown = true;
            }
            this.counters[1].start();
            const audio = new Audio(AUDIO_FILES[1]);
            audio.volume = AUDIO_VOL;
            audio.play();
            this.addEntity(new Projectile(this.canvas, this.player.xPos, this.player.yPos - (SPRITE_HEIGHT * SPRITE_SCALE),
                                          this.spriteSheets[0], 1, 1, 'player', playerProjectileSpeed), 'player-projectile');
        }
    }


    update()
    {
        for (let i = 0; i < this.counters.length; i++)
        {
            this.counters[i].update();
        }

        if (this.gameState === 'playing')
        {
            this.updateGamePlay();
        } else {
            this.updateScreens();
        }
    }


    updateScreens()
    {
        if (this.counters[0].check())
        {
            this.restartCoolDown = false;
            this.counters[0].reset();
        }
    }


    updateGamePlay()
    {
        if (this.enemies.length === 0)
        {
            this.gameState = 'level-success';
            this.clearCanvas();
            return;
        }

        /********************************/
        /*        Check Counters        */
        /********************************/
        if (tickCount % 10 === 0)
//        if (this.counters[1].check())
        {
            this.player.coolDown = false;
            this.counters[1].reset();
        }

        if (this.counters[2].check())
        {
            this.player.hit = false;
            this.player.visible = true;
            this.counters[2].reset();
        }

        if (this.counters[3].check())
        {
            this.enemyReady();
            this.counters[3].reset();
        }

        /********************************/
        /*        Update Enemies        */
        /********************************/
        for (let i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].state === 'entering')
            {
                if (this.enemies[i].yPos >= this.enemies[i].restingYPos)
                {
                    this.enemies[i].state = 'resting';
                }
            }
            if (this.enemies[i].update())
            {
                this.addEntity(new Projectile(this.canvas, this.enemies[i].xPos + 3, this.enemies[i].yPos + (SPRITE_HEIGHT * SPRITE_SCALE * 0.1),
                                              this.spriteSheets[0], 1, 1, 'enemy', enemyProjectileSpeed), 'enemy-projectile');
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
        for (let i = 0; i < this.explosions.length; i++)
        {
            this.explosions[i].update();
            if (this.explosions[i].destroyed)
            {
                this.removeEntity(this.explosions, i);
            }
        }


        /************************************/
        /*         Check Enemy Hits         */
        /************************************/
        for (let i = this.enemies.length - 1; i >= 0; i--)
        {
            for (let j =  this.playerProjectiles.length - 1; j >= 0; j--)
            {
                if (this.collide(this.playerProjectiles[j], this.enemies[i]))
                {
                    // Handle collision
                    const audio = new Audio(AUDIO_FILES[2]);
                    audio.volume = AUDIO_VOL * 0.7;
                    audio.play();
                    this.enemies[i].lives--;
                    if (this.enemies[i].enemyType <= 2)
                    {
                        this.playerScore += 80;
                    } else
                    {
                        this.playerScore += 50;
                    }
                    this.removeEntity(this.playerProjectiles, j);
                    this.enemies[i].hit = true;
                    if (this.enemies[i].lives <= 0)
                    {
                        this.explode(this.enemies[i].xPos - SPRITE_WIDTH - 5, this.enemies[i].yPos - SPRITE_HEIGHT - 5, 2);
                        this.removeEntity(this.enemies, i);
                    }
                }
            }
        }

        /*************************************/
        /*         Check Player Hits         */
        /*************************************/
        for (let j = this.enemyProjectiles.length - 1; j >= 0; j--)
        {
            if (this.collide(this.enemyProjectiles[j], this.player) && this.player.visible)
            {
                // Handle collision
                const audio = new Audio(AUDIO_FILES[0]);
                audio.volume = AUDIO_VOL;
                audio.play();
                this.removeEntity(this.enemyProjectiles, j);
                this.player.lives--;
                this.player.hit = true;
                this.player.visible = false;
                this.explode(this.player.xPos - SPRITE_WIDTH - 5, this.player.yPos - SPRITE_HEIGHT - 5, 1);
                this.counters[2].start();
                this.counters[3].start();
                this.enemyCoolDown();
            }
        }

        /********************************************/
        /*       Remove Offscreen Projectiles       */
        /********************************************/
        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            if (this.playerProjectiles[i].yPos < -(SPRITE_HEIGHT + 25))
            {
                this.removeEntity(this.playerProjectiles, i);
            }
        }

        for (let i = 0; i < this.enemyProjectiles.length; i++)
        {
            if (this.enemyProjectiles[i].yPos > SCREEN_HEIGHT - (SPRITE_HEIGHT + 5))
            {
                this.removeEntity(this.enemyProjectiles, i);
            }
        }

        if (this.player.lives < 1)
        {
            this.endGame();
        }
    }


    enemyCoolDown()
    {
        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].coolDown = true;
        }
    }


    enemyReady()
    {
        for (let i = 0; i < this.enemies.length; i++)
        {
            this.enemies[i].coolDown = false;
        }
    }


    endGame()
    {
        this.gameState = 'game-over';
        this.clearCanvas();
    }


    checkHighScore()
    {
        if (this.playerScore > this.highScore)
        {
            this.highScore = this.playerScore;
        }
    }


    clearCanvas()
    {
        this.enemies.length = 0;
        this.player.length = null;
        this.explosions.length = 0;
        this.playerProjectiles.length = 0;
        this.enemyProjectiles.length = 0;
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


    addEntity(object, type)
    {
        switch(type)
        {
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
                this.explosions.push(object);
                break;
        }
    }


    removeEntity(array, index)
    {
        array.splice(index, 1);
    }


    render()
    {
        // Clear Screen For Rendering
        this.context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        switch(this.gameState)
        {
            case('menu'):
                this.renderScreen('Totally Not Galaga', 50, '#e00000', 0, -5);
                this.renderScreen('Press Enter to Start', 30, '#f0d000', 0, 1);
                break;
            case('playing'):
                this.renderGame();
                break;
            case('level-success'):
                this.renderScreen('You Beat the Level', 40, '#e00000', 0, 0);
                break;
            case('win'):
                this.renderScreen('You Win!', 40, '#e00000', 0, 0);
                break;
            case('game-over'):
                this.renderScreen('Game Over', 40, '#e00000', 0, 0);
                break;
            case('score-card'):
                this.renderScreen(`Score: ${this.playerScore}`, 30, '#00e0d0', 0, 0);
                break;
        }

    }


    renderGame()
    {
        /******************************/
        /*        Render Score        */
        /******************************/
        this.renderScreen('HIGH', 35, '#e00000', 14, -6, 35);
        this.renderScreen('SCORE', 35, '#e00000', 16, -5, 35);
        this.renderScreen(`${this.highScore}`, 35, '#ffffff', 15.5, -4, 35);
        this.renderScreen('1UP', 35, '#e00000', 14, 0, 35);
        this.renderScreen(`${this.playerScore}`, 35, '#ffffff', 17, 1, 35);

        /*********************************************/
        /*       Render Remaining Player Lives       */
        /*********************************************/
        for (let i = 0; i < this.player.lives; i++)
        {
            this.player.spriteFrames[this.player.currentFrameCol].draw(this.canvas.getContext('2d'), SCREEN_WIDTH - (i * SPRITE_WIDTH * SPRITE_SCALE) - 100, SCREEN_HEIGHT - (7 * SPRITE_HEIGHT * SPRITE_SCALE));
        }

        /*************************************************************************/
        /*       Render anything that has the 'visible' flag marked 'true'       */
        /*************************************************************************/
        if (this.player.visible)
        {
            this.player.spriteFrames[this.player.currentFrameCol].draw(this.canvas.getContext('2d'), this.player.xPos, this.player.yPos);
        }

        for (let i = 0; i < this.enemies.length; i++)
        {
            if (!this.enemies[i].visible)
            {
                continue;
            }
            this.enemies[i].spriteFrames[(this.enemies[i].currentFrameRow * this.enemies[i].nSpriteSheetCols) + this.enemies[i].currentFrameCol].draw(this.canvas.getContext('2d'), this.enemies[i].xPos, this.enemies[i].yPos);
        }

        for (let i = 0; i < this.playerProjectiles.length; i++)
        {
            if (!this.playerProjectiles[i].visible)
            {
                continue;
            }
            this.playerProjectiles[i].spriteFrames[0].draw(this.canvas.getContext('2d'), this.playerProjectiles[i].xPos, this.playerProjectiles[i].yPos);
        }

        for (let i = 0; i < this.enemyProjectiles.length; i++)
        {
            if (!this.enemyProjectiles[i].visible)
            {
                continue;
            }
            this.enemyProjectiles[i].spriteFrames[0].draw(this.canvas.getContext('2d'), this.enemyProjectiles[i].xPos, this.enemyProjectiles[i].yPos);
        }

        for (let i = 0; i < this.explosions.length; i++)
        {
            if (!this.explosions[i].visible)
            {
                continue;
            }
            this.explosions[i].spriteFrames[this.explosions[i].currentFrameCol].drawBig(this.canvas.getContext('2d'),
                                                                                     this.explosions[i].xPos, this.explosions[i].yPos);
        }
    }


    renderScreen(text, size, color, offsetX, offsetY, scalar = 50)
    {
        this.context.fillStyle = color;
        this.context.font = `${size}px 'Press Start 2P'`;
        const textWidth = text.length * size;
        this.context.fillText(text, (SCREEN_WIDTH / 2) - (textWidth / 2) + (offsetX * scalar), (SCREEN_HEIGHT / 2) + (size / 2) + (offsetY * scalar));
    }


    explode(xPos, yPos, type)
    {

        const explosion = new Explosion(this.canvas, xPos, yPos, this.spriteSheets[0], type);
        this.addEntity(explosion, 'explosion');
    }
}



class Entity
{
    constructor(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
        this.canvas = canvas;
        this.xPos = xPos;
        this.yPos = yPos;
        this.nSpriteSheetRows = nSpriteSheetRows;
        this.nSpriteSheetCols = nSpriteSheetCols;
        this.spriteFrames = [];
        this.currentFrameCol = 0;
        this.visible = true;
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
                this.spriteFrames[(i * this.nSpriteSheetCols) + j] = new Sprite(this.canvas, spriteFile, SPRITE_WIDTH, SPRITE_HEIGHT, sheetPos, BORDER_WIDTH, SPACING_WIDTH);
            }
        }
    }
}



class Player extends Entity
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
        this.hit = false;
    }
}



class Enemy extends Entity
{
    constructor(canvas, xPos, yPos, restingYPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, enemyType)
    {
        super(canvas, xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.enemyType = enemyType;
        this.genSprites(spriteSheet, this.enemyType + 1, 0);
        this.state = 'entering';
        this.hit = false;
        this.coolDown = false;
        this.xVel = 0;
        this.yVel = 0;
        this.restingYPos = restingYPos;
        this.startX = xPos;
        this.direction = -1;
        this.limit = 100;
        this.moveIncrement = 10;
        this.currentFrameRow = 0;
        this.currentFrameCol = 0;

        switch(enemyType)
        {
            case(1):
                this.lives = 3;
                break;
            case(3):
                this.lives = 1;
                break;
            case(4):
                this.lives = 1;
                break;
        }
    }

    update()
    {
        if (this.hit)
        {
            this.currentFrameRow = 1;
        }
        if (this.hit && tickCount % 10 === 0)
        {
            this.hit = false;
            this.currentFrameRow = 0;
        }

        let offset = this.xPos - this.startX;
        if (this.direction < 0)
        {
            if (offset < this.limit)
            {
                this.direction = -this.direction;
                this.limit = -this.limit;
            }
        } else {
            if (offset > this.limit)
            {
                this.direction = -this.direction;
                this.limit = -this.limit;
            }
        }
        let fire = false;
        switch(this.state)
        {
            case('entering'):
                this.yPos += MOVE_SPEED / 2;
                if (tickCount % 10 === 0)
                {
                    this.restAnim();
                }
                break;
            case('resting'):
                if (tickCount % 10 === 0)
                {
                    this.restAnim();
                    this.moveAnim(this.moveIncrement * this.direction)
                }
                if (!this.coolDown && (Math.floor(Math.random() * 500 * enemyFireRateScalar) === 0))
                {
                    fire = true;
                }
                break;
            case('hit'):
                if (tickCount % 10 === 0)
                {
                    this.restAnim();
                    this.moveAnim(this.moveIncrement * this.direction)
                }
                break;
        }

        return fire;
    }

    restAnim()
    {
        if (this.currentFrameCol != this.nSpriteSheetCols - 1)
        {
            this.currentFrameCol = this.nSpriteSheetCols - 1;
        } else {
            this.currentFrameCol = this.nSpriteSheetCols - 2;
        }
    }

    moveAnim(offset)
    {
        this.xPos += offset;
    }
}



class Projectile extends Entity
{
    constructor(canvas, xPos, yPos, spriteSheet, nSpriteSheetRows, nSpriteSheetCols, type, yVel)
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
        this.yVel = yVel;
    }

    update(direction)
    {
        this.yPos -= this.yVel * direction;
    }
}



class Explosion extends Entity
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
        this.currentFrameCol = 0;
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
            if (this.currentFrameCol === this.spriteFrames.length - 1)
            {
                this.currentFrameCol = 0;
                this.destroyed = true;
            } else {
                this.currentFrameCol++;
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
        context.globalCompositeOperation = 'source-over';
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
        context.globalCompositeOperation = 'source-over';
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


class Counter
{
    constructor(duration)
    {
        this.duration = duration;
        this.ticks = 0;
        this.running = false;
    }

    start()
    {
        this.running = true;
    }

    reset()
    {
        this.running = false;
        this.ticks = 0;
    }

    update()
    {
        if (this.running)
        {
            this.ticks++;
        }
    }

    check()
    {
        if (this.ticks >= this.duration)
        {
            return true;
        } else {
            return false;
        }
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    game.update();

//    const explosion =  new Explosion(game.canvas, 50, 50, game.spriteSheets[0], 1, 4);
//    game.addEntity(explosion, 'explosion');


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
