//global variables
let bk;
let sprites;
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
    //sprites = loadJSON("sprite/Penguins/animationData.json");
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
}

function draw()
{
    background(bk);
/*
    for(let i = flock.length - 1; i >= 0; i--)
        {
            let boid = flock[i];
            let spr
        }
*/
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
}