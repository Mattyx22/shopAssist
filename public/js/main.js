$(document).ready(function(){

// If it is main page add search box:
  let currentLocation = window.location.pathname;
  if (currentLocation == '/'){
    $('.navbar-right').show();
  } else {
    $('.navbar-right').hide();
  }

// Sorting table
$(document).ready(function(){
    $('#list_of_items').DataTable( {
    autoFill: true
  });
});

// Modal on add item page
$('#addItemHelp').on('shown.bs.modal', function () {
  $('#addItemHelp').focus()
})
/*
// Getting netto price for add item form
  $('#bought_price, #commission').keyup(function(){
    let bought_price = parseFloat($('#bought_price').val(), 10);
    let commission = parseFloat($('#commission').val(), 10);
    let netto = bought_price + bought_price * (commission/100)
    $('#price_netto').val(Math.round(netto * 100) / 100);
  });

// Getting commission from bought_price and netto price
  $('#bought_price, #price_netto').keyup(function(){
    let bought_price = parseFloat($('#bought_price').val(), 10);
    let netto = parseFloat($('#price_netto').val(), 10);
    let commission = ((netto / bought_price) - 1)*100
    $('#commission').val(Math.round(commission * 100) / 100);
  });

// Getting brutto price for add item form
  $('#price_netto, #tax').keyup(function(){
    let netto = parseFloat($('#price_netto').val(), 10);
    let tax = parseFloat($('#tax').val(), 10);
    let brutto = netto + netto * (tax/100);
    $('#price_brutto').val(Math.round(brutto * 100) / 100);
  });

// Count profit
  $('#price_netto, #commission').keyup(function(){
    let netto = parseFloat($('#price_netto').val(), 10);
    let bought_price = parseFloat($('#bought_price').val(), 10);
    let profit = netto - bought_price;
    $('#profit').val(profit);
  });
*/

// Re-count everything after clicking re-count
$('#recount_value').click(function(){
  let bought_price = parseFloat($('#bought_price').val(), 10);
  let commission = parseFloat($('#commission').val(), 10);
  let tax = parseFloat($('#tax').val(), 10);
  let netto = bought_price + bought_price * (commission/100);
  let brutto_notround = netto + netto * (tax/100);
  let brutto_round = Math.round(brutto_notround * 100) / 100;
  let profit = netto - bought_price;
  $('#price_netto').val(Math.round(netto * 100) / 100);
  $('#price_brutto').val(brutto_round);
  $('#profit').val(Math.round(profit * 100) / 100);
})


// Deleting item from database
  $('.del_item').on('click', function(){
    let del_answer = confirm('Czy na pewno usunąć?')

    if(del_answer){
      const id = $(this).attr('data-id');
      $.ajax({
        type: 'DELETE',
        url: 'items/'+id,
        success: function(response){
          console.log('Deleted');
          window.location.href='/';
        },
        error: function(err){
          console.log(err);
        }
      })
    } else {
      console.log('Cancelled');
    }
    
    
  });
});

