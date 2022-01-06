/*****************************/
/*         Constants         */
/*****************************/

const SCREEN_WIDTH = 1400;
const SCREEN_HEIGHT = 900; 
const PLAYER_SCREEN_WIDTH = SCREEN_WIDTH - 400;

const TITLE_POSITION_SCALAR = 35;

console.log("Screen dimensions:", SCREEN_WIDTH, SCREEN_HEIGHT);

// Sprite constants
const PLAYER_SPRITES = ['./images/player/player_sprite_00.png',
                        './images/player/player_sprite_01.png',
                        './images/player/player_sprite_02.png',
                        './images/player/player_sprite_03.png',
                        './images/player/player_sprite_04.png',
                        './images/player/player_sprite_05.png',
                        './images/player/player_sprite_06.png']

const ENEMY_SPRITES = [['images/enemy/type-1/enemy_1_sprite_00.png',
                        'images/enemy/type-1/enemy_1_sprite_01.png',
                        'images/enemy/type-1/enemy_1_sprite_02.png',
                        'images/enemy/type-1/enemy_1_sprite_03.png',
                        'images/enemy/type-1/enemy_1_sprite_04.png',
                        'images/enemy/type-1/enemy_1_sprite_05.png',
                        'images/enemy/type-1/enemy_1_sprite_06.png',
                        'images/enemy/type-1/enemy_1_sprite_07.png'],

                       ['images/enemy/type-1/enemy_1_sprite_08.png',
                        'images/enemy/type-1/enemy_1_sprite_09.png',
                        'images/enemy/type-1/enemy_1_sprite_10.png',
                        'images/enemy/type-1/enemy_1_sprite_11.png',
                        'images/enemy/type-1/enemy_1_sprite_12.png',
                        'images/enemy/type-1/enemy_1_sprite_13.png',
                        'images/enemy/type-1/enemy_1_sprite_14.png',
                        'images/enemy/type-1/enemy_1_sprite_15.png'],

                       ['images/enemy/type-3/enemy_3_sprite_00.png',
                        'images/enemy/type-3/enemy_3_sprite_01.png',
                        'images/enemy/type-3/enemy_3_sprite_02.png',
                        'images/enemy/type-3/enemy_3_sprite_03.png',
                        'images/enemy/type-3/enemy_3_sprite_04.png',
                        'images/enemy/type-3/enemy_3_sprite_05.png',
                        'images/enemy/type-3/enemy_3_sprite_06.png',
                        'images/enemy/type-3/enemy_3_sprite_07.png'],
 
                       ['images/enemy/type-4/enemy_4_sprite_00.png',
                        'images/enemy/type-4/enemy_4_sprite_01.png',
                        'images/enemy/type-4/enemy_4_sprite_02.png',
                        'images/enemy/type-4/enemy_4_sprite_03.png',
                        'images/enemy/type-4/enemy_4_sprite_04.png',
                        'images/enemy/type-4/enemy_4_sprite_05.png',
                        'images/enemy/type-4/enemy_4_sprite_06.png',
                        'images/enemy/type-4/enemy_4_sprite_07.png']];

const EXPLOSIONS = [['images/explosion/type-1/explosion_1_sprite_00.png',
                     'images/explosion/type-1/explosion_1_sprite_01.png',
                     'images/explosion/type-1/explosion_1_sprite_02.png',
                     'images/explosion/type-1/explosion_1_sprite_03.png'],

                     ['images/explosion/type-2/explosion_2_sprite_00.png',
                      'images/explosion/type-2/explosion_2_sprite_01.png',
                      'images/explosion/type-2/explosion_2_sprite_02.png',
                      'images/explosion/type-2/explosion_2_sprite_03.png',
                      'images/explosion/type-2/explosion_2_sprite_04.png']];

