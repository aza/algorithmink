function inkIt(){
  var canvas = document.createElement( "canvas" );
  canvas.width = $(window).width();
  canvas.height = $(window).height();
  $(canvas).css({
    position: "absolute",
    top: 0,
    left: 0
  })
  canvas.id = "aiCanvas";

  $("canvas").replaceWith( canvas );
  contextFree( "theCode", "aiCanvas" )

}

// -----------------------------------------------------------
// BUTTON HANDLERS
// -----------------------------------------------------------

function setupButtonHandler( buttonId, sheetId, modifierFunc, callback ){
  var buttonId = "#" + buttonId;
  var sheetId = "#" + sheetId;

  modifierFunc = modifierFunc || function(){};
  callback = callback || function(){};


  $(buttonId).click(function() {
    modifierFunc( sheetId );

    $("a").not(buttonId).removeClass( "selected" );
    $(".sheet").not(sheetId).slideUp( "normal" );

    if( $(this).hasClass( "selected") ){
      $(this).removeClass( "selected" );

      $(sheetId).addClass( "animated" );
      $(sheetId).slideUp( 1000, function(){
        $(sheetId).removeClass( "animated" );
      });

    } else {
      $(this).addClass( "selected" );

      $(sheetId).addClass( "animated" );
      $(sheetId).slideDown( 1000, function(){
        $(sheetId).removeClass( "animated" );
        callback();
      });
    }
  })
}

setupButtonHandler( "about", "aboutSheet" );
setupButtonHandler( "save", "saveSheet",
  function(){ $("#saveSheet input").attr("value", ""); }
);

setupButtonHandler(
  "edit",
  "editSheet",
  function(id){ $(id).height( $(window).height()-$("#bar").height() );},
  function(){ $("#editSheet textarea").focus() }
);

setupButtonHandler(
  "new",
  "editSheet",
  function(id){
    $(id).height( $(window).height()-$("#bar").height() );
    var newText = "startshape shape\n\nrule shape{\n CIRCLE{}\n}"
    $("#editSheet textarea").attr( "value", newText );
  },
  function(){
    $("#editSheet textarea").focus();
    $("#new").removeClass("selected");
    $("#edit").addClass("selected");

  }
)

$("#draw").click(function() {
  inkIt();
})

$("#saveButton").click( function(){
  performSave();
});


// -----------------------------------------------------------
// DISPLAY MESSAGE
// -----------------------------------------------------------


function displayMessage( text ){
    $("#message").text( text );
    $("#messageSheet").slideDown();
    setTimeout( function(){
      $("#messageSheet").slideUp();
    }, 3000 )
}

// -----------------------------------------------------------
// SAVE
// -----------------------------------------------------------

function performSave(){
  var thumb = document.createElement("canvas");
  var size = 150;
  thumb.width = size;
  thumb.height = size;
  ctx = thumb.getContext("2d");
  ctx.drawImage( Renderer.canvas, 0, 0, size, size*(Renderer.canvas.height/Renderer.canvas.width) );

  var postData = {
    author: $("#authorInput").attr("value"),
    title: $("#titleInput").attr("value"),
    code: $("#theCode").attr("value"),
    data: thumb.toDataURL()
  }

  displayMessage( "Saving..." );
  $.post( "save.php", postData, function(data){
    $("#saveSheet").slideUp();
    $("#save").removeClass("selected");

    if( data == "FAIL" ){
      displayMessage( "Can't save... it either already exists, or you didn't enter something.")
    } else {
      displayMessage( "Saved!" );
      location.replace( "#" + data );
    }

  });

}


// -----------------------------------------------------------
// BROWSER
// -----------------------------------------------------------


function loadByHash( hash ){
  if (hash == "browse") {
    App.goTo("browse");
    return;
  }

  var url = "saves/" + hash + ".txt";

  $.get( url, function(data) {
    data = data.split("&");
    var author = data[0];
    var title = data[1];
    var code = data[2];

    $("#theCode").attr( "value", code );
    inkIt();
    var name = "\"" + title + "\" by " + author;
    displayMessage( name );
    $("#namecard").text( name );
    location.replace( "#" + hash );
  });
}

// -----------------------------------------------------------
// __INIT__
// -----------------------------------------------------------

function __init__(){
  if( location.hash ){
    // Get rid of the opening "#"
    var hash = location.hash.substr(1);
    loadByHash( hash );
  } else {
    var choices = ["ea3a56b0", "8c7b9bf3", "0656fbe7", "bd67885b", "d3c3be13", "b32debe8", "adfc6f72", "72c75cc9", "99fdc2df", "8371e257", "aaf36d30", "d869669b", "e0274a5c", "0b846d61", "e03e6859"];
    var hash = choices[ parseInt( Math.random()*choices.length ) ];
    loadByHash( hash ); // 0656fbe7 Tangle Mouse, 8c7b9bf3 Cat's Eye
  }
}

var tempCanvas = document.createElement("canvas");

if( !tempCanvas.getContext("2d") || !tempCanvas.getContext("2d").setTransform ) {
  $("#warningSheet").show();
  setTimeout( function(){
    $("#warningSheet").fadeOut(1500, __init__);
  }, 3200);
} else {
  __init__();
}

