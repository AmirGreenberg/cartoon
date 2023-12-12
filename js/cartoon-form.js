var zoom = 1;
var original = null;
var rotation = 0;
var lastAppliedEffectId="cartoon";
var cartoonMode = false;

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};    


$(window).load(function(){ 
    /*let htmlHeight = $('body').height();
    if (htmlHeight>=1200)
        $('#hero').height('calc(100vh - 356px)');
    $('#hero').css('max-height','unset');
    
    if ($('body').width()<640)
        $('#hero').height('auto');*/

    $('.form_ctrl').click(function(){
        $('#alert').hide();
    });
    
    $('#from_disk').click(function(){
        if (this.checked)
        {
            $('#from_disk_controls').show();
            $('#from_url_controls').hide();
        }
        else
        {
            $('#from_disk_controls').hide();
            $('#from_url_controls').show();            
        }
    });
    $('#from_url').click(function(){
        if (this.checked)
        {
            $('#from_disk_controls').hide();
            $('#from_url_controls').show();
        }
        else
        {
            $('#from_disk_controls').show();
            $('#from_url_controls').hide();            
        }        
    });
    $('#cartoonize').click(function(){
        //Checking
        let from_disk = $('#from_disk');
        let from_url = $('#from_url');
        let image_file = $('#image_file');
        let image_url = $('#image_url');
        
        if (
            (from_disk[0].checked==true && image_file.val()=='') ||
            (from_url[0].checked==true && image_url.val()=='')
            )
        {
            $('#alert').show();
        }
        else
        {        
            $('#progress-img').show();
            if (from_disk[0].checked==true) doSubmitFile(image_file[0]);
            if (from_url[0].checked==true) doSubmitUrl(image_url[0]);
            cartoonMode=true;
        }
    });
    $('#zoom-in').click(function(){
        if (zoom<4)
        {
            zoom+=0.1;
            let scale = 'scale('+zoom+')';
            $('#result_img').css('transform',scale);
            cManager.render();
        }
    });
    $('#zoom-out').click(function(){
        if (zoom>1)
        {
            zoom-=0.1;
            let scale = 'scale('+zoom+')';
            $('#result_img').css('transform',scale);
            cManager.render();
        }
    });
    $('#rotate').click(function(){
    	rotation+=90;
    	if (rotation>=360)
    		rotation = 0;

    	for(let i=0; i<effects.length; i++)
    		if (effects[i].ctrl.id==lastAppliedEffectId)
    		{
    			effects[i].ctrl.rendered = false;	
    			effects[i].ctrl.doEffectRequest(effects[i].ctrl);
    		}


    });
    
    $(window).on('resize orientationchange', function(e){		
		initInterface();
	});
});

function rotate(){
var id = 'result_img';//The ID of the <img> element you want to rotate
var deg = 90;//The rotation angle, in degrees
document.getElementById(id).style = 'transform: rotate(' + deg + 'deg)';
}


function doSubmitFile(fileSelect){
    // Form Data
    var formData = new FormData();
    formData.append("file", fileSelect.files[0]);
    formData.set("effect", effects[0].name.toString().toLowerCase());
    
    // Http Request  
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showMainEffect(this.responseText);
        }
    };
    request.open('POST', effects[0].script);
    request.send(formData);
}
  
function doSubmitUrl(fileURL){
    // Form Data
    var formData = new FormData();
    formData.set("url", fileURL.value);
    formData.set("effect", effects[0].name.toString().toLowerCase());
    
    //Run other effects processing
    //Toon
    var toon_request = new XMLHttpRequest();
    toon_request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showMainEffect(this.responseText);
        }
    };
    toon_request.open('POST', effects[0].script);
    toon_request.send(formData);
}  



