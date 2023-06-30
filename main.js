// CART OPEN AND CLOSE
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
// Open Cart
cartIcon.onclick = () =>{
    cart.classList.add('active');
}
// Close Cart
closeCart.onclick = () =>{
    cart.classList.remove('active');
}
// ========= Making Add To Cart ======
if (document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
}
else { 
    ready();  
}

// Making Function
function ready(){
    // Remove Item From Cart
    var removeCartBtns = document.getElementsByClassName('cart-remove');
    for( var i = 0; i < removeCartBtns.length; i++){
        var btn = removeCartBtns[i];
        btn.addEventListener("click", removeCartItem);
    }
    // Quantity Change
    var quantityInput = document.querySelectorAll('.cart-quantity');
    for (var i = 0; i < quantityInput.length; i++) {
        var input = quantityInput[i];
        input.addEventListener("change", quantityChanged);
    }
    // Add To cart
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {
        var btn = addCart[i];
        btn.addEventListener("click", AddCartClick);
    }
    // Loads In cart
    loadCartItems();
}
// Remove Cart Item
function removeCartItem(event){
    var btnClick = event.target;
    btnClick.parentElement.remove();
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
// // Change Quantity
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
// Add To Cart
function AddCartClick(event){
    var btn = event.target;
    var Products = btn.parentElement;
    var title = Products.getElementsByClassName("product-title")[0].innerText;
    var price = Products.getElementsByClassName("price")[0].innerText;
    var imgProduct = Products.getElementsByClassName("product-img")[0].src;
    AddProductToCart(title, price, imgProduct);
    updateTotal();
    saveCartItem();
    updateCartIcon();
}

function AddProductToCart(title, price, imgProduct){
    var CartShopBox = document.createElement('div');
    CartShopBox.classList.add('cart-box');
    var CartItems = document.querySelector('.cart-content');
    var CartItemName = CartItems.getElementsByClassName('cart-product-title');
    for (var i = 0; i < CartItemName.length; i++) {
        if (CartItemName[i].innerText == title) {
            alert("Bạn đã thêm sản phẩm này vào giỏ hàng trước đây rồi !!")
            return;
        }
    }
    var cartBoxContent = `<img src="${imgProduct}" alt="img" class="cart-img">
                        <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input type="number" value="1" class="cart-quantity">
                        </div>
                        <!-- Remove Cart -->
                        <i class='bx bx-trash cart-remove'></i>`
    CartShopBox.innerHTML = cartBoxContent;
    CartItems.appendChild(CartShopBox);
    CartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    CartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
// Update Total
function updateTotal(){
    var cartContent = document.querySelector('.cart-content');
    var cartBoxs = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxs.length; i++) {
        var cartBox = cartBoxs[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;
        var price = parseFloat(priceElement.innerHTML.replace("$", ""));
        total = total + price * quantity;
    }
    document.getElementsByClassName('total-price')[0].innerHTML = "$" + total; 
    // save Total To LocalStorage
    localStorage.getItem("cartTotal", total);
}

// Keep Item in cart when page refresh with LocalStorage
function saveCartItem(){
    var cartContent = document.querySelector('.cart-content');
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
    for (var i = 0; i< cartBoxes.length;i++){
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
// Loads In cart
function loadCartItems(){
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems) {
        cartItems = JSON.parse(cartItems);
        for (var i = 0;i < cartItems.length; i++) {
            var item = cartItems[i];   
            AddProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
    }
    updateCartIcon();
}
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for(var i = 0;i < cartBoxes.length;i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        quantity += parseInt(quantityElement.value);
    }
    cartIcon.setAttribute('data-quantity', quantity);
}

// Thanh Toan To Cart
document.querySelector('.btn-buy').onclick = () =>{
    var cartContent = document.querySelector('.cart-content');
    var cartItems = document.querySelectorAll('.cart-box');
    if (cartItems.length > 0){
        while (cartContent.hasChildNodes()) {
            cartContent.removeChild(cartContent.firstChild);
        }
        window.location.href = "success.html";
    }
    else{
        window.location.href = "cancel.html";
    }
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
