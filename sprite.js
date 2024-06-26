//Parent sprite class
//code from lecture
class Sprite
{
    constructor(sprite_json, x, y, start_state)
    {
        /*
        this.data = data;
        // boid array
        this.flock = [];

        //push new instances of boids into the array
        for (let i = 0; i < numberofBoids; i++) {
            this.flock.push(new Boid());
        }
        this.x = width / 2;
        this.y = height / 2;
        this.currentAnimation = 'idle'; // Initial animation state
        this.loadedImgs = {}; 
        this.currentFrame = 0; // Current frame number
        */
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "penguin";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.x_v = 0;
        this.y_v = 0;

        //used for boids
        //setting velocity
        this.set_v = 5;
        //
        this.idle = false;
        this.count = 1;
    }

//Profs code
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

        if(this.count % 10 == 0){
            this.cur_frame = this.cur_frame + 1;
            this.count = 1;
        }

        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            //console.log(this.cur_frame);
            this.cur_frame = 0;
        }

        //If key input, move and update our animations based on velocity
        if(state['key_change'] == true){
            this.move(state['key_press']);
            this.update_animation();
        }
        else
        { //If no key input no movement
            this.x_v = 0;
            this.y_v = 0;
        }

        if(this.idle == false){
            
            //Borders
            if(this.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) ){//Right
                if(state['key_press']["RIGHT"] != null){ //These checks allow us to keep moving at the screen border, without leaving the screen.
                    this.x_v = 0;
                }
            }
            if(this.x <= 0){ //Left
                if(state['key_press']["LEFT"] != null){
                    this.x_v = 0;
                }
            }
            if(this.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) ){ //Bottom
                if(state['key_press']["DOWN"] != null){
                    this.y_v = 0;
                }
            }
            if(this.y <= 0){ //Top
                if(state['key_press']["UP"] != null){
                    this.y_v = 0;
                }
            }
            
            //move whule not idle
            this.x = this.x + this.x_v;
            this.y = this.y + this.y_v;
                
            //If we have no velocity and no key inputs, set ourselves to idle. By checking for key input it allows us to keep playing movement animations at screen border to create cleaner gameplay
            if(this.x_v == 0 && this.y_v == 0 && state['key_change'] == false){
                this.set_idle_state();
            }
        }

        this.detect_collision(state['foreground_sprites']);

        return false;
    }

    set_idle_state(){
        this.idle = true;
        this.x_v = 0;
        this.y_v = 0;
        
        const idle_state = ["idle"];

        const random = Math.floor(Math.random() * idle_state.length);
        console.log(idle_state[random]);
        this.state = "idle";
        this.cur_frame = 0;
        
        
    }

    bound_hit(side)
    {
            this.set_idle_state();
    } 

    move(key){
            this.idle = false;

            if(key["UP"] != null){
                this.y_v = -this.set_v;
            } else if (key["DOWN"] != null){
                this.y_v = this.set_v;
            } else {
                this.y_v = 0;
            }

            if(key["RIGHT"] != null){
                this.x_v = this.set_v;
            } else if (key["LEFT"] != null) {
                this.x_v = -this.set_v;
            } else {
                this.x_v = 0;
            }
    }

    //function used for interaction if collision
    detect_collision(others){
    //others in this context is snowballs
       for(var i = 0; i < others.length; i++)
        {
            //if collided with any sprites
            if( this.x <= (others[i].x + others[i].sprite_json[others[i].root_e][others[i].state][others[i].cur_frame]['w']) &&
                (this.x + this.sprite_json[this.root_e][this.state][this.cur_frame]['w']) >= others[i].x && 
                this.y <= (others[i].y + others[i].sprite_json[others[i].root_e][others[i].state][others[i].cur_frame]['h']) && 
                (this.y + this.sprite_json[this.root_e][this.state][this.cur_frame]['h']) >= others[i].y){
                    
                    //INTERACTION
                    //delete or "splice" snowballs if collided
                    if(others[i].constructor.name == "BoidSnowball"){
                        others.splice(i, 1);
                    }  
            }
        }
    }

    update_animation(){
        //Change animation
        //if move left
        if(this.x_v > 0)
            {
            //change animation to walk_E
            this.state = "walk_E";
        }
        //if move right
        else if(this.x_v < 0)
            {
                //change animation
            this.state = "walk_W";
        }

        //if out of bounds curr fram to 0
        if(this.cur_frame >= this.sprite_json[this.root_e][this.state].length){
            this.cur_frame = 0;
        }
    }

}