function showMainEffect(data)
{
    console.dir(data);
    let data_arr = JSON.parse(data);
    
    $('#progress-img').hide();
    $('#cartoon_form').hide();
    $('#cartoon_form_results').show();
    $('#result_img').attr('src',data_arr.image);
    $('#result_img').attr('data',data_arr.session_id);
    
    let body_width = $('body').width();
    if (isMobile.any() && body_width<1024)
    {
        $('#result_img').css('max-width', body_width);        
        $('div.herocontent').addClass('hidden');

    }

    $('#result_img')[0].onload = function(){ initInterface(); }; 

    $('#cartoon_res_url').val(data_arr.image);
    $('#cartoon_res_url').focus(function() { $(this).select(); } );
    
    //Show effects
    $('#other_effects').css('left', 0);
    $('#other_effects').show();
    
    original = new Original(data_arr.session_id, data_arr.source);
    original.show();
    
    effects[0].ctrl = new Effect(effects[0].name,effects[0].script);
    effects[0].ctrl.data_session_id = data_arr.session_id;
    effects[0].ctrl.data_image = data_arr.image;
    effects[0].ctrl.show();
    $('#'+effects[0].ctrl.id+'_img').attr('src',data_arr.image);
    effects[0].ctrl.rendered=true;
    
    for(let i=1; i<effects.length; i++)
    {
        effects[i].ctrl = new Effect(effects[i].name,effects[i].script);
        effects[i].ctrl.data_session_id = data_arr.session_id;
        effects[i].ctrl.show();
    }


    //Tools
    $('#tools').css('right', 0);
    $('#tools').show();
    
    //Init buttons
    
    
$('#download_btn').click(function() {
  let session_id = $('#result_img').attr('data');
  let imageUrl = document.getElementById("result_img").src.split("/").pop().split('?')[0];

  // Creazione di un elemento di form dinamico
  let form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://photocartoon.net/download.php';
  form.target = '_blank';

  // Aggiunta dei parametri come campi nascosti nel form
  let sessionIdInput = document.createElement('input');
  sessionIdInput.type = 'hidden';
  sessionIdInput.name = 'id';
  sessionIdInput.value = session_id;
  form.appendChild(sessionIdInput);

  let imageUrlInput = document.createElement('input');
  imageUrlInput.type = 'hidden';
  imageUrlInput.name = 'effect';
  imageUrlInput.value = imageUrl;
  form.appendChild(imageUrlInput);

  // Aggiunta del form alla pagina e sottomissione automatica
  document.body.appendChild(form);
  form.submit();
});


    
    
        $('#download_btn2').click(function(){
        let session_id = $('#result_img').attr('data');
        window.open('https://photocartoon.net/download2.php?id='+session_id+'&effect='+document.getElementById("result_img").src.split("/").pop().split('?')[0]);
    });
    

    $('#cart_btn').click(function(){
let session_id = $('#result_img').attr('data');
       window.open('https://photocartoon.net/license/buy.php?id='+session_id);
    });


    $('#repeat_btn').click(function(){
        window.location.reload();
    });
    $('#share_facebook_btn').click(function(){
        let session_id = $('#result_img').attr('data');
       // let url = 'https://photocartoon.net/'+session_id+'/photo-cartoon.jpg'
      //  let url = 'https://photocartoon.net/'+session_id+'/'+document.getElementById("result_img").src.split("/").pop().split('?')[0];
        let url = 'https://photocartoon.net/view.php?id='+session_id+'&effect='+document.getElementById("result_img").src.split("/").pop().split('?')[0];
        window.open('https://www.facebook.com/sharer/sharer.php?u='+url);
    });



    $('#share_instagram_btn').click(function(){
        let session_id = $('#result_img').attr('data');
     //   let url = 'https://photocartoon.net/'+session_id+'/photo-cartoon.jpg'
    // let url = 'https://photocartoon.net/'+session_id+'/'+document.getElementById("result_img").src.split("/").pop().split('?')[0];
         let url = 'https://photocartoon.net/view.php?id='+session_id+'&effect='+document.getElementById("result_img").src.split("/").pop().split('?')[0];
        window.open('https://www.facebook.com/sharer/sharer.php?u='+url);
    });
    $('#share_twitter_btn').click(function(){
        let session_id = $('#result_img').attr('data');
       // let url = 'https://photocartoon.net/'+session_id+'/photo-cartoon.jpg'
     //  let url = 'https://photocartoon.net/'+session_id+'/'+document.getElementById("result_img").src.split("/").pop().split('?')[0];
          let url = 'https://photocartoon.net/view.php?id='+session_id+'&effect='+document.getElementById("result_img").src.split("/").pop().split('?')[0];
        window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(url));
    });
        $('#share_email_btn').click(function(){
        let session_id = $('#result_img').attr('data');
    // let url = 'https://photocartoon.net/'+session_id+'/'+document.getElementById("result_img").src.split("/").pop().split('?')[0];
     let url = 'https://photocartoon.net/view.php?id='+session_id+'&effect='+document.getElementById("result_img").src.split("/").pop().split('?')[0];
     
        window.open('https://photocartoon.net/mail/form.php?photourl='+url);
    });
    $('#share_painterest_btn').click(function(){
        let session_id = $('#result_img').attr('data');
        let image = 'https://photocartoon.net/'+session_id+'/photo-cartoon.jpg'
        window.open('http://pinterest.com/pin/create/button/?url='+encodeURIComponent('http://photocartoon.net')+
                '&media='+encodeURIComponent(image)+
                '&description='+encodeURIComponent('Photo Cartoon'));
    });


}


