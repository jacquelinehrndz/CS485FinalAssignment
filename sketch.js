//global variables
let bk;
let sprites;
//let penguin;
let numberofBoids = 5;

//declaring flock (array)
const flock = [];

//resize function
function windowResize()
{
    resizeCanvas(windowWidth, windowHeight);
}

//preloading
function preload()
{
    //loading json file
    sprites = loadJSON("sprite/Penguins/animationData.json");
    //loading bk
    bk = loadImage("imgs/0.png")
}

function setup()
{
    createCanvas(windowWidth, windowHeight);
    //creating a bunch of boids 
    for(let i = 0; i < numberofBoids; i++)
        {
            //adding boid to flock array
            flock.push(new Boid());
        }
    //penguin = new Penguin(100, 100, "idle", sprites)
    //penguin.load();
}

function draw()
{
    background(bk);
    //display flock
    for(let boid of flock)
        {
            //make boids reappear if the reach edges
            boid.edges();
            //boids doing alignment rule
            boid.flock(flock);
            boid.update();
            boid.show();
        }
    /*
    background(bk);
    for (let i = flock.length - 1; i >= 0; i--)
    {
        let boid = flock[i];
        let sprite = flock[i].sprite;
        if (checkCollision(player, sprite))
        {
            console.log("Collision detected between player and sprite");
            //we can remove from the array
            //sprites.splice(i, 1);
            flock.splice(i, 1);
        }
        else
        {
          // sprite.updatePosition();
          // sprite.display();
            //Assign each boid to the boids flock and update/display position
            boid.flock(flock);
            boid.update();
            boid.checkEdges(); // Check for boundary collisions
            //boid.limitSpeed(); // Limit speed
            boid.show();
        }
    }

    //update penguin object
    penguin.display();

    function checkCollision(obj1, obj2)
    {
        // Check if animation frames are loaded
        if (obj1.animationFrames.length === 0 || obj2.loadedImgs[obj1.animation] === undefined)
            {
                return false; 
            }
    
        let obj1Frame = obj1.getImageData()
        let obj2Frame = obj2.getImageData();
    
        //need to be defined to not get hight/width error
        if (!obj1Frame || !obj2Frame)
            {
                return false; 
            }
    
        //get player paramters 
        let obj1Left = obj1.x;
        let obj1Right = obj1.x + obj1Frame.width;
        let obj1Top = obj1.y;
        let obj1Bottom = obj1.y + obj1Frame.height;
    
        //get sprite parameters
        let obj2Left = obj2.x;
        let obj2Right = obj2.x + obj2Frame.width;
        let obj2Top = obj2.y;
        let obj2Bottom = obj2.y + obj2Frame.height;
    
        //if collision
        if (obj1Right > obj2Left && obj1Left < obj2Right && obj1Bottom > obj2Top && obj1Top < obj2Bottom) {
            return true; 
        }
        //no collision
        return false; 
    }
*/
}