$(document).ready(function() {

  $('#new-dish-form').on('submit', (event) => {
    //PREVENT PAGE TO RELOAD
    event.preventDefault();
    var title = $('#dishTitle');
    var description = $('#dishDescription');
    var price = $('#dishPrice');

    $.ajax({
      url: '/chef/profile',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        dishTitle: title.val(),
        dishDescription: description.val(),
        dishPrice: price.val()
      }),
      success: function(response) {
        console.log(response);
        title.val('');
        description.val('');
        price.val('');
      }
    });

  });

});
