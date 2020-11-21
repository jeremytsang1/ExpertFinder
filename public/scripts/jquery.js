//alert("Script loaded")


$(document).ready(function() {
    $('.btn[data-toggle="collapse"]').on('click', function(){
      $(this)
      .data('text-original', $(this).text())
      .text($(this).data('text-alt') )
      .data('text-alt', $(this).data('text-original'));
    });

// document ready  
});