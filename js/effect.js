class Effect{
    
    constructor(effName, effScript)
    {
        this.name = effName;
        this.script= effScript;
        this.id = effName.toString().toLowerCase().replace(/ /gi, '-');
        this.rendered = false;
        this.data_image=null;
        this.data_session_id = 0;
        
        this.container = document.createElement('div');
        this.container.setAttribute('id',this.id);
        this.container.setAttribute('class','effect');
        
        this.title = document.createElement('div');
        this.title.innerHTML=this.name;
        this.container.appendChild(this.title);
        
        this.image = document.createElement('img');
        this.image.setAttribute('src','/img/effects-previews/'+this.id+'.jpg');
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
    
    if (confirm('Apply this effect?')) {
        $('#cartoonCanvas').css('display','none');

        let effect = getEffectCtrlByName(this.getAttribute('data-name'));
        lastAppliedEffectId = effect.id;
        if (effect.rendered==true && effect.data_image!=null)
        {
            $('#result_img').attr('src',effect.data_image);
        }
        else
        {
            effect.doEffectRequest(effect);
        }
      }  
    }

    doEffectRequest(effect)
    {
        // Form Data
        var formData = new FormData();
        formData.set("session_id", effect.data_session_id);
        formData.set("effect", effect.id);
        formData.set("rotation", rotation);

        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                effect.UpdateData(this.responseText);
            }
        };
        request.open('POST', effect.script);
        request.send(formData);            
        $('#result_img').css('opacity','0');
        let margin = $('#cartoon').height() - $('#result_img').height()/2 - 24;
        $('#progress').css('display','block');
        $('#progress').css('margin-top',-margin+'px');

    }
    
    UpdateData(data){
        console.dir(data);
        let data_arr = JSON.parse(data);
        this.data_image = data_arr.image;
        //$('#'+this.id+'_img').attr('src', data_arr.image);
        
        //Main preview
        $('#cartoonCanvas').css('display','block');
        $('#progress').css('display','none')
        $('#result_img').css('opacity','1');
        let suffix = '?' + new Date().getTime();
        $('#result_img').attr('src',data_arr.image + suffix);
        $('#cartoon_res_url').val(data_arr.image);
        $('#cartoon_res_url').focus(function() { $(this).select(); } );
        
        //Rendered
        this.rendered = true;
        cManager.render();
    }
    
}


function getEffectCtrlByName(name){
    for(let i=0; i<effects.length; i++)
        if (effects[i].ctrl.name==name)
            return effects[i].ctrl;
    return null;
}
