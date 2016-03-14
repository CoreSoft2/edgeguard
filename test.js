$(function() {
  $('#doXss').click(function(e) {
    e.preventDefault();
    $('#xssOutput').html($('#xssSrc').val());
  })
});