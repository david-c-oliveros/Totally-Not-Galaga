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
                this.addObject(new Enemy(this.openPos.x, this.openPos.y, globalColor), 'enemy');
                console.log('Adding new enemy at position (', this.openPos.x, this.openPos.y + ')');
            } else if (this.openPos.x >= SCREEN_WIDTH && this.openPos.y < SCREEN_HEIGHT)
            {
                this.openPos.x = 20;
                this.openPos.y += 70;
                this.addObject(new Enemy(this.openPos.x, this.openPos.y), 'enemy');
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
                this.addDomElement(this.players[this.players.length - 1].sprite);
                break;
            case('enemy'):
                this.enemies.push(object);
                this.addDomElement(this.enemies[this.enemies.length - 1].sprite);
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
