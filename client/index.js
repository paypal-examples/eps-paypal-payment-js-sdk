/* eslint-disable consistent-return, new-cap, no-alert, no-console */

const order = {
  purchase_units: [
    {
      amount: {
        currency_code: 'EUR',
        value: '49.11',
      },
    },
  ],
  application_context: {
    return_url: `${window.location.origin}/success.html`,
    cancel_url: `${window.location.origin}/cancel.html`,
  },
}

/* Paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render('#paypal-mark')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder(data, actions) {
      return actions.order.create(order)
    },
    onApprove(data, actions) {
      return actions.order.capture().then((details) => {
        alert(`Transaction completed by ${details.payer.name.given_name}!`)
      })
    },
  })
  .render('#paypal-btn')

/* EPS */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.EPS,
  })
  .render('#eps-mark')

paypal
  .Fields({
    fundingSource: paypal.FUNDING.EPS,
    style: {
      base: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        lineHeight: '1.4',
        letterSpacing: '0.3',
      },
      input: {
        backgroundColor: 'white',
        fontSize: '16px',
        color: '#333',
        borderColor: '#dbdbdb',
        borderRadius: '4px',
        borderWidth: '1px',
        padding: '1rem',
      },
      invalid: {
        color: 'red',
      },
      active: {
        color: 'black',
      },
    },
    fields: {
      name: {
        value: '',
        hidden: false,
      },
    },
  })
  .render('#eps-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.EPS,
    upgradeLSAT: true,
    style: {
      label: 'pay',
    },
    createOrder(data, actions) {
      return actions.order.create(order)
    },
    onApprove(data, actions) {
      fetch(`/capture/${data.orderID}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          swal("Order Captured!", `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${data.purchase_units[0].payments.captures[0].amount.currency_code} ${data.purchase_units[0].payments.captures[0].amount.value}`, "success");
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      console.log(data)
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render('#eps-btn')

// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('eps-container').style.display = 'none'
        document.getElementById('eps-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'eps':
        document.getElementById('eps-container').style.display = 'block'
        document.getElementById('eps-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})

document.getElementById('eps-container').style.display = 'none'
document.getElementById('eps-btn').style.display = 'none'