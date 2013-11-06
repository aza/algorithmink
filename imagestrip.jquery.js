(function(jQuery) {

jQuery.fn.imagestrip = function( options ){
  options = options || {};
  
  var $ = jQuery;
  var id = "#" + jQuery(this).get(0).id;
  
  var leftButton = $(id).find(options.left);
  var rightButton = $(id).find(options.right);
  var container =  $(id).find("div").get(0);
  $(container).wrapInner("<div class='innerContainer'></div");
    
  var innerContainer = $(id).find(".innerContainer").get(0);
  
  var numImages = $(container).find("img").length+.5;
  var imageWidth = $(container).find("img").width();
  var totalWidth = numImages * imageWidth;
  
  var innerWidth = options["width"] || 500;
  $(innerContainer).find("img").click( options.click || function(){} );
  
  $(container).css({
    width: innerWidth,
    height: 100,
    overflow: "hidden",
  })
  
  $(innerContainer).css({
    width: totalWidth,
    height: 100,
    position: "relative",
    top: 0,
    left: 0
  })
  
  if( options.randomStartPos ) {
    $(innerContainer).css({ left: -Math.random()*totalWidth });
  }
    
  // GLOBAL
  var speed = 0;
  var mouseState = "up";
  var animating = false;
  
  function mouseDownFactory( theSpeed ) {
    return function(){
      speed += theSpeed;
      mouseState = "down";
      if( !animating ) animate();      
    }
  }
  
  function mouseUpFactory(){
    return function(){
      mouseState = "up";
    }
  }
  
  $(leftButton)
    .mousedown( mouseDownFactory(-5) )
  
  $(rightButton)
    .mousedown( mouseDownFactory(5) )
  
  $("body").mouseup( mouseUpFactory() )
  
  function updateControls( left ) {
    if( left >= -50 ){
      $(rightButton).css({ visibility: "hidden" })
    }
    else{ $(rightButton).css({ visibility: "visible" }) }

    if( left <= -(totalWidth-outerWidth-50) ){
      $(leftButton).css({ visibility: "hidden" })
    }
    else{ $(leftButton).css({ visibility: "visible" }) }
  }
  
  function getLeftPos() {
    return parseFloat( $(innerContainer).css("left").split("px")[0] );
  }
  
  function animate() {
    if( Math.abs(speed) < .1 ){
      animating = false;
      return;
    }
    
    animating = true;
    
    var left = getLeftPos();
    updateControls( left );
    $(innerContainer).css({ left: left+speed });
    if( left > 10 ) speed = -.5;

    if( left < -(totalWidth-outerWidth) ) speed = .5;    
    
    if( mouseState == "up" ) speed *= .97;
    setTimeout( animate, 10 );
  }
  
  updateControls( getLeftPos() ); 
}

})(jQuery);