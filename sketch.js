//declaring flock (array)
const flock = [];

function setup()
{
    createCanvas(640, 360);
    //adding boid to flock array
    flock.push(new Boid());
}

function draw()
{
    background(51);

    //display flock
    for(let boid of flock)
    {
        boid.show();
    }
}