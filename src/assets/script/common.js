/* OIS: Jquery script */
$(document).ready(function(){
		/* showhide left pane */
	$("#showlp").click(function(){
		$(".df-panel").fadeIn();$("#showlp").hide();$("#hidelp").show();
	});
	$("#hidelp").click(function(){
		$(".df-panel").fadeOut();$("#hidelp").hide();$("#showlp").show();$(".customf").fadeOut();
	});
/*	 toggle switch product-radio button */
	$("#prod1").click(function(){
		$(".prod2").removeClass("selected");$(".prod1").addClass("selected");
	});
	$("#prod2").click(function(){
		$(".prod1").removeClass("selected");$(".prod2").addClass("selected");
	});
	/* toggle switch segment-radio button */
	$("#segmt1").click(function(){
		$(".segmt2, .segmt3, .segmt4").removeClass("selected");$(".segmt1").addClass("selected");
	});
	$("#segmt2").click(function(){
		$(".segmt3, .segmt4, .segmt1").removeClass("selected");$(".segmt2").addClass("selected");
	});
	$("#segmt3").click(function(){
		$(".segmt4, .segmt1, .segmt2").removeClass("selected");$(".segmt3").addClass("selected")
	});
	$("#segmt4").click(function(){
		$(".segmt1, .segmt2, .segmt3").removeClass("selected");$(".segmt4").addClass("selected");
	});
	/* Search box show/hide */
	$("#searcho").click(function(){
		$("#sbox").addClass("show");$("#searcho").addClass("hide");$("#searchc").addClass("show");
	});
	$("#searchc").click(function(){$("#sbox").removeClass("show");$("#searcho").removeClass("hide");$("#searchc").removeClass("show");
	});
	$(".goback").click(function(){window.history.back();});
	/*handle logout notification*/
	$("#logoutlink").click(function(){$("#alertd").removeClass("hide")});
	$("#logoutlink").click(function(){$("#alertd").removeClass("hide")});
	$("#logouty").click(function(){location.href="login.html";});
	$("#logoutx").click(function(){$("#alertd").addClass("hide")});
	
	/*Handling delete*/
	$("#deleteObs").click(function(){$("#confirmd").removeClass("hide");$("#confirms").addClass("hide")});
	$("#confirm").click(function(){$("#confirmd").addClass("hide");$("#confirms").removeClass("hide");
	$("#confirmdata").text("Obligation(s) deleted Successfully")});
	$("#cancel").click(function(){$("#confirmd").addClass("hide")});
	/*Handling Submit/archive*/
	$("#submitObs").click(function(){$("#confirmd").removeClass("hide")});
	$("#confirmObs").click(function(){location.href="obligation-submit.html";});
	$("#archives").click(function(){location.href="obligation-archive-confirm.html";});
	/*Handle submit bundle*/
	$("#confirmBuns").click(function(){location.href="bundle-submitted.html";});
	
	/*Handle hide the current element*/
	$(".hideit").click(function(){$(this).fadeOut()});
	$(".hideparent").click(function(){$(this).parent('div').fadeOut()});
	/*Hide the modal window*/
	$(".removefilter").click(function(){
		//$(this).parent('div').fadeOut()
		$("#fitlerd").fadeOut();
		$("#demoOfferbox").val("");
		$("#demoOfferbox").removeAttr("disabled");
		$("#viewallOffer").fadeOut();
		});
	$(".hideModal").click(function(){$(".modal").hide();$(".modal-backdrop").hide()});
	/*show filter in Add Bundle Page */
	$("#showfilter").click(function(){$("#bundleFilter").toggle()});
	
	/*Show pending/Returned table in notifications */
	$("#show-npotbl").click(function(){
		$("#npotbl").removeClass("hide");
		$("#nrotbl").addClass("hide");
		$("#show-npotbl").addClass("on");
		$("#show-nrotbl").removeClass("on");
	});
	$("#show-nrotbl").click(function(){
		$("#nrotbl").removeClass("hide");
		$("#npotbl").addClass("hide");
		$("#show-nrotbl").addClass("on");
		$("#show-npotbl").removeClass("on");
	});
	/*Editor/user Views*/
	$(".editorv").click(function(){
		$("#npotbl").removeClass("hide");
		$("#nrotbl").addClass("hide");
		$(".editorv").addClass("on");
		$(".userv").removeClass("on");
	});
	$(".userv").click(function(){
		$("#nrotbl").removeClass("hide");
		$("#npotbl").addClass("hide");
		$(".userv").addClass("on");
		$(".editorv").removeClass("on");
	});
	$("#addChan").click(function(){
		$("#schan").removeClass("hide");
		$("#addChan").addClass("hide");
		
	});
	$("#show-subs-01").click(function(){
		$("#schan").addClass("hide");
		$("#addChan").removeClass("hide");
		$("#subsc-01").removeClass("hide");
		
	});
	$("#show-csb-01").click(function(){
		$("#schan").addClass("hide");
		$("#addChan").removeClass("hide");
		$("#csbc-01").removeClass("hide");
		
	});
	$("#show-phone-01").click(function(){
		$("#schan").addClass("hide");
		$("#addChan").removeClass("hide");
		$("#phonec-01").removeClass("hide");
		
	});	
	$("#addamag-01").click(function(){
		$("#addamag-data-01").removeClass("hide");
		$("#addamag-01").addClass("hide");
	});
	/** forced view/choice view */
	$(".forcedv").click(function(){
		$("#fvtbl").removeClass("hide");
		$("#cvtbl").addClass("hide");
		$(".forcedv").addClass("on");
		$(".choicev").removeClass("on");
		$("#linkfo").removeClass("hide");
		$("#linkco").addClass("hide");
	});
	$(".choicev").click(function(){
		$("#cvtbl").removeClass("hide");
		$("#fvtbl").addClass("hide");
		$(".choicev").addClass("on");
		$(".forcedv").removeClass("on");
		$("#linkfo").addClass("hide");
		$("#linkco").removeClass("hide");		
	});
});
/* Panel script starts here */
$(document).on('click', '.panel-heading .clickable', function(e){
    var $this = $(this);
	if(!$this.hasClass('panel-collapsed')) {
		$this.parents('.panel').find('.panel-body').slideUp();
		$this.addClass('panel-collapsed');
		$this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
	} else {
		$this.parents('.panel').find('.panel-body').slideDown();
		$this.removeClass('panel-collapsed');
		$this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
	}
})
/*Panel script ends here */