$(function() {
  $('#doXss').click(function(e) {
    console.log('clicked');
    e.preventDefault();
    $('#xssOutput').html($('#xssSrc').val());
  })
});