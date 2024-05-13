class BoidSnowball{
	constructor(sprite_json,start_state){
		//console.log("Inside constructor");
        this.sprite_json = sprite_json;

        this.root_e = "snowball";

        this.cur_frame = 0;

        this.idle = false;

		this.state = start_state;

        this.count = 1;

		// Accleration
		this.acceleration_X = 0;
		this.acceleration_Y = 0;

		// Flocking varibles
        this.maxforce = 0.2;

        this.maxSpeed = 4;
		this.perception = 50;
		
		// Alignment
		this.alignment_Scalar = 0.5;
		// Cohesion
		this.cohesion_Scalar = 1.0;
		// Separation
		this.separation_Scalar = 1.0;
		
		// Random position
        this.x = this.random_pos_x();
        this.y = this.random_pos_y();
		
		// Random velocity
        this.x_v = this.random_velo();
        this.y_v = this.random_velo();
    }
	
	edges(width, height) {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
		if (this.y > height) {
			this.y = 0;
		} else if (this.y < 0) {
			this.y = height;
		}
	}
	
	checkCollisions(boids) {
        for (let other of boids) {
            if (other !== this) {
                let dx = this.x - other.x;
                let dy = this.y - other.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let minDistance = this.sprite_json[this.root_e][this.state][this.cur_frame]['w'] / 2 + this.sprite_json[this.root_e][this.state][this.cur_frame]['w'] / 2;

                if (distance < minDistance) {
                    // Simple response: move away from the collision point
                    let overlap = minDistance - distance;
                    let adjustX = (dx / distance) * overlap / 2;
                    let adjustY = (dy / distance) * overlap / 2;

                    this.x += adjustX;
                    this.y += adjustY;
                    other.x -= adjustX;
                    other.y -= adjustY;
                }
            }
        }
    }

	draw(state){
        var ctx = canvas.getContext('2d');

        if( this.cur_bk_data != null){
            ctx.putImageData(this.cur_bk_data , (this.x - this.x_v) , (this.y - this.y_v));
        }

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
            //console.log(this.cur_frame);
            this.cur_frame = 0;
        }
            
        // Update velocity
		this.x_v += this.acceleration_X;
		this.y_v += this.acceleration_Y;

		// Clamp the velocity to maxSpeed
		let speed = Math.sqrt(this.x_v * this.x_v + this.y_v * this.y_v);
		if (speed > this.maxSpeed) {
			this.x_v = (this.x_v / speed) * this.maxSpeed;
			this.y_v = (this.y_v / speed) * this.maxSpeed;
		}

		// Update position
		this.x += this.x_v;
		this.y += this.y_v;

		// Reset acceleration to 0 after each update
		this.acceleration_X = 0;
		this.acceleration_Y = 0;

        this.update_animation();

        return false;    
    }


    set_idle_state(){
        this.idle = true;
        this.x_v = 0;
        this.y_v = 0;
        
        const idle_state = ["idle"];

        const random = Math.floor(Math.random() * idle_state.length);
        // console.log(idle_state[random]);
        this.state = idle_state[random];
        this.cur_frame = 0;
    }

    flock(boids){
        this.align(boids);
        this.cohesion(boids);
        this.separation(boids);
		this.checkCollisions(boids);
    }

	align(boids){
		let perceptionRadius = this.perception;
		let total = 0;
		let steering_x = 0;
		let steering_y = 0;

		for(let other of boids){
			let a = this.x - other.x;
			let b = this.y - other.y;
			let d = Math.sqrt(a*a + b*b);

			if(other !== this && d < perceptionRadius){
				steering_x += other.x_v;
				steering_y += other.y_v;
				total++;
			}
		}
		if(total > 0){
			steering_x /= total;
			steering_y /= total;

			// Adjust steering to average direction and subtract current velocity
			steering_x -= this.x_v;
			steering_y -= this.y_v;

			// Normalize and apply maxforce
			let mag = Math.sqrt(steering_x * steering_x + steering_y * steering_y);
			if (mag > this.maxforce) {
				// normalize 			
				steering_x /= mag;
				steering_y /= mag;
				steering_x *= this.maxforce;
				steering_y *= this.maxforce;
			}
			
			steering_x *= this.alignment_Scalar;
			steering_y *= this.alignment_Scalar;
			
			// Add steering force to acceleration
			this.acceleration_X += steering_x;
			this.acceleration_Y += steering_y;
		}
	}

	cohesion(boids){
		let perceptionRadius = 100;
		let steering_x = 0;
		let steering_y = 0;

		let total = 0;
		for(let other of boids){
			let a = this.x - other.x;
			let b = this.y - other.y;
			let d = Math.sqrt(a * a + b * b);

			if(other !== this && d < perceptionRadius){
				steering_x += other.x;
				steering_y += other.y;
				total++;
			}
		}
		if(total > 0){
			steering_x /= total;
			steering_y /= total;
			steering_x -= this.x;
			steering_y -= this.y;

			// Normalize and apply maxforce
			let mag = Math.sqrt(steering_x * steering_x + steering_y * steering_y);
			if (mag > this.maxforce) {
				// normalize 			
				steering_x /= mag;
				steering_y /= mag;
				steering_x *= this.maxforce;
				steering_y *= this.maxforce;
			}

			steering_x *= this.cohesion_Scalar;
			steering_y *= this.cohesion_Scalar;

			// Add steering force to acceleration
			this.acceleration_X += steering_x;
			this.acceleration_Y += steering_y;
		}
	}

	separation(boids){
		let perceptionRadius = this.perception;
		let total = 0;
		let steering_x = 0;
		let steering_y = 0;

		for(let other of boids){
			let a = this.x - other.x;
			let b = this.y - other.y;
			let d = Math.sqrt(a * a + b * b);

			if(other !== this && d < perceptionRadius && d > 0){ // Ensuring d is positive to avoid division by zero
				let diff_x = this.x - other.x;
				let diff_y = this.y - other.y;
				diff_x /= d; // Normalize the difference
				diff_y /= d;
				steering_x += diff_x;
				steering_y += diff_y;
				total++;
			}
		}
		if(total > 0){
			steering_x /= total;
			steering_y /= total;

			// Normalize and apply maxforce
			let mag = Math.sqrt(steering_x * steering_x + steering_y * steering_y);
			if (mag > this.maxforce) {
				// normalize 			
				steering_x /= mag;
				steering_y /= mag;
				steering_x *= this.maxforce;
				steering_y *= this.maxforce;
			}
			
			steering_x *= this.separation_Scalar;
			steering_y *= this.separation_Scalar;
			
			// Add steering force to acceleration
			this.acceleration_X += steering_x;
			this.acceleration_Y += steering_y;
		}
	}

    bound_hit(side)
    {
        this.set_idle_state();
    } 

	random_velo() {
		// console.log("maxSpeed:", this.maxSpeed); 
		return (Math.random() * 2 * this.maxSpeed) - this.maxSpeed;
	}

    random_pos_x(){
        // var rand = Math.floor(Math.random() * (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']));
        var rand = Math.floor(Math.random() * (window.innerWidth));

        return rand;
    }

    random_pos_y(){
        // var rand = Math.floor(Math.random() * (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']));
        var rand = Math.floor(Math.random() * (window.innerHeight));

        return rand;
    }

    update_animation(){
        //Check if our new animation will put us out of bounds, and if so set current frame to 0
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
    }
}