class Equalizer{
    constructor (brightness, contrast, saturation, hue)
    {
        this.brightness = brightness;
        this.contrast = contrast;
        this.saturation = saturation;
        this.hue = hue;
    }
    
    apply(cntx, width, height){
        let filterVal = '';
        if (this.brightness!=0)
            filterVal += "brightness("+(100 + parseInt(this.brightness))+"%) ";
        if (this.contrast!=0)
            filterVal += "contrast("+ Math.exp(0.05*parseInt(this.contrast)) + ") ";
        if (this.saturation!=0)
            filterVal += "saturate("+(100 + 2*parseInt(this.saturation))+"%) ";
        if (this.hue!=0)
            filterVal += "hue-rotate("+(180*parseInt(this.hue)/50)+"deg) ";
        
        if (filterVal!='')
            cntx.filter = filterVal.trim();
        const image = document.getElementById('result_img');
        let left = - cntx.canvas.width*(zoom - 1);
        let top  = - cntx.canvas.height*(zoom - 1);
        cntx.drawImage(image, left, top, cntx.canvas.width*zoom, cntx.canvas.height*zoom);
        cntx.filter='none';
    }
}