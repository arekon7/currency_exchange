
// countdown until update currency rates
var timer;
function countDown(time_from_now){
    clearInterval(timer);
    var countDownTime = new Date().getTime() + time_from_now;  // 10 mins from now

    // Update the count down every 1 second
    timer = setInterval(function() {

        var now = new Date().getTime(); // Get todays date and time

        // Find the distance between now an the count down date
        var distance = countDownTime - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // calculate minutes
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);  // calculate seconds

        document.getElementById("countdown").innerHTML = minutes + "m " + seconds + "s "; // update time in html

        // If the count down is over, execute following code
        if (distance < 0) {
            updateCurrencyRates();
            countDown(600000);
        }
    }, 1000);

}
countDown(600000);

//--fixer -------------------------------------

// set endpoint and your access key
endpoint = 'latest';
access_key = 'dcdb7ab1f732eb010dd83b4234a3f456';

updateCurrencyRates();
//------ currency selection from dropdown select -------------------------------------

var curr_value = 0;     // selected currency value
$("select[name=currency_to_convert]").change(function(){
    var curr_key = $('option:selected', this).attr('key');  //selected currency key
    curr_value = $('option:selected', this).attr('value');
    var qty_value = 0;      // currency quantyty value
    var qty = $('#qty').val();      // quantity of currency
    qty_value = qty / curr_value;   // calculation qty value in EUR
    $('#qty_value').val(qty_value);
    $('#selected_currency_key').html(curr_key);
    $('#first_curr_key').html(curr_key);
    $('#second_curr_rate_to_eur').html(1/curr_value);

    
    
    // update saved currencies to cookie
    if(!jQuery.isEmptyObject($.cookie('currArr'))){
        
        var currArr = JSON.parse($.cookie('currArr'));
        currArr[curr_key] = curr_value;
        $.cookie('currArr', JSON.stringify(currArr));
        
        var listitems = '<option>Latest saved currencies</option>';
        var saved_currencies = $('#saved_currencies');
        $.each(currArr, function(key, value){
            listitems += '<option value=' + value + ' key='+ key +' >' + key + ': ' + value + '</option>';
        });
        saved_currencies.empty().append(listitems);
        
    } else {
        
        currArr = {};
        currArr[curr_key] = curr_value;
        $.cookie('currArr', JSON.stringify(currArr));

        var listitems = '';
        var saved_currencies = $('#saved_currencies');
        $.each(currArr, function(key, value){
            listitems += '<option value=' + value + ' key='+ key +' >' + key + ': ' + value + '</option>';
        });
        saved_currencies.empty().append(listitems);
        
    }
    
});

//----------saved currency selection from dropdown select---------------

$("select[name=saved_currencies]").change(function(){
    var curr_key = $('option:selected', this).attr('key');  //selected currency key
    curr_value = $('option:selected', this).attr('value');
    var qty_value = 0;      // currency quantyty value
    var qty = $('#qty').val();      // quantity of currency
    qty_value = qty / curr_value;
    $('#qty_value').val(qty_value);

    $('#selected_currency_key').html(curr_key);
    $('#first_curr_key').html(curr_key);
    $('#second_curr_rate_to_eur').html(1/curr_value);
    
});

//-- -------------------------------------

$("#qty").change(function(){    // on quantity field change recalculate value
        qty = $(this).val();
        qty_value = qty / curr_value;
        $('#qty_value').val(qty_value);
    });

$("#update_rates_button").on('click', function(){
    updateCurrencyRates();
});

// update curency rates
function updateCurrencyRates(){
    
    $.ajax({
        url: 'http://data.fixer.io/api/' + endpoint + '?access_key=' + access_key,   
        dataType: 'jsonp',
        success: function(json) {

            // populate select dropdown with currencies from fixer
            var listitems = '<option>Select currency</option>'; 
            var select_currency = $('#select_currency');
            $.each(json.rates, function(key, value){
                listitems += '<option value=' + value + ' key='+ key +' >' + key + ': ' + value + '</option>';
            });
            select_currency.empty().append(listitems);

            // update currencies saved in cookie
            var currArr = JSON.parse($.cookie('currArr'));
            $.each(currArr, function(key, value){
                $.each(json.rates, function(key_new, value_new){
                    if(key == key_new){
                        currArr[key] = value_new;
                    }
                });
            });
            
            var listitems = '<option>Latest saved currencies</option>';
            var saved_currencies = $('#saved_currencies');
            $.each(currArr, function(key, value){
                listitems += '<option value=' + value + ' key='+ key +' >' + key + ': ' + value + '</option>';
            });
            saved_currencies.empty().append(listitems);
            
            $.cookie('currArr', JSON.stringify(currArr));
        }
    
    });

    var selected_currency_key =  $('#selected_currency_key').html();    
    
    var curr_key_1 = $('option:selected', "select[name=currency_to_convert]").attr('key');  // selected currency key
    curr_value_1 = $('option:selected', "select[name=currency_to_convert]").attr('value'); 
    
    var curr_key_2 = $('option:selected', "select[name=saved_currencies]").attr('key');  //selected from history currency key
    curr_value_2 = $('option:selected', "select[name=saved_currencies]").attr('value');
    
    var curr_key;
    if(selected_currency_key == curr_key_1){
        curr_value = curr_value_1;
        curr_key = curr_key_1;
    }else if(selected_currency_key == curr_key_2){
        curr_value = curr_value_2;
        curr_key = curr_key_2;
    }
    
    
    var qty_value = 0;      // currency quantyty value
    var qty = $('#qty').val();      // quantity of currency
    qty_value = qty / curr_value;
    $('#qty_value').val(qty_value);
    $('#selected_currency_key').html(curr_key);
    
    $('#first_curr_key').html(curr_key);
    $('#second_curr_rate_to_eur').html(1/curr_value);
    
    var dt = new Date();
    var time = dt.getHours() + "h " + dt.getMinutes() + "m " + dt.getSeconds() + 's';
    $('#updated_at').html(time);
    countDown(600000);
 
}


