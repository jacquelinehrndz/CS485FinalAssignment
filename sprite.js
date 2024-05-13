const idle_state = ["idle"]

//total of 10 sprites
class Sprite
{
    constructor(data, numberofBoids) {
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
    }

    preloadAnimations() {
        // Preload images for each animation
        for (let animation in this.data.TenderBud) {
            let frames = this.data.TenderBud[animation].length;
            this.loadedImgs[animation] = [];
            for (let i = 0; i < frames; i++) {
                let animationPath = `sprite/Penquins/TenderBud/${animation}/${i}.png`;
                this.loadedImgs[animation].push(loadImage(animationPath));
            }
        }
    }

    updatePosition() {
        for (let boid of this.flock) {
            boid.flock(this.flock);
            boid.update();
            //boid.limitSpeed(); // Limit speed
            boid.checkEdges(); // Check for boundary collisions

            boid.show();

            this.x = boid.position.x; 
            this.y = boid.position.y; 
        }
    }

    display() {
        // Get the frames for the current animation
        let frames = this.loadedImgs[this.currentAnimation];
        // Calculate the current frame number based on the number of frames
        this.currentFrame = (this.currentFrame + 1) % frames.length;
        // Draw the current frame
        image(frames[this.currentFrame], this.x, this.y);
    }

    changeAnimation(animation) {
        this.currentAnimation = animation;
        // Reset the current frame when animation changes
        this.currentFrame = 0;
    }
    getImageData(){
        return this.loadedImgs[this.currentAnimation][this.currentFrame]
    }
}