class TextEffect{
    constructor(text, color, useBackground, background, size, fontFamily, fontWeight, width, height){
        this.text = text;
        this.color = color;
        this.useBackground = useBackground;
        this.background = background;
        this.size = size;
        this.fontFamily = fontFamily;
        this.fontWeight = fontWeight;
        this.x = null;
        this.y = null;
        this.offsetX=0;
        this.offsetY=0;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.active = true;
    }
    
    prerender(cntx)
    {
        cntx.font = this.size+'px '+this.fontFamily;
        cntx.textAlign = 'start';
        cntx.textBaseline = 'top';
        this.textWidth = cntx.measureText(this.text).width;
        if (this.x == null && this.y==null)
        {
            this.x = (this.canvasWidth - this.textWidth) / 2;
          //  this.y = (this.canvasHeight - parseInt(this.size)) / 2;
          //  if (isMobile.any())
            this.y = (this.canvasHeight - parseInt(this.size));
        }
        
        if (this.useBackground==true)
        {
            cntx.fillStyle = this.background;
            cntx.fillRect(this.x, this.y, this.textWidth, parseInt(this.size));
        }
        cntx.fillStyle = this.color;  
        cntx.fillText(this.text, this.x, this.y);                     
    }

    render(cntx)
    {
        cntx.font = this.size+'px '+this.fontFamily;
        cntx.textAlign = 'start';
        cntx.textBaseline = 'top';
        this.textWidth = cntx.measureText(this.text).width;
        if (this.x == null && this.y==null)
        {
            this.x = (this.canvasWidth - this.textWidth) / 2;
        //    this.y = (this.canvasHeight - parseInt(this.size)) / 2;
        //     if (isMobile.any())
            this.y = (this.canvasHeight - parseInt(this.size));
        }
        if (this.active==true)
        {
            cntx.strokeStyle = '#00FF00'; 
            cntx.strokeRect(this.x, this.y, this.textWidth, parseInt(this.size));
            
            let boxSize = 8;

            cntx.strokeRect(this.x-boxSize/2, this.y-boxSize/2, boxSize, boxSize);
            cntx.strokeRect(this.x-boxSize/2+this.textWidth, this.y-boxSize/2, boxSize, boxSize);
            cntx.strokeRect(this.x-boxSize/2, this.y-boxSize/2 + parseInt(this.size), boxSize, boxSize);
            cntx.strokeRect(this.x-boxSize/2+this.textWidth, this.y-boxSize/2 + parseInt(this.size), boxSize, boxSize);
        }
        
        if (this.useBackground==true)
        {
            cntx.fillStyle = this.background;
            cntx.fillRect(this.x, this.y, this.textWidth, parseInt(this.size));
        }
        cntx.fillStyle = this.color;  
        cntx.fillText(this.text, this.x, this.y);                     
    }
    
    hitTest(x,y){
        /*console.log('x='+x+',y='+y);
        console.log('x_min='+this.x+',x_max='+(this.x + this.textWidth));
        console.log('y_min='+this.y+',y_max='+(this.y + parseInt(this.size)));*/
        if (
                x>this.x && 
                x<this.x + this.textWidth &&
                y>this.y && 
                y<this.y + parseInt(this.size)
            )
            return true;
        else
            return false;
    }
    
    updatePos(x,y)
    {
        this.x = x - this.offsetX;
        this.y = y - this.offsetY;
    }
}