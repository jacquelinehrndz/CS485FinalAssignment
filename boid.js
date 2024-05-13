class Boid
{
    constructor()
    {
        //position at random places on screen
        this.position = createVector(random(width), random(height));
        //function that gives random velocity vector
        this.velocity = p5.Vector.random2D();
        //change velocity
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;

        //sprites
        //make sprites follow boids
        //this.sprite = new Sprite(penguins, 0);
        //this.sprite.preloadAnimations();
    }


    //make boids reappear
    edges()
    {
        if(this.position.x > width)
            {
                this.position.x = 0;
            }
        else if(this.position.x < 0)
            {
                this.position.x = width;
            }
        if(this.position.y > height)
            {
                this.position.y = 0;
            }
        else if(this.position.y < 0)
            {
                this.position.y = height;
            }
    }

    //align function - going to get an array of other boids
    align(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        let steering = createVector();
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                //calculating distance between "this" boid and "other" boid
                let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
                //id d less than 100 add up, and ignore "self"
                if(other != this && d < perceptionRadius)
                    {
                        //adding up velocities
                        steering.add(other.velocity);
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                steering.div(total);
                //go in direction of neighbors @ max speed
                steering.setMag(this.maxSpeed);
                //this.velocity = avg
                steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                steering.limit(this.maxForce);
            }
        return steering;
    }

    //cohesion function - going to get an array of other boids
    cohesion(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        let steering = createVector();
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                //calculating distance between "this" boid and "other" boid
                let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
                //id d less than 100 add up, and ignore "self"
                if(other != this && d < perceptionRadius)
                    {
                        //adding up velocities
                        steering.add(other.position);
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                steering.div(total);
                //sub position out 
                steering.sub(this.position);
                //go in direction of neighbors @ max speed
                steering.setMag(this.maxSpeed);
                //this.velocity = avg
                steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                steering.limit(this.maxForce);
            }
        return steering;
    }

    seperation(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        let steering = createVector();
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                //calculating distance between "this" boid and "other" boid
                let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
                //id d less than 100 add up, and ignore "self"
                if(other != this && d < perceptionRadius)
                    {
                        let diff = p5.Vector.sub(this.position, other.position);
                        diff.mult(d);
                        //adding up velocities
                        steering.add(diff);
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                steering.div(total);
                //sub position out 
                steering.sub(this.position);
                //go in direction of neighbors @ max speed
                steering.setMag(this.maxSpeed);
                //this.velocity = avg
                steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                steering.limit(this.maxForce);
            }
        return steering;
    }

    //f = m*a
    flock(boids)
    {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);
    }

    //make boid move
    update()
    {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        //update sprites
        //this.sprite.x = this.position.x;
        //this.sprite.y = this.position.y;
        //this.sprite.display();
    }

    //function to "show" boids as points for now
    show()
    {
        strokeWeight(8);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}