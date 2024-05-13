class Penguin
{
    constructor(x, y, animation, data)
    {
        this.x = x;
        this.y = y;
        this.x_velocity = 0;
        this.y_velocity = 0;
        this.animation = animation;
        this.frame = 0;
        this.currentFrame = 0;
        this.data = data;
        this.animationFrames = [];
    }

    load()
    {
        let animationLength = this.data.TenderBud[this.animation].length;
        for (let i = 0; i < animationLength; i++) {
            let imagePath = `sprite/Penguins/TenderBud/${this.animation}/${i}.png`;
            let img = loadImage(imagePath);
           // console.log(imagePath)
            this.animationFrames.push(img);
        }
    }

    display()
    {
        image(this.animationFrames[this.currentFrame], this.x, this.y);
        this.currentFrame = (this.currentFrame + 1) % this.animationFrames.length;
    }

    updatePosition()
    {
        this.x += this.x_velocity;
        this.y += this.y_velocity;
    }

    getImageData()
    {
        return this.animationFrames[this.currentFrame]
    }

}
