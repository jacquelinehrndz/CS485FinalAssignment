class Boid
{
    constructor()
    {
        //position in middle of window
        this.position = createVector(width/2, height/2);
        this.velocity = createVector();
        this.acceleration = createVector();
    }

    //function to "show" boids as points for now
    show()
    {
        strokeWeight(16);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}