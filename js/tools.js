var fontFamily = 'Arial'
var fontWeight = 200;
var cManager = new CanvasManager('cartoonCanvas');
var fontSize=null;
var brightnessValue = null;
var contrastValue = null;
var saturationValue = null;
var hueValue = null;

function applyFont(font) {
  //console.log('You selected font: ' + font);

  // Replace + signs with spaces for css
  font = font.replace(/\+/g, ' ');

  // Split font into family and weight
  font = font.split(':');

  fontFamily = font[0];
  fontWeight = font[1] || 400;
  
  let activeIndex = cManager.getActiveTextIndex();
  if (activeIndex!=null)
  {
      cManager.texts[activeIndex].fontFamily = fontFamily;
      cManager.texts[activeIndex].fontWeight = fontWeight;
      cManager.render();
  }
}


function initTools(){

    $('#font-picker').fontselect({
        placeholder: 'Select a font',
        placeholderSearch: 'Search...',
        searchable: true,
        lookahead: 2,
        systemFonts: 'Arial|Helvetica+Neue|Courier+New|Times+New+Roman|Comic+Sans+MS|Impact'.split('|'),
        localFontsUrl: '/fonts/',
        googleFonts: 'Aclonica|Allan|Annie+Use+Your+Telescope|Anonymous+Pro|Allerta+Stencil|Allerta|Amaranth|Anton|Architects+Daughter|Arimo|Artifika|Arvo|Asset|Astloch|Bangers|Bentham|Bevan|Bigshot+One|Bowlby+One|Bowlby+One+SC|Brawler|Buda:300|Cabin|Calligraffitti|Candal|Cantarell|Cardo|Carter+One|Caudex|Cedarville+Cursive|Cherry+Cream+Soda|Chewy|Coda|Coming+Soon|Copse|Corben|Cousine|Covered+By+Your+Grace|Crafty+Girls|Crimson+Text|Crushed|Cuprum|Damion|Dancing+Script|Dawning+of+a+New+Day|Didact+Gothic|Droid+Sans|Droid+Serif|EB+Garamond|Expletus+Sans|Fontdiner+Swanky|Forum|Francois+One|Geo|Give+You+Glory|Goblin+One|Goudy+Bookletter+1911|Gravitas+One|Gruppo|Hammersmith+One|Holtwood+One+SC|Homemade+Apple|Inconsolata|Indie+Flower|Irish+Grover|Istok+Web|Josefin+Sans|Josefin+Slab|Judson|Jura|Just+Another+Hand|Just+Me+Again+Down+Here|Kameron|Kenia|Kranky|Kreon|Kristi|La+Belle+Aurore|Lato|League+Script|Lekton|Limelight|Lobster|Lobster+Two|Lora|Love+Ya+Like+A+Sister|Loved+by+the+King|Luckiest+Guy|Maiden+Orange|Mako|Maven+Pro|Maven+Pro:900|Meddon|MedievalSharp|Megrim|Merriweather|Metrophobic|Michroma|Miltonian+Tattoo|Miltonian|Modern+Antiqua|Monofett|Molengo|Mountains+of+Christmas|Muli:300|Muli|Neucha|Neuton|News+Cycle|Nixie+One|Nobile|Nova+Cut|Nova+Flat|Nova+Mono|Nova+Oval|Nova+Round|Nova+Script|Nova+Slim|Nova+Square|Nunito|Old+Standard+TT|Open+Sans:300|Open+Sans|Open+Sans:600|Open+Sans:800|Open+Sans+Condensed:300|Orbitron|Orbitron:500|Orbitron:700|Orbitron:900|Oswald|Over+the+Rainbow|Reenie+Beanie|Pacifico|Patrick+Hand|Paytone+One|Permanent+Marker|Philosopher|Play|Playfair+Display|Podkova|Press+Start+2P|Puritan|Quattrocento|Quattrocento+Sans|Radley|Raleway:100|Redressed|Rock+Salt|Rokkitt|Ruslan+Display|Schoolbell|Shadows+Into+Light|Shanti|Sigmar+One|Six+Caps|Slackey|Smythe|Sniglet|Sniglet:800|Special+Elite|Stardos+Stencil|Sue+Elen+Francisco|Sunshiney|Swanky+and+Moo+Moo|Syncopate|Tangerine|Tenor+Sans|Terminal+Dosis+Light|The+Girl+Next+Door|Tinos|Ubuntu|Ultra|Unkempt|UnifrakturCook:bold|UnifrakturMaguntia|Varela|Varela+Round|Vibur|Vollkorn|VT323|Waiting+for+the+Sunrise|Wallpoet|Walter+Turncoat|Wire+One|Yanone+Kaffeesatz|Yeseva+One|Zeyada'.split('|')
    
    })
    .on('change', function() {
      applyFont(this.value);
    });
    $('#font-picker').trigger('setFont',['Arial',200]);

    
    fontSize = new RangeSlider($("#font-size-range"), {
        size: 1,
        borderSize: 0.4,
        percentage: 63.75,
        onUp: function(){ 
            let sizes = [16,18,20,22,24,26,28,32,36,48,54,66,72,80];
            let index = Math.floor(sizes.length*this.percentage)-1;
            $('#font-size-value').val(sizes[index]); 
            
            //Update current text
            let activeIndex = cManager.getActiveTextIndex();
            if (activeIndex!=null)
            {
                cManager.texts[activeIndex].size = sizes[index];
                cManager.render();
            }
        }
    });
    $('#font-size-value').val(32);
    
    $(".font-color").asColorPicker();
    $(".font-color").on('asColorPicker::change', function (e) {
        let color = $(".font-color").asColorPicker('get').toHEX();
        let activeIndex = cManager.getActiveTextIndex();
        if (activeIndex!=null)
        {
            cManager.texts[activeIndex].color = color;
            cManager.render();
        }
        
    });
    $(".font-background-color").asColorPicker({readonly:true});
    $(".font-background-color").on('asColorPicker::change', function (e) {
        let color = $(".font-background-color").asColorPicker('get').toHEX();
        let activeIndex = cManager.getActiveTextIndex();
        if ( activeIndex!=null && cManager.texts[activeIndex].useBackground )
        {
            cManager.texts[activeIndex].background = color;
            cManager.render();
        }
        
    });
    $('#use-backround').click(
            function(){ 
                $(".font-background-color").readonly = !this.getAttribute('checked');
                let activeIndex = cManager.getActiveTextIndex();
                if ( activeIndex!=null )
                {
                    cManager.texts[activeIndex].useBackground = $('#use-backround').prop('checked');
                    cManager.render();
                }
            }
        );
    $('#the_text').keyup(
            function(){
                let activeIndex = cManager.getActiveTextIndex();
                if ( activeIndex!=null )
                {
                    cManager.texts[activeIndex].text = this.value;
                    cManager.render();
                }
            }
        );
    
    $('#text_add').click(function(){
        let text = $('#the_text').val();
        let color = $('.font-color').val();
        let useBackground = $('#use-backround')[0].checked; 
        let background = $('.font-background-color').val(); 
        let size = $('#font-size-value').val(); 
        cManager.addText(text, color, useBackground, background, size, fontFamily, fontWeight);
        cManager.render();
    });
    $('#text_delete').click(function(){
        cManager.deleteText();
    });
    
    //Equlizer
    brightnessValue = new RangeSlider($("#brightness-range"), {
        size: 1,
        borderSize: 0.4,
        percentage: 50,
        onUp:function(){$('#brightness-value').val(Math.round(100*(this.percentage-0.5)));}
    });
    $('#brightness-value').val(0);

    contrastValue = new RangeSlider($("#contrast-range"), {
        size: 1,
        borderSize: 0.4,
        percentage: 50,
        onUp:function(){$('#contrast-value').val(Math.round(100*(this.percentage-0.5)));}
    });
    $('#contrast-value').val(0);

    saturationValue = new RangeSlider($("#saturation-range"), {
        size: 1,
        borderSize: 0.4,
        percentage: 50,
        onUp:function(){$('#saturation-value').val(Math.round(100*(this.percentage-0.5)));}
    });
    $('#saturation-value').val(0);



    hueValue = new RangeSlider($("#hue-range"), {
        size: 1,
        borderSize: 0.4,
        percentage: 50,
        onUp:function(){$('#hue-value').val(Math.round(100*(this.percentage-0.5)));}
    });
    $('#hue-value').val(0);

    
    $('#equalizer_apply').click(function(){
        cManager.addEqualizer(
            $('#brightness-value').val(),
            $('#contrast-value').val(),
            $('#saturation-value').val(),
            $('#hue-value').val(),
        );
        cManager.render();
    });
    
    $('#equalizer_cancel').click(function(){
        cManager.cancelEqualizer();
        cManager.render();
        
        brightnessValue.setPercentage(50);
        $('#brightness-value').val(0);
        
        contrastValue.setPercentage(50);
        $('#contrast-value').val(0);
        
        saturationValue.setPercentage(50);
        $('#saturation-value').val(0);
        
        hueValue.setPercentage(50);
        $('#hue-value').val(0);
    });
    cManager.render();
}



setTimeout(initTools, 1000);