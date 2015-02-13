// Requires jQuery.

console.log("Embedded scripts running ...");

resize();
setInterval(resize, 1500);
$(window).resize(resize);

function resize(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {	
		$("#iframe").css({
			position: "absolute",
			top: "0px",
			overflow:"scroll"
		});

	}
	else {
		$("body").css("overflow", "hidden");
		$("#iframe").height( $(window).height() - $("#top_header").outerHeight() -  $("#magazineArticleShortAd").outerHeight() );
		$("#iframe").css("top", ( $("#top_header").outerHeight() + $("#magazineArticleShortAd").outerHeight() ) + "px" );
	}

}