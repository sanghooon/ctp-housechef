$(document).ready(function() {
  $('#new-dish-button').click(function() {
    $('#new-dish-form').css({
      'display':'block'
    });
  });
  $('#hide-form').click(function() {
    $('#new-dish-form').css({
      'display':'none'
    });
  });
});
