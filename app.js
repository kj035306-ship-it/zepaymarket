let currentSeller = null;

function toggleView(view) {
  document.getElementById("shopView").classList.add("hidden");
  document.getElementById("sellerView").classList.add("hidden");
  document.getElementById("adminView").classList.add("hidden");

  document.getElementById(view + "View").classList.remove("hidden");
}

// LOAD PRODUCTS
async function loadProducts() {
  const { data } = await supabase.from("products").select("*");

  const container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div>
        <h3>${p.name}</h3>
        <p>₦${p.price}</p>
        <button onclick="buy('${p.id}', ${p.price})">Buy</button>
      </div>
    `;
  });
}

// BUY PRODUCT (PAYSTACK)
function buy(id, price) {
  const handler = PaystackPop.setup({
    key: PAYSTACK_KEY,
    email: "customer@mail.com",
    amount: price * 100,
    callback: function(response) {
      alert("Payment successful");

      supabase.from("orders").insert([
        { product_id: id, status: "paid" }
      ]);
    }
  });

  handler.openIframe();
}

// SELLER SUBSCRIPTION
function paySubscription() {
  const name = document.getElementById("sellerName").value;

  const handler = PaystackPop.setup({
    key: PAYSTACK_KEY,
    email: "seller@mail.com",
    amount: SUBSCRIPTION_AMOUNT * 100,
    callback: function () {
      currentSeller = name;
      localStorage.setItem("seller", name);

      document.getElementById("sellerAuth").classList.add("hidden");
      document.getElementById("sellerPanel").classList.remove("hidden");

      alert("Seller Activated");
    }
  });

  handler.openIframe();
}

// ADD PRODUCT
async function addProduct() {
  const name = document.getElementById("pName").value;
  const price = document.getElementById("pPrice").value;

  await supabase.from("products").insert([
    {
      name,
      price,
      seller: currentSeller
    }
  ]);

  alert("Product added");
  loadProducts();
}

loadProducts();
