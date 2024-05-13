class Boid
{
    constructor(sprite_json, start_state)
    {
        //declaring & initializing sprites
        this.sprite_json = sprite_json;
        this.state = start_state;
        this.root_e = "TenderBud";

        //initializing foreground and backgroud sprites
        this.cur_frame = 0;
        this.cur_bk_data= null;

        //position at random places on screen
        //code from vid
        /*
        this.position = createVector(random(width), random(height));
        //function that gives random velocity vector
        this.velocity = p5.Vector.random2D();
        //change velocity
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        */

        //converting code from YT vid to context of proj
        //need to create velocities for x and y axis
        this.x_v = this.random_velocity();
        this.y_v = this.random_velocity();

        //setting accelarations for x and y axis
        this.x_a = 0;
        this.y_a = 0;

        //penguin starts off still
        this.idle = false;

        //only one 
        this.count = 1;

        this.x = this.random_pos_x();
        this.y = this.random_pos_y();

        //setting speeds for penguin
        this.maxforce = 0.2;
        this.maxSpeed = 4;
    }

    draw(state)
    {
        var ctx = canvas.getContext('2d');

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

        //image data
        this.cur_bk_data = ctx.getImageData(this.x, this.y, 
            this.sprite_json[this.root_e][this.state][this.cur_frame]['w'], 
            this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);

        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.x, this.y );

        this.count += 1;

        if(this.count % 3 == 0){
            this.cur_frame = this.cur_frame + 1;
            this.count = 1;
        }
            

        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }

            if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){//Right
                this.x = 1;
            }
            if(this.x <= 0){ //Left
                this.x = window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']-1;
            }
            if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){ //Bottom
                this.y = 1;
            }
            if(this.y <= 0){ //Top
                this.y = window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']-1;
            }
            
            //movement
            this.x += this.x_v;
            this.y += this.y_v;

            this.x_v += this.x_a;
            this.y_v += this.y_a;

            this.x_a = 0;
            this.y_a = 0;

            //For X, set  to a magnitude to a max of maxForce
            if(this.x_v < -this.maxforce){
                this.x_v = -this.maxforce;
            } else if(this.x_v > this.maxforce){
                this.x_v = this.maxforce;
            }

            //For X, set  to a magnitude to a max of maxForce
            if(this.y_v < -this.maxforce){
                this.y_v = -this.maxforce;
            } else if(this.y_v > this.maxforce){
                this.y_v = this.maxforce;
            }

            if(this.x_v > 0 || this.y_v > 0){
                this.idle = false;
            }

        if(this.idle == false){ 
            //If we have no velocity and no key inputs, set ourselves to idle. By checking for key input it allows us to keep playing movement animations at screen border to create cleaner gameplay
            if(this.x_v == 0 && this.y_v == 0 && state['key_change'] == false){
                this.set_idle_state();
            }
        }

        this.update_animation();
        
        return false;     
    }

    set_idle_state()
    {
        this.idle = true;
        this.x_v = 0;
        this.y_v = 0;
        
        const idle_state = ["idle"];

        const random = Math.floor(Math.random() * idle_state.length);
        this.state = idle_state[random];
        this.cur_frame = 0;
    }

    /*
    //make boids reappear if they reach edges
    //code from vid
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
    */


    //align function - going to get an array of other boids
    align(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        //let steering = createVector();
        //same idea as video but needed for both axis
        let steering_x = 0;
        let steering_y = 0;
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                //calculating distance between "this" boid and "other" boid
                //let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
                //calculate distance
                //collecting data from x-axis
                var a = this.x-other.x;
                //collecting data from y axis
                var b = this.y-other.y;
                //calc distance
                var distance = Math.sqrt( a*a + b*b );

                //id d less than 100 add up, and ignore "self"
                if(other != this && d < perceptionRadius)
                    {
                        //adding up velocities
                        //steering_x.add(other.velocity);
                        steering_x.add(other.x_v);
                        steering_y.add(other.y_v);
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                //steering.div(total);
                //go in direction of neighbors @ max speed
                //steering.setMag(this.maxSpeed);
                //this.velocity = avg
                //steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                //steering.limit(this.maxForce);
                steering_x /= total;
                steering_y /= total;
                
                if(steering_x < 0)
                    steering_x = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_x = this.maxSpeed;
                if(steering_y < 0)
                    steering_y = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_y = this.maxSpeed;
       
                steering_x -= this.x_v
                steering_y -= this.y_v
    
                //limit x magnitude to a max of maxForce
                if(steering_x < -this.maxforce){
                    steering_x = -this.maxforce;
                } else if(steering_x > this.maxforce){
                    steering_x = this.maxforce;
                }
    
                //limit y magnitude to a max of maxForce
                if(steering_y < -this.maxforce){
                    steering_y = -this.maxforce;
                } else if(steering_y > this.maxforce){
                    steering_y = this.maxforce;
                }
            }
        //return steering;
        this.x_a += steering_x;
        this.y_a += steering_y;
    }

    //cohesion function - going to get an array of other boids
    cohesion(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        //let steering = createVector();
        let steering_x = 0;
        let steering_y = 0;
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                /*
                //calculating distance between "this" boid and "other" boid
                let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
                //id d less than 100 add up, and ignore "self"
                if(other != this && d < perceptionRadius)
                    {
                        //adding up velocities
                        steering.add(other.position);
                        total++;
                    }
                */
                    var a = this.x-other.x;
                    var b = this.y-other.y;
                    var distance = Math.sqrt( a*a + b*b );
        
                    if(other != this && d < perceptionRadius){
                        steering_x.add(other.x);
                        steering_y.add(other.y);
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                /*
                steering.div(total);
                //sub position out 
                steering.sub(this.position);
                //go in direction of neighbors @ max speed
                steering.setMag(this.maxSpeed);
                //this.velocity = avg
                steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                steering.limit(this.maxForce);
                */
                steering_x /= total;
                steering_y /= total;
                steering_x = steering_x - this.x
                steering_y = steering_y - this.y
    
                if(steering_x < 0)
                    steering_x = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_x = this.maxSpeed;
                if(steering_y < 0)
                    steering_y = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_y = this.maxSpeed;

                steering_x = steering_x - this.x_v
                steering_y = steering_y - this.y_v
                //limit x mag to force
                if(steering_x < -this.maxforce){
                    steering_x = -this.maxforce;
                } else if(steering_x > this.maxforce){
                    steering_x = this.maxforce;
                }
                //limit y mag to force
                if(steering_y < -this.maxforce){
                    steering_y = -this.maxforce;
                } else if(steering_y > this.maxforce){
                    steering_y = this.maxforce;
                }
            }
        //return steering;
        this.x_a += steering_x;
        this.y_a += steering_y;
    }

    seperation(boids)
    {
        //distance
        //radius
        let perceptionRadius = 50;
        //avg going to be a vector
        //let steering = createVector();
        let steering_x = 0;
        let steering_y = 0;
        //total
        let total = 0;
        //iterate
        for(let other of boids)
            {
                /*
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
                    */
                    var a = this.x-other.x;
                    var b = this.y-other.y;
                    var distance = Math.sqrt( a*a + b*b );
        
                    if(other != this && d < perceptionRadius){
                        var diff_x = this.x - other.x;
                        var diff_y = this.y - other.y;
        
                        diff_x /= d;
                        diff_y /= d;
        
                        steering_x += diff_x;
                        steering_y += diff_y;
                        total++;
                    }
            }
        //dividing sum to get avg
        if(total > 0)
            {
                /*
                steering.div(total);
                //sub position out 
                steering.sub(this.position);
                //go in direction of neighbors @ max speed
                steering.setMag(this.maxSpeed);
                //this.velocity = avg
                steering.sub(this.velocity);
                //limits magnitude/lenght of vector to maxForce
                steering.limit(this.maxForce);
                */
                steering_x /= total;
                steering_y /= total;
    
                if(steering_x < 0)
                    steering_x = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_x = this.maxSpeed;
                if(steering_y < 0)
                    steering_y = -this.maxSpeed;
                else if ((steering_y > 0))
                    steering_y = this.maxSpeed;
    
                steering_x -= this.x_v
                steering_y -= this.y_v
    
                
    
                //limit x magnitude to a max of maxForce
                if(steering_x < -this.maxforce){
                    steering_x = -this.maxforce;
                } else if(steering_x > this.maxforce){
                    steering_x = this.maxforce;
                }
    
                //limit y magnitude to a max of maxForce
                if(steering_y < -this.maxforce){
                    steering_y = -this.maxforce;
                } else if(steering_y > this.maxforce){
                    steering_y = this.maxforce;
                }
            }
        //return steering;
        this.x_a += steering_x;
        this.y_a += steering_y;
    }

    //f = m*a
    flock(boids)
    {
        this.align(boids);
        this.cohesion(boids);
        this.seperation(boids);
        /*
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);
        */
    }

    //make boid move
    /*
    update()
    {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

    }
*/
    //function to "show" boids as points for now
    /*
    show()
    {
        strokeWeight(8);
        stroke(255);
        point(this.position.x, this.position.y);
    */

    bound_hit(side)
    {
        this.set_idle_state();
    } 

    random_velocity(){
        var rand = Math.floor(Math.random() * 2);
        console.log(rand);
        if(rand == 0){
            return 10;
        } else if (rand == 1){
            return -10;
        }
    }

    random_pos_x(){
        var rand = Math.floor(Math.random() * (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']));
        return rand;
    }

    random_pos_y(){
        var rand = Math.floor(Math.random() * (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']));
        return rand;
    }


        update_animation(){
            //Change animation dependeing on user input (key press)
            if(this.x_v > 0 && this.y_v < 0){
                this.state = "walk_NE";
            }else if(this.x_v > 0 && this.y_v == 0){
                this.state = "walk_E";
            }else if(this.x_v < 0 && this.y_v == 0){
                this.state = "walk_W";
            }
    
            //put of bounds check
            if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
                this.cur_frame = 0;
            }
        }
}