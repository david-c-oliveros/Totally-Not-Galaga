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
            if (this.hero.xPos < 0)
            {
                this.hero.xPos = 1;
            } else
            {
                console.log('LEFT');
                this.hero.xVel -= MOVE_SPEED;
                this.hero.xPos += this.hero.xVel;
            }
        } else
        {
            this.hero.xVel = 0;
        }

        if (keys[68])
        {
            if (this.hero.xPos > SCREEN_WIDTH)
            {
                this.hero.xPos = SCREEN_WIDTH - 1;
            } else
            {
                console.log('RIGHT');
                this.hero.xVel += MOVE_SPEED;
                this.hero.xPos += this.hero.xVel;
            }
        } else
        {
            this.hero.xVel = 0;
        }

        if (keys[83])
        {
            this.hero.yVel -= MOVE_SPEED;
            this.hero.yPos -= game.hero.yVel;
            this.hero.sprite.style.top = game.hero.yPos;
        }

        if (keys[87])
        {
            this.hero.yVel += MOVE_SPEED;
            this.hero.yPos += game.hero.yVel;
            this.hero.sprite.style.top = game.hero.yPos;
        }

        if (keys[80])
        {
            console.log(this.hero.xVel);
        }
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
    constructor(xPos, yPos)
    {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}


class Hero extends Ship
{
    constructor(xPos, yPos)
    {
        super(xPos, yPos);

        this.xPos = xPos;
        this.yPos = yPos;
        this.genSprite();
        this.xVel = 0;
        this.yVel = 0;

    }


    genSprite()
    {
        console.log("xPos: ", this.xPos)
        console.log("yPos: ", this.yPos)
        this.sprite = document.createElement('img');
        this.sprite.src = 'img/ship';
        this.sprite.style.width = 55 + 'px';
        this.sprite.style.height = 55 + 'px';
        this.sprite.style.color = 'blue';
        this.sprite.style.backgroundColor = 'red';
        this.sprite.alt = 'Ship';
        this.sprite.style.position = 'absolute';
        this.sprite.style.top = this.yPos + 'px';
        this.sprite.style.left = this.xPos + 'px';
        this.sprite.style.boxShadow = '1px 1px rgba(20, 20, 20, 1)';
        console.log(this.sprite.style.left);
    }

    updateSprite()
    {
        this.sprite.style.left = this.xPos + 'px';
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
    });

    document.addEventListener('keyup', function(e) {
        delete keys[e.keyCode];
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