const PLAYER_PROJECTILES = 'images/projectiles/player/player_projectile_sprite_00.png';
const ENEMY_PROJECTILES  = 'images/projectiles/enemy/enemy_projectile_sprite_00.png';

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
//const FONT = new FontFace("'Press Start 2P'", "url(fonts/PressStart2P-Regular.ttf)")
//FONT.load().then((font) => {
//    document.fonts.add(font);
//});

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
        this.canvas = document.querySelector('#canvas');
        this.titles = [];
        this.player;
        this.playerScore = 0;
        this.playerOP = true;
        this.highScore = 0;
        this.level = 0;
        this.enemies = [];
        this.counters = [];
        for (let i = 0; i < COUNTER_VALUES.length; i++)
        {
            const c = new Counter(COUNTER_VALUES[i]);
            this.counters.push(c);
        }

        this.levelGen = [[{type: 1, num:  0, rows: 1},
                          {type: 3, num: 10, rows: 1},
                          {type: 4, num: 20, rows: 2}],

                         [{type: 1, num:  4, rows: 1},
                          {type: 3, num: 20, rows: 2},
                          {type: 4, num: 24, rows: 2}],

                         [{type: 1, num:  8, rows: 1},
                          {type: 3, num: 24, rows: 2},
                          {type: 4, num: 28, rows: 2}],

                         [{type: 1, num: 10, rows: 1},
                          {type: 3, num: 28, rows: 2},
                          {type: 4, num: 32, rows: 2}],

                         [{type: 1, num: 12, rows: 1},
                          {type: 3, num: 32, rows: 2},
                          {type: 4, num: 36, rows: 3}],

                         [{type: 1, num: 16, rows: 2},
                          {type: 3, num: 36, rows: 3},
                          {type: 4, num: 34, rows: 4}]
                        ];

        this.explosions = [];
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.playerLives = [];

        this.gameState = 'menu';
    }


    generateLevel()
    {
        this.gameState = 'playing';

        this.addTitle('fixed', 'HIGH', 35, '#e00000', 14, -6, TITLE_POSITION_SCALAR);
        this.addTitle('fixed', 'SCORE', 35, '#e00000', 15.58, -5, 35);
        this.addTitle('high-score', `${this.highScore}`, 35, '#ffffff', 15.58, -4, TITLE_POSITION_SCALAR);
        this.addTitle('fixed', '1UP', 35, '#e00000', 14.58, 0, 35);
        this.addTitle('player-score', `${this.playerScore}`, 35, '#ffffff', 17, 1, TITLE_POSITION_SCALAR);

//                this.renderScreen('Totally Not Galaga', 50, '#e00000', 0, -5);
//                this.renderScreen(`Score: ${this.playerScore}`, 30, '#00e0d0', 0, 0);

        /*********************************/
        /*        Add Player Ship        */
        /*********************************/
        const playerPosX = (PLAYER_SCREEN_WIDTH / 2) - (SPRITE_WIDTH / 2);
        const playerPosY = SCREEN_HEIGHT - (SCREEN_HEIGHT / 7);
        this.player = new Player(playerPosX, playerPosY, 1, 7);
//        this.player = new Player(400, 400, 1, 7);
        this.addEntity(this.player, 'player');

        /********************************************/
        /*        Add Player Lives Remaining        */
        /********************************************/
        for (let i = 0; i < this.player.lives; i++)
        {
            const life = new Image(SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);
            life.src = PLAYER_SPRITES[6];
            life.style.position = 'absolute';
            life.style.left = SCREEN_WIDTH - (i * SPRITE_WIDTH * SPRITE_SCALE) - 100 + 'px';
            life.style.top = SCREEN_HEIGHT - (7 * SPRITE_HEIGHT * SPRITE_SCALE) + 'px';
            this.playerLives.push(life);
            this.canvas.appendChild(this.playerLives[this.playerLives.length - 1]);
        }

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
                        this.addEntity(new Enemy(x, y, yRest, 2, 8, this.levelGen[this.level][i].type), 'enemy');
                    } else {
                        this.addEntity(new Enemy(x, y, yRest, 1, 8, this.levelGen[this.level][i].type), 'enemy');
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
                        this.clearCanvas();
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
                        this.clearCanvas();
                        this.addTitle('final-score', `Score: ${this.playerScore}`, 30, '#00e0d0', 0, 0);
                        this.gameState = 'score-card';
                    }
                    break;
                case('score-card'):
                    if (!this.restartCoolDown)
                    {
                        this.restartCoolDown = true;
                        this.counters[0].start();
                        this.clearCanvas();
                        this.addTitle('fixed', 'Totally Not Galaga', 50, '#e00000', 0, -5);
                        this.addTitle('fixed', 'Press Enter to Start', 30, '#f0d000', 0, 1);
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
                            this.clearCanvas();
                            this.addTitle('fixed', 'You Win!', 40, '#e00000', 0, 0);
                        } else {
                            this.clearCanvas();
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
                        this.clearCanvas();
                        this.addTitle('final-score', `Score: ${this.playerScore}`, 30, '#00e0d0', 0, 0);
                        this.gameState = 'score-card';
                    }
                    break;
                case('enter-name'):
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
            if (this.player.xPos <= 10)
            {
                this.player.xPos = 10;
                this.player.updateSprites();
            } else
            {
                this.player.xVel -= MOVE_SPEED;
                this.player.xPos += this.player.xVel;
                this.player.updateSprites();
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
            if (this.player.xPos >= PLAYER_SCREEN_WIDTH - 10)
            {
                this.player.xPos = PLAYER_SCREEN_WIDTH - 10;
                this.player.updateSprites();
            } else
            {
                this.player.xVel += MOVE_SPEED;
                this.player.xPos += this.player.xVel;
                this.player.updateSprites();
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
            if (!this.playerOP)
            {
                this.player.coolDown = true;
            }
            this.counters[1].start();
            const audio = new Audio(AUDIO_FILES[1]);
            audio.volume = AUDIO_VOL;
            audio.play();
            this.addEntity(new Projectile(this.player.xPos, this.player.yPos - (SPRITE_HEIGHT * SPRITE_SCALE), 'player', playerProjectileSpeed), 'player-projectile');
        }
    }


    handleCanvasInput(e)
    {
        this.playerName += e.keyCode;
        //console.log(String.fromCharCode(e.keyCode));
    }


    /*****************************/
    /*        Update Game        */
    /*****************************/
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
        this.updateVariableText();
    }


    updateGamePlay()
    {
        if (this.enemies.length === 0 && this.explosions.length === 0 &&
            this.enemyProjectiles.length === 0 && this.playerProjectiles.length === 0)
        {
            this.gameState = 'level-success';
            this.clearCanvas();
            this.addTitle('fixed', 'You Beat the Level', 40, '#e00000', 0, 0);
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
            this.canvas.appendChild(this.player.spriteFrames[this.player.currentFrameCol]);
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
                this.addEntity(new Projectile(this.enemies[i].xPos + 3, this.enemies[i].yPos + (SPRITE_HEIGHT * SPRITE_SCALE * 0.1),
                                              'enemy', enemyProjectileSpeed), 'enemy-projectile');
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
                this.canvas.removeChild(this.playerLives[this.playerLives.length - 1]);
                this.playerLives.pop();
                this.player.hit = true;
                this.player.visible = false;
                this.canvas.removeChild(this.player.spriteFrames[this.player.currentFrameCol]);
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
        if (this.explosions.length === 0 && this.enemyProjectiles.length === 0 && this.playerProjectiles.length === 0)
            {
                this.endGame();
            }
        }

        this.updateVariableText();
    }


    updateVariableText()
    {
        for (let i = 0; i < this.titles.length; i++)
        {
            switch(this.titles[i].label)
            {
                case('high-score'):
                    this.titles[i].value.innerText = this.highScore;
                    break;
                case('player-score'):
                    this.titles[i].value.innerText = this.playerScore;
                    break;
                case('final-score'):
                    this.titles[i].value.innerText = `Score: ${this.playerScore}`;
                    break;
            }
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
        this.clearCanvas();
        this.addTitle('fixed', 'Game Over', 40, '#e00000', 0, 0);
        this.gameState = 'game-over';
    }


    checkHighScore()
    {
        if (this.playerScore > this.highScore)
        {
            this.highScore = this.playerScore;
        }
    }


    /********************************/
    /*         Clear Canvas         */
    /********************************/
    clearCanvas()
    {
        if (this.player && !this.player.hit)
        {
            this.canvas.removeChild(this.player.spriteFrames[this.player.currentFrameCol]);
        }
        for (let i = this.enemies.length - 1; i >= 0; i--)
        {
            this.removeEntity(this.enemies, i);
        }
        for (let i = this.playerProjectiles.length - 1; i >= 0; i--)
        {
            this.removeEntity(this.playerProjectiles, i);
        }
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--)
        {
            this.removeEntity(this.enemyProjectiles, i);
        }
        for (let i = this.explosions.length - 1; i >= 0 ; i--)
        {
            this.removeEntity(this.explosions[i]);
        }
        for (let i = this.titles.length - 1; i >= 0 ; i--)
        {
            this.canvas.removeChild(this.titles[i].value);
            this.titles.splice(i, 1);
        }
        for (let i = this.playerLives.length - 1; i >= 0 ; i--)
        {
            this.canvas.removeChild(this.playerLives[i]);
            this.titles.splice(i, 1);
        }

        this.enemies.length = 0;
        this.player = null;
        this.explosions.length = 0;
        this.playerProjectiles.length = 0;
        this.enemyProjectiles.length = 0;
        this.titles.length = 0;
        this.playerLives.length = 0;
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


    /****************************/
    /*        Add Entity        */
    /****************************/
    addEntity(object, type)
    {
        switch(type)
        {
            case('player'):
                this.canvas.appendChild(object.spriteFrames[object.currentFrameCol]);
                break;
            case('enemy'):
                this.enemies.push(object);
                this.canvas.appendChild(object.sprite);
//                this.canvas.appendChild(object.spriteFrames[object.currentFrameCol]);
                break;
            case('player-projectile'):
                this.playerProjectiles.push(object);
                this.canvas.appendChild(object.sprite);
                break;
            case('enemy-projectile'):
                this.enemyProjectiles.push(object);
                this.canvas.appendChild(object.sprite);
                break;
            case('explosion'):
                this.explosions.push(object);
                this.canvas.appendChild(object.sprite);
                break;
        }
    }


    /*******************************/
    /*        Remove Entity        */
    /*******************************/
    removeEntity(array, index)
    {
        this.canvas.removeChild(array[index].sprite);
        array.splice(index, 1);
    }


    render()
    {
        // Clear Screen For Rendering

        switch(this.gameState)
        {
            case('menu'):
//                this.renderScreen('Totally Not Galaga', 50, '#e00000', 0, -5);
//                this.renderScreen('Press Enter to Start', 30, '#f0d000', 0, 1);
                break;
            case('playing'):
                break;
            case('level-success'):
//                this.renderScreen('You Beat the Level', 40, '#e00000', 0, 0);
                break;
            case('win'):
//                this.renderScreen('You Win!', 40, '#e00000', 0, 0);
                break;
            case('game-over'):
//                this.renderScreen('Game Over', 40, '#e00000', 0, 0);
                break;
            case('score-card'):
//                this.renderScreen(`Score: ${this.playerScore}`, 30, '#00e0d0', 0, 0);
                break;
        }

    }


    addTitle(label, str, size, color, offsetX, offsetY, scalar = 1.428 * TITLE_POSITION_SCALAR)
    {
        const text = document.createElement('div');
        const textWidth = str.length * size;
        text.innerText = str;
        text.style.position = 'absolute';
        text.style.color = color;
        text.style.fontSize = size + 'px';
        text.style.left = (SCREEN_WIDTH / 2) - (textWidth / 2) + (offsetX * scalar) + 'px';
        text.style.top = (SCREEN_HEIGHT / 2) - (size / 2) + (offsetY * scalar) + 'px';
        this.titles.push({label: label, value: text});
        this.canvas.appendChild(this.titles[this.titles.length - 1].value);
    }


    /*************************/
    /*        Explode        */
    /*************************/
    explode(xPos, yPos, type)
    {
        const explosion = new Explosion(xPos, yPos, type);
        this.addEntity(explosion, 'explosion');
    }
}