function initInterface()
{
    if (cartoonMode==false)
        return;

    
    let body_width = $('body').width();
    if (isMobile.any() && body_width<1024)
    {
        $('#result_img').css('max-width', body_width);        
        $('div.herocontent').addClass('hidden');

    }
    else
    {
        $('#result_img').css('max-width', 'auto');        
        $('div.herocontent').removeClass('hidden');    	
    }

    let width = $('#result_img').width();
    let height = $('#result_img').height();
    if (isMobile.any())
    {
        if (body_width>1024)
        {
            if (width<500)
                width=500;
           $('#cartoon_form_results').width(width);
           $('#cartoon_form_results').height(height+100);            

        }
        else
        {                
            $('#other_effects').css('top', height+440);
            window.scrollTo(0,225);
        }

    }
    else
    {
        if (width<800)
            width = 800;
        if (width>1000)
            width=1000;
        $('#cartoon_form_results').width(width);
        $('#cartoon_form_results').height(height+100);                        
    }
    $('#cartoonCanvas').attr('width',$('#result_img').width());
    $('#cartoonCanvas').attr('height',$('#result_img').height());
    

    let offset = $('#result_img').offset();
    $('#cartoonCanvas').css('left', offset.left);
    $('#cartoonCanvas').css('top', offset.top);            

    $('#zoom-in').css('top', offset.top + 20);
    $('#zoom-out').css('top', offset.top + 20);
    $('#rotate').css('top', offset.top + 20);

    $('#zoom-in').css('left', offset.left + width - 90);
    $('#zoom-out').css('left', offset.left + width - 60);
    $('#rotate').css('left', offset.left + width - 30);

    cManager.initEvents();

    if (isMobile.any() && body_width<1024){
        window.scrollTo(0, 0);

        setTimeout(function(){
            let offset = $('#result_img').offset();
            $('#cartoonCanvas').css('left', offset.left);
            $('#cartoonCanvas').css('top', offset.top);            

            $('#zoom-in').css('top', offset.top + 20);
            $('#zoom-out').css('top', offset.top + 20);
            $('#rotate').css('top', offset.top + 20);
        },1000);

        $('#progress').css('display', 'none');
        $('#other_effects').css({'top':560, 'position':'unset', 'z-index':'unset'});
        $('#cartoon_form_results').css('margin','0rem auto 0rem auto');
        $('#tools').css({'display':'inline-block','position':'absolute', 'margin-top':'0px','top':'unset','width':'100%','z-index':'unset'});
        let tools_height = $('#tools').height();
        $('#hero').css('margin-bottom',tools_height);
    }


} 