/*****************************/
/*         Constants         */
/*****************************/

// const SCREEN_WIDTH = document.querySelector('#width').offsetWidth;
// const SCREEN_HEIGHT= document.querySelector('#width').offsetHeight;
const SCREEN_WIDTH = document.querySelector('#canvas').offsetWidth;
const SCREEN_HEIGHT = document.querySelector('#canvas').offsetHeight;
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
        this.canvas = document.querySelector('body');
        this.canvasStyle = window.getComputedStyle(canvas);
        console.log(this.canvasStyle.getPropertyValue('background-color'));
        console.log(this.openPos.x, this.openPos.y);
    }


    update()
    {
    }

    handleKeyEvent()
    {
        // A Key
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

        // D Key
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
                this.addEnemy(new Enemy(this.openPos.x, this.openPos.y, globalColor));
                console.log('Adding new enemy at position (', this.openPos.x, this.openPos.y + ')');
            } else if (this.openPos.x >= SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
            {
                this.openPos.x = 20;
                this.openPos.y += 70;
                this.addEnemy(new Enemy(this.openPos.x, this.openPos.y));
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

        // Space Key
        if (keys[32])
        {
            console.log('FIRE!');
        }
    }


    addPlayer(object)
    {
        this.players.push(object);
        this.addDomElement(this.players[this.players.length - 1].sprite);
    }


    addEnemy(object)
    {
        this.enemies.push(object);
        this.addDomElement(this.enemies[this.enemies.length - 1].sprite);
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
    constructor(xPos, yPos)
    {
        this.xPos = xPos;
        this.yPos = yPos;
    }
}


class Ship extends Obj
{
    constructor(xPos, yPos)
    {
        super(xPos, yPos);
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
    }

    updateSprite()
    {
        this.sprite.style.left = this.xPos + 'px';
    }
}


class Enemy extends Ship
{
    constructor(xPos, yPos, color = 'blue')
    {
        super(xPos, yPos);
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.shipColor = color;
        this.genSprite();
    }

    genSprite()
    {
        this.sprite = document.createElement('img');
        this.sprite.src = 'img/ship';
        this.sprite.style.width = 55 + 'px';
        this.sprite.style.height = 55 + 'px';
        this.sprite.style.color = this.shipColor;
        this.sprite.style.backgroundColor = this.shipColor;
        this.sprite.alt = 'Ship';
        this.sprite.style.position = 'absolute';
        this.sprite.style.top = this.yPos + 'px';
        this.sprite.style.left = this.xPos + 'px';
        this.sprite.style.boxShadow = '1px 1px rgba(20, 20, 20, 1)';
        console.log(this.sprite.style.backgroundColor);
    }

    updateSprite()
    {
        this.sprite.style.left = this.xPos + 'px';
        this.sprite.style.top = this.yPos + 'px';
    }
}


class Projectile extends Obj
{
    constructor(xPos, yPos)
    {
        super(xPos, yPos);
        this.xPos = xPos;
        this.yPos = yPos;
    }
}




/*******************************/
/*          Functions          */
/*******************************/

function init()
{
    game.addPlayer(new Hero(SCREEN_WIDTH / 2, SCREEN_HEIGHT - (SCREEN_HEIGHT / 10)));
    game.addEnemy(new Enemy(20, 50, 'red'));

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
        console.log(e.keyCode);
        delete keys[e.keyCode];
    });

//    setInterval(gameLoop, 2000);
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

init();
window.requestAnimationFrame(gameLoop);
