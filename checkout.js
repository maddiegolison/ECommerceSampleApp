    
/*  Constant for the price of a single avocado  */    
    const AVO_PRICE = 2.50;

/*  Updates the total price of the order when the dropdown menu selection changes  */
    var onQuantityChange = function() {
      var total = parseInt(document.getElementById("quantity").value) * AVO_PRICE;
      var tr = document.getElementsByTagName("tr")[1];
      tr.getElementsByTagName("td")[3].innerHTML = isNaN(total) ? "" : total.toString();
    };

/*  Updates total quantity and price of an order when items are added to the cart  */
    var addToCart = function() {
      var newOrderQuant = parseInt(document.getElementById("quantity").value);
      var newOrderQuant = isNaN(newOrderQuant) ? 0 : newOrderQuant;
      var totalQuant = parseInt(document.getElementById("checkoutQuant").innerHTML);
      var sum = newOrderQuant + totalQuant;
      document.getElementById("checkoutQuant").innerHTML = sum.toString();
      var total = sum * AVO_PRICE;
      document.getElementById("checkoutVal").innerHTML = total.toString();
    }

/*  Allows user to clear out anything from their cart and start from zero quantity  */
    var emptyCart = function() {
      document.getElementById("checkoutVal").innerHTML = "0";
      document.getElementById("checkoutQuant").innerHTML = "0";
    }

/* Creates the instance of the Stripe object with my publishable test API key  */
    var stripe = Stripe('pk_test_51HYGavHKsgknvL1FLNjsZtGI6GeOO7yYrkMCySfza5c4IP3vQL8y76JqHNQ1n5LCGM11sMGmmxu3MUb17swazqND00GqcoaFFB');
    var checkoutButton = document.getElementById("checkout-button");

/*  Onclick will post to the server a new session and then redirect to the Stipe Checkout */
    checkoutButton.addEventListener("click", function () {
      var quantity = parseInt(document.getElementById("checkoutQuant").innerHTML);

      if (quantity === 0)  // If there is nothing in the cart, don't checkout
        return;

      fetch("/create-session", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({quantity: quantity})
      })

        .then(function (response) {
          return response.json();
        })

        .then(function (session) {
          sessionStorage.sessionId = session.id;    // we will hold onto the session ID to grab the charge ID on success
          sessionStorage.total = quantity*AVO_PRICE;
          return stripe.redirectToCheckout({ 
            sessionId: session.id,
          })
        })

        .then(function (result) {
          if (result.error) {
            alert(result.error.message);
          }
        })

          .catch(function (error) {
              console.error("Error:", error);
          });
    });