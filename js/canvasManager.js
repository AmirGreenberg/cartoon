class CanvasManager{
    constructor(canvasId){
        this.canvasId = canvasId;
        this.texts = new Array();
        this.equalizer = new Equalizer(0, 0, 0, 0);   
        this.dragMode=false;
        this.lastUpload = null;
    }
    
    initEvents()
    {
    //    if (isMobile.any())
    //        $('#'+this.canvasId).draggable();


        $('#'+this.canvasId).bind('touchmove mousemove', function (e) {
            

                var currentY = e.originalEvent.touches ?  e.originalEvent.touches[0].pageY : e.pageY;
                var currentX = e.originalEvent.touches ?  e.originalEvent.touches[0].pageX : e.pageX;
                let X = currentX-parseInt(this.style.left);
                let Y = currentY-parseInt(this.style.top);
                cManager.mouseMove({'offsetX':X,'offsetY':Y});
        });

        $('#'+this.canvasId).mousedown(
                function(event){
                    //Reset active texts
                    for(let i=0; i<cManager.texts.length; i++)
                        cManager.texts[i].active = false;
                    
                    //Set active text
                    for(let i=0; i<cManager.texts.length; i++)
                        if (cManager.texts[i].hitTest(event.offsetX, event.offsetY))
                    {
                        cManager.texts[i].active=true;
                        cManager.texts[i].offsetX = event.offsetX - cManager.texts[i].x;
                        cManager.texts[i].offsetY = event.offsetY - cManager.texts[i].y;
                        cManager.dragMode=true;
                        cManager.render();
                        
                        //Set actual settings
                        $('#font-picker').trigger('setFont',[cManager.texts[i].fontFamily, cManager.texts[i].fontWeight]);
                        fontFamily = cManager.texts[i].fontFamily;
                        fontWeight = cManager.texts[i].fontWeight;

                        let sizes = [16,18,20,22,24,26,28,32,36,48,54,66,72,80];
                        for(var n=0; n<sizes.length; n++)
                            if (sizes[n] == parseInt(cManager.texts[i].size))
                        {
                            let pval = 100*parseFloat(n)/sizes.length;
                            fontSize.setPercentage(pval);  
                        }

                        $('#font-size-value').val(cManager.texts[i].size);
                        $(".font-color").val(cManager.texts[i].color);
                        $(".font-color").asColorPicker('val', cManager.texts[i].color);
                        
                        $(".font-background-color").val(cManager.texts[i].background);
                        $(".font-background-color").asColorPicker('val', cManager.texts[i].background);

                        $('#use-backround').prop('checked',cManager.texts[i].useBackground);

                        $('.font-background-color').val(cManager.texts[i].background);
                        $('#the_text').val(cManager.texts[i].text);
                        
                        return;
                    }
                }
        );

        $('#'+this.canvasId).mouseup(
                function(event){
                    cManager.dragMode=false;
                }
        );
        this.render();
    }
    
    mouseMove(event){
        //console.log('x='+event.offsetX+', y='+event.offsetY);
        $('#'+this.canvasId).css('cursor', 'default');
        for(let i=0; i<this.texts.length; i++)
            if (this.texts[i].hitTest(event.offsetX, event.offsetY))
        {
            $('#'+this.canvasId).css('cursor', 'pointer');
            //console.dir(event);
            
            if (this.dragMode==true)
            {
                this.texts[i].updatePos(event.offsetX, event.offsetY);
                this.render();
            }
            return;
        }
        
    }
    
    addText(text, color, useBackground, background, size, fontFamily, fontWeight)
    {
        var canvas = document.getElementById(this.canvasId);
        for(let i=0; i<this.texts.length; i++)
            this.texts[i].active = false;
        var txt = new TextEffect(text, color, useBackground, background, size, fontFamily, fontWeight, canvas.offsetWidth, canvas.offsetHeight);
        this.texts.push(txt);  
        $('#text_delete').css('display','block');
    }
    
    deleteText()
    {
        for(let i=0; i<this.texts.length; i++)
            if (this.texts[i].active==true)
                this.texts.splice(i,1);
        this.render();
        
        if (this.texts.length==0)
            $('#text_delete').css('display','none');
    }
    
    addEqualizer(brightness, contrast, saturation, hue){
        this.equalizer = new Equalizer(brightness, contrast, saturation, hue);
    }
    
    cancelEqualizer()
    {
        this.equalizer = new Equalizer(0, 0, 0, 0);
    }
    
    render(){
        if (isMobile.any())
            window.scrollTo(0,0);
        
        var canvas = document.getElementById(this.canvasId);
      //  canvas.setAttribute('crossOrigin', 'anonymous');
        var cntx = canvas.getContext('2d');
        cntx.clearRect(0,0,canvas.width,canvas.height);

        this.equalizer.apply(cntx);
        

        for(let i=0; i<this.texts.length; i++)
            this.texts[i].prerender(cntx);

        //Upload results 
        var interval = 0;
        if (this.lastUpload!=null)
        {
            var last = new Date(this.lastUpload.toUTCString());
            var now = new Date();
            interval = (now - last); // The difference as milliseconds.
        }

        if (
            effects[0].ctrl!=null &&
            (this.lastUpload==null ||  interval>1000)
            )
        {

            var theImage = canvas.toDataURL("image/png");  

            var formData = new FormData();
            formData.set("session_id", effects[0].ctrl.data_session_id);
            formData.set("img", theImage);
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('Uploaded...');
                }
            };
            request.open('POST', "/uploader.php");
            request.send(formData);
            this.lastUpload = new Date();
        }
        
        for(let i=0; i<this.texts.length; i++)
            this.texts[i].render(cntx);
    }
    
    getActiveTextIndex()
    {
        for(let i=0; i<this.texts.length; i++)
            if (this.texts[i].active == true)
                return i;
        return null;
    }
}