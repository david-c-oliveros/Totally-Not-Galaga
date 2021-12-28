/*****************************/
/*         Constants         */
/*****************************/

// const SCREEN_WIDTH = document.querySelector('#width').offsetWidth;
// const SCREEN_HEIGHT= document.querySelector('#width').offsetHeight;
const SCREEN_WIDTH = document.querySelector('#canvas').offsetWidth;
const SCREEN_HEIGHT = document.querySelector('#canvas').offsetHeight;
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
        this.hero = new Hero(48, 90);
        this.hero = new Hero(SCREEN_WIDTH / 2, SCREEN_HEIGHT - (SCREEN_HEIGHT / 10));
        this.canvas = document.querySelector('body');
        this.canvasStyle = window.getComputedStyle(canvas);
        console.log(this.canvasStyle.getPropertyValue('background-color'));
    }


    update()
    {
    }

    move()
    {
        if (keys[65])
        {
            this.hero.xVel -= MOVE_SPEED;
            this.hero.posX += game.hero.xVel;
            game.hero.sprite.style.left = game.hero.xVel;
        } else
        {
            this.hero.xVel = 0;
        }

        if (keys[68])
        {
            this.hero.xVel += MOVE_SPEED;
            this.hero.posX += game.hero.xVel;
            game.hero.sprite.style.left = game.hero.xVel;
        } else
        {
            this.hero.xVel = 0;
        }

        if (keys[83])
        {
            this.hero.yVel -= MOVE_SPEED;
            this.hero.posY += game.hero.yVel;
            game.hero.sprite.style.top = game.hero.posY;
        }

        if (keys[87])
        {
            this.hero.yVel += MOVE_SPEED;
            this.hero.posY += game.hero.yVel;
            game.hero.sprite.style.top = game.hero.posY;
        }
    }


    moveLeft(e)
    {
        this.hero.posX -= 20;
        this.hero.updateSprite();
    }


    moveRight(e)
    {
        this.hero.posX += 20;
        this.hero.updateSprite();
    }


    renderInitial()
    {
        console.log("renderInitial");
        console.log(this.hero);
        this.canvas.appendChild(this.hero.sprite);
    }


    render()
    {
        this.hero.updateSprite();
    }


    quit()
    {
        console.log('Exiting game');
        running = false;
    }


    debug()
    {
        console.log("X: ", this.hero.sprite.style.left)
        console.log("Y: ", this.hero.sprite.style.top)
        console.log(SCREEN_WIDTH, ', ', SCREEN_HEIGHT)
    }


    handleKeyEvent(e)
    {
        console.log(e.keyCode);
        switch(e.code)
        {
            case 'KeyA':
                this.moveLeft();
                break;
            case 'KeyD':
                this.moveRight();
                break;
            case 'KeyQ':
                this.quit();
                break;
            case 'KeyP':
                this.debug();
        }
    }
}


class Ship
{
    constructor(posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
    }
}


class Hero extends Ship
{
    constructor(posX, posY)
    {
        super(posX, posY);

        this.posX = posX;
        this.posY = posY;
        this.genSprite();
        this.xVel = 0;
        this.yVel = 0;

    }


    genSprite()
    {
        console.log("posX: ", this.posX)
        console.log("posY: ", this.posY)
        this.sprite = document.createElement('img');
        this.sprite.src = 'img/ship';
        this.sprite.style.width = 55 + 'px';
        this.sprite.style.height = 55 + 'px';
        this.sprite.style.color = 'blue';
        this.sprite.style.backgroundColor = 'red';
        this.sprite.alt = 'Ship';
        this.sprite.style.position = 'absolute';
        this.sprite.style.top = this.posY + 'px';
        this.sprite.style.left = this.posX + 'px';
        this.sprite.style.boxShadow = '1px 1px rgba(20, 20, 20, 1)';
        console.log(this.sprite.style.left);
    }

    updateSprite()
    {
        this.sprite.style.left = this.posX + 'px';
    }
}

class Enemy extends Ship
{
    constructor()
    {
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    game.renderInitial();

    // Event Listeners
/*
    document.addEventListener('keypress', function(e) {
        game.handleKeyEvent(e)
    });
*/

    document.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
        console.log(e.keyCode, 'Down');
    });

    document.addEventListener('keyup', function(e) {
        delete keys[e.keyCode];
        console.log(e.keyCode, 'Up');
    });

//    setInterval(gameLoop, 2000);
}

function gameLoop()
{
    game.move();

    game.update();
    game.render();
    window.requestAnimationFrame(gameLoop);
}



/******************************/
/*            Main            */
/******************************/

const game = new Game();

init();
window.requestAnimationFrame(gameLoop);
