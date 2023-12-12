class Original{
    
    constructor(session_id, source)
    {
        this.name = 'Original image';
        this.script= null;
        this.id = 'original';
        this.rendered = true;
        this.data_image=source;
        this.data_session_id = session_id;
        
        this.container = document.createElement('div');
        this.container.setAttribute('id',this.id);
        this.container.setAttribute('class','effect');
        
        this.title = document.createElement('div');
        this.title.innerHTML=this.name;
        this.container.appendChild(this.title);
        
        this.image = document.createElement('img');
        this.image.setAttribute('src',this.data_image);
        this.image.setAttribute('id', this.id+'_img');
        this.image.setAttribute('data-name', this.name);
        this.container.appendChild(this.image);
        
    }
    
    show(){
        var effects_list = document.querySelector('div#other_effects_left');
        if (effects_list!=null && typeof(effects_list)!='undefined')
        {
            effects_list.appendChild(this.container);
            this.initEvents();
        }
    }
    
    initEvents()
    {
        $('#'+this.id+'_img').click(this.imgClick);
    }
    
    imgClick()
    {
        if (original!=null && original.rendered==true && original.data_image!=null)
        {
            $('#result_img').attr('src',original.data_image);
        }

    }

    
}

