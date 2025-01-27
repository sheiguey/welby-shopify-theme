$(document).ready(function () {
  $(document).on('click', '.js-quantity-button', function (event) {
    let $button = $(this);
    let $form = $button.closest('form');
    let $quantity = $form.find('.js-quantity-field');
    let quantityValue = parseInt($quantity.val());
    let max = $quantity.attr('max') ? parseInt($quantity.attr('max')) : null;

    if (
      $button.hasClass('plus') &&
      (max === null || quantityValue + 1 <= max)
    ) {
      // do something for plus click
      $quantity.val(quantityValue + 1).change();
    } else if ($button.hasClass('minus')) {
      $quantity.val(quantityValue - 1).change();
    }
  });

  $(document).on('change', '.js-quantity-field', function (event) {
    let $field = $(this);
    let $form = $field.closest('form');
    let $quantityText = $form.find('.js-quantity-text');
    let shouldDisableMinus = parseInt(this.value) === 1;
    let shouldDisablePlus =
      parseInt(this.value) === parseInt($field.attr('max'));

    let $minusButton = $form.find('.js-quantity-button.minus');
    let $plusButton = $form.find('.js-quantity-button.plus');

    $quantityText.text(this.value);

    if (shouldDisablePlus) {
      $plusButton.prop('disabled', true);
    } else if ($plusButton.prop('disabled') === true) {
      $plusButton.prop('disabled', false);
    }

    if (shouldDisableMinus) {
      $minusButton.prop('disabled', true);
    } else if ($minusButton.prop('disabled') === true) {
      $minusButton.prop('disabled', false);
    }
  });

  $(document).on('change', '.js-variant-radio', function (event) {
    let $radio = $(this);
    let $form = $radio.closest('form');
    let max = $radio.attr('data-inventory-quantity');
    let $quantity = $form.find('.js-quantity-field');
    let $addToCartButton = $form.find('#add-to-cart-button');

    if ($addToCartButton.prop('disabled') === true) {
      $addToCartButton.prop('disabled', false);
    }

    $quantity.attr('max', max);

    if (parseInt($quantity.val()) > max) {
      $quantity.val(max).change();
    }
  });

  $(document).on('submit', '#add-to-cart-form', function (event) {
    event.preventDefault();

    let onCartUpdated = () => {
      fetch('/cart.js')
        .then(async (response) => {
          const res = await response.json();
          let $dataCartContents = $(context).find('.js-cart-content');
          let dataCartHtml = $dataCartContents.html();
          let dataCartItemCount = $dataCartContents.attr(
            'data-cart-item-count'
          );
          let $cartItemCount = $('.js-cart-item-count');
          $cartItemCount.text(dataCartItemCount);
          $miniCartContents.html(dataCarthtml);

          console.log(res);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    let addToCartForm = document.querySelector('form[action$="/cart/add"]');
    let formData = new FormData(addToCartForm);

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        const res = await response.json();
        console.log(res);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
});
