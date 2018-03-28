$(document).ready(function() {
  $('.new-tweet').find('textarea').on('keyup', function(ev) {
    let $counter = $(this).closest('.new-tweet').find('.counter');
    $counter.text(140 - $(this).val().length);
    if ($(this).val().length > 140) {
      $counter.addClass('neg');
      // $counter.css({"color":"red"});
    } else {
      $counter.removeClass('neg');
      // $counter.css({"color":""});
    }
  });
});