class Entity
{
    constructor(xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.nSpriteSheetRows = nSpriteSheetRows;
        this.nSpriteSheetCols = nSpriteSheetCols;
        this.spriteFrames = [];
        this.currentFrameCol = 0;
        this.visible = true;
    }
}



class Player extends Entity
{
    constructor(xPos, yPos, nSpriteSheetRows, nSpriteSheetCols)
    {
        super(xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.entityType = 'Player';
        this.genSprites();
        this.xVel = 0;
        this.yVel = 0;
        this.coolDown = false;
        this.currentFrameCol = 6;

        this.lives = 3;
        this.hit = false;

        this.updateSprites();
    }

    genSprites()
    {
        for (let i = 0; i < this.nSpriteSheetRows; i++)
        {
            for (let j = 0; j < this.nSpriteSheetCols; j++)
            {
                // Add sprite frames to object's sprite array
                let index = (i * this.nSpriteSheetCols) + j;
                const sprite = new Image(SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);
                sprite.src = PLAYER_SPRITES[index];
                this.spriteFrames.push(sprite);
                this.spriteFrames[index].style.position = 'absolute';
            }
        }
    }

    updateSprites()
    {
        for (let i = 0; i < this.spriteFrames.length; i++)
        {
            this.spriteFrames[i].style.top = this.yPos + 'px';
            this.spriteFrames[i].style.left = this.xPos + 'px';
        }
    }
}



class Enemy extends Entity
{
    constructor(xPos, yPos, restingYPos, nSpriteSheetRows, nSpriteSheetCols, enemyType)
    {
        super(xPos, yPos, nSpriteSheetRows, nSpriteSheetCols);

        this.entityType = 'Enemy';

        this.parentCanvas = document.querySelector('#canvas');
        this.enemyType = enemyType;
        this.sprite = new Image(SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);
        this.sprite.style.position = 'absolute';
        this.genSprites();
        this.updateSprites();
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
        this.currentFrameCol = 6;
        this.sprite.src = this.spriteFrames[this.currentFrameRow * this.nSpriteSheetRows + this.currentFrameCol];
        this.cooldownCounter = new Counter(8);
        this.animCounter = new Counter(10);
        this.animCounter.start();

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

    genSprites()
    {
        for (let i = 0; i < this.nSpriteSheetRows; i++)
        {
            for (let j = 0; j < this.nSpriteSheetCols; j++)
            {
                // Add sprite frames to object's sprite array
                let index = j;
                const url = ENEMY_SPRITES[this.enemyType - 1 + i][index];
                this.spriteFrames.push(url);
            }
        }
    }

    update()
    {
        this.animCounter.update();
        this.cooldownCounter.update();
        if (this.hit)
        {
            this.currentFrameRow = 1;
            this.cooldownCounter.start();
            this.sprite.src = this.spriteFrames[this.currentFrameRow * this.nSpriteSheetCols + this.currentFrameCol];
        }
        if (this.hit && this.cooldownCounter.check())
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
                if (this.animCounter.check())
                {
                    this.restAnim();
                    this.animCounter.reset();
                    this.animCounter.start();
                }
                break;
            case('resting'):
                if (this.animCounter.check())
                if (tickCount % 10 === 0)
                {
                    this.restAnim();
                    this.moveAnim(this.moveIncrement * this.direction)
                    this.animCounter.reset();
                    this.animCounter.start();
                }
                if (!this.coolDown && (Math.floor(Math.random() * 500 * enemyFireRateScalar) === 0))
                {
                    fire = true;
                }
                break;
            case('hit'):
                if (this.animCounter.check())
                {
                    this.restAnim();
                    this.moveAnim(this.moveIncrement * this.direction)
                    this.animCounter.reset();
                    this.animCounter.start();
                }
                break;
        }

        this.updateSprites();
        return fire;
    }

    restAnim()
    {
        if (this.currentFrameCol != this.nSpriteSheetCols - 1)
        {
            this.currentFrameCol = this.nSpriteSheetCols - 1;
            this.sprite.src = this.spriteFrames[this.currentFrameRow * this.nSpriteSheetCols + this.currentFrameCol];
        } else {
            this.currentFrameCol = this.nSpriteSheetCols - 2;
            this.sprite.src = this.spriteFrames[this.currentFrameRow * this.nSpriteSheetCols + this.currentFrameCol];
        }
    }

    moveAnim(offset)
    {
        this.xPos += offset;
    }

    updateSprites()
    {
        this.sprite.style.top = this.yPos + 'px';
        this.sprite.style.left = this.xPos + 'px';
    }
}



class Projectile extends Entity
{
    constructor(xPos, yPos, type, yVel)
    {
        super(xPos, yPos);
        this.sprite = new Image(SPRITE_WIDTH * SPRITE_SCALE, SPRITE_HEIGHT * SPRITE_SCALE);
        this.sprite.style.position = 'absolute';
        this.entityType = 'Projectile';
        this.xPos = xPos;
        this.yPos = yPos;
        this.yVel = yVel;
        this.type = type;
        this.genSprites();
        this.currentFrame = 0;
        this.sprite.src = this.spriteFrames[this.currentFrameCol];
        this.updateSprites();
    }

    genSprites()
    {
        // Add sprite frames to object's sprite array
        switch(this.type)
        {
            case('enemy'):
                this.spriteFrames[0] = ENEMY_PROJECTILES;
                break;
            case('player'):
                this.spriteFrames[0] = PLAYER_PROJECTILES;
                break;
        }
    }

    update(direction)
    {
        this.yPos -= this.yVel * direction;
        this.updateSprites();
    }

    updateSprites()
    {
        this.sprite.style.top = this.yPos + 'px';
        this.sprite.style.left = this.xPos + 'px';
    }
}



class Explosion extends Entity
{
    constructor(xPos, yPos, type)
    {
        super(xPos, yPos);
        this.entityType = 'Explosion';
        this.type = type;
        this.spriteFrames = [];
        this.sprite = new Image(BIG_SPRITE_WIDTH * SPRITE_SCALE, BIG_SPRITE_HEIGHT * SPRITE_SCALE);
        this.sprite.style.position = 'absolute';
        if (type === 1)
        {
            this.nSpriteSheetRows = 1;
            this.nSpriteSheetCols = 4;
            this.genSprites();
            this.speed = 4;
        } else {
            this.nSpriteSheetRows = 1;
            this.nSpriteSheetCols = 5;
            this.genSprites();
            this.speed = 2;
        }
        this.destroyed = false;
        this.currentFrameCol = 0;
        this.sprite.src = this.spriteFrames[this.currentFrameCol];
        this.updateSprites();
    }

    genSprites()
    {
        for (let i = 0; i < this.nSpriteSheetRows; i++)
        {
            for (let j = 0; j < this.nSpriteSheetCols; j++)
            {
                // Add sprite frames to object's sprite array
                let index = (i * this.nSpriteSheetCols) + j;
                const url = EXPLOSIONS[this.type - 1][index];
                this.spriteFrames.push(url);
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
                this.sprite.src = this.spriteFrames[this.currentFrameCol];
            }
        }
        this.updateSprites();
    }

    updateSprites()
    {
        this.sprite.style.top = this.yPos + 'px';
        this.sprite.style.left = this.xPos + 'px';
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
    game.addTitle('fixed', 'Totally Not Galaga', 50, '#e00000', 0, -5);
    game.addTitle('fixed', 'Press Enter to Start', 30, '#f0d000', 0, 1);
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
                col * (SPACING_WIDTH + BIG_SPRITE_WIDTH)
        ),
        y: (
            BORDER_WIDTH +
            row * (SPACING_WIDTH + BIG_SPRITE_HEIGHT)
        )
    }
}

function inputLoop()
{
    if (game.gameState === 'playing')
    {
        window.requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keypress', function(e) {
        game.handleCanvasInput(e);
    });

    window.requestAnimationFrame(inputLoop);
}

function gameLoop()
{
    if (game.gameState === 'enter-name')
    {
        window.requestAnimationFrame(inputLoop);
    }
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

init();
window.requestAnimationFrame(gameLoop);
