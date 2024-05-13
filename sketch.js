//declaring flock (array)
const flock = [];

function setup()
{
    createCanvas(640, 360);
    //creating a bunch of boids 
    for(let i = 0; i < 3; i++)
        {
            //adding boid to flock array
            flock.push(new Boid());
        }
}

function draw()
{
    background(51);

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