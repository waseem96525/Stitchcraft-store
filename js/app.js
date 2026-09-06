const DEFAULT_PRODUCTS = [
  { id: 1, name: "Embroidered Floral Kurta", brand: "StitchCraft Ethnic", category: "kurtas", gender: "men", price: 1299, oldPrice: 1899, rating: 4.5, reviews: 234, badge: "Sale", colors: ["White", "Blue", "Cream"], sizes: ["S", "M", "L", "XL", "XXL"], desc: "Beautiful hand-embroidered floral kurta made from premium cotton. Perfect for festive occasions and casual wear.", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600" },
  { id: 2, name: "Pure Silk Banarasi Saree", brand: "StitchCraft Ethnic", category: "sarees", gender: "women", price: 3499, oldPrice: 4999, rating: 4.8, reviews: 156, badge: "Premium", colors: ["Red", "Maroon", "Gold"], sizes: ["Free Size"], desc: "Authentic Banarasi silk saree with intricate zari work. A timeless classic for weddings and grand occasions.", img: "https://images.unsplash.com/photo-1593776810292-af1716f0a869?w=600" },
  { id: 3, name: "Designer Lehenga Choli", brand: "StitchCraft Ethnic", category: "lehengas", gender: "women", price: 4999, oldPrice: 6999, rating: 4.9, reviews: 89, badge: "New", colors: ["Peach", "Teal", "Burgundy"], sizes: ["S", "M", "L"], desc: "Stunning designer lehenga with heavy embroidery and mirror work. Perfect for weddings and festivals.", img: "https://images.unsplash.com/photo-1583394273251-2b5e688c7d3e?w=600" },
  { id: 4, name: "Slim Fit Denim Jeans", brand: "StitchCraft Core", category: "western", gender: "men", price: 1499, oldPrice: 0, rating: 4.3, reviews: 412, badge: "", colors: ["Blue", "Black", "Grey"], sizes: ["28", "30", "32", "34", "36", "38"], desc: "Slim fit premium denim jeans with stretch fabric for all-day comfort. A wardrobe essential.", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600" },
  { id: 5, name: "Printed Cotton Kurti", brand: "StitchCraft Casual", category: "kurtis", gender: "women", price: 799, oldPrice: 1199, rating: 4.2, reviews: 320, badge: "Sale", colors: ["Yellow", "Green", "Orange"], sizes: ["S", "M", "L", "XL"], desc: "Lightweight printed cotton kurti perfect for summer. Comfortable and stylish for daily wear.", img: "https://images.unsplash.com/photo-1625021371882-8399f3fc4339?w=600" },
  { id: 6, name: "Formal Suit Set", brand: "StitchCraft Formal", category: "menswear", gender: "men", price: 3999, oldPrice: 5499, rating: 4.6, reviews: 178, badge: "Premium", colors: ["Navy", "Charcoal", "Beige"], sizes: ["S", "M", "L", "XL", "XXL"], desc: "Premium wool blend formal suit set with jacket and trousers. Ideal for corporate events and interviews.", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
  { id: 7, name: "Kids Anarkali Dress", brand: "StitchCraft Kids", category: "kids", gender: "kids", price: 599, oldPrice: 899, rating: 4.4, reviews: 215, badge: "Sale", colors: ["Pink", "Purple", "Sky Blue"], sizes: ["4", "6", "8", "10", "12"], desc: "Beautiful Anarkali dress for girls with floral print. Soft cotton fabric for kids' comfort.", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600" },
  { id: 8, name: "Gold Polki Necklace Set", brand: "StitchCraft Jewels", category: "accessories", gender: "women", price: 2499, oldPrice: 3499, rating: 4.7, reviews: 98, badge: "Popular", colors: ["Gold", "Rose Gold"], sizes: ["One Size"], desc: "Exquisite gold polki necklace set with earings. Perfect match for ethnic wear and festive occasions.", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600" },
  { id: 9, name: "Kurta Set with Dupatta", brand: "StitchCraft Ethnic", category: "kurtas", gender: "men", price: 2199, oldPrice: 2999, rating: 4.5, reviews: 145, badge: "", colors: ["White", "Black", "Navy"], sizes: ["S", "M", "L", "XL"], desc: "Complete kurta set with matching dupatta. Premium kota Doria fabric with elegant embroidery.", img: "https://images.unsplash.com/photo-1615494688303-40a6968e421c?w=600" },
  { id: 10, name: "Georgette Saree", brand: "StitchCraft Ethnic", category: "sarees", gender: "women", price: 1899, oldPrice: 2599, rating: 4.3, reviews: 189, badge: "Sale", colors: ["Green", "Peach", "Ivory"], sizes: ["Free Size"], desc: "Lightweight georgette saree with delicate floral print and border work. Elegant for parties.", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
  { id: 11, name: "Heavy Silk Lehenga", brand: "StitchCraft Bridal", category: "lehengas", gender: "women", price: 8999, oldPrice: 12999, rating: 5.0, reviews: 45, badge: "Premium", colors: ["Red", "Royal Blue", "Gold"], sizes: ["S", "M", "L"], desc: "Royal heavy silk lehenga with zari work, sequins and pearls. Bridal collection masterpiece.", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600" },
  { id: 12, name: "Casual T-Shirt", brand: "StitchCraft Core", category: "western", gender: "men", price: 599, oldPrice: 0, rating: 4.1, reviews: 567, badge: "", colors: ["White", "Black", "Navy", "Red"], sizes: ["S", "M", "L", "XL", "XXL"], desc: "Premium cotton casual t-shirt with vintage print. Soft, comfortable and perfect for everyday wear.", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
  { id: 13, name: "Patola Inspired Dupatta", brand: "StitchCraft Ethnic", category: "accessories", gender: "women", price: 899, oldPrice: 1299, rating: 4.6, reviews: 112, badge: "Sale", colors: ["Red", "Orange", "Pink"], sizes: ["Free Size"], desc: "Beautifully woven Patola inspired dupatta with traditional motifs. Complements any ethnic outfit.", img: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600" },
  { id: 14, name: "Boys Kurta Pyjama", brand: "StitchCraft Kids", category: "kids", gender: "kids", price: 699, oldPrice: 999, rating: 4.3, reviews: 167, badge: "", colors: ["White", "Sky Blue", "Pastel Yellow"], sizes: ["4", "6", "8", "10", "12"], desc: "Cotton boys kurta pyjama set with embroidered collar. Comfortable for daily wear and festivities.", img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600" },
  { id: 15, name: "Women's Indo-Western Suit", brand: "StitchCraft Ethnic", category: "western", gender: "women", price: 2999, oldPrice: 3999, rating: 4.4, reviews: 134, badge: "Popular", colors: ["Black", "Navy", "Burgundy"], sizes: ["S", "M", "L", "XL"], desc: "Trendy Indo-Western suit with kurta, palazzo pants and dupatta. Perfect for office and parties.", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600" },
  { id: 16, name: "Classic Sherwani", brand: "StitchCraft Bridal", category: "menswear", gender: "men", price: 6999, oldPrice: 9999, rating: 4.8, reviews: 67, badge: "Premium", colors: ["Ivory", "Gold", "Beige"], sizes: ["S", "M", "L", "XL", "XXL"], desc: "Exquisite bridal sherwani with intricate mirror work and thread embroidery. A regal choice for weddings.", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" },
];

const testimonials = [
  { name: "Priya Sharma", location: "Delhi", rating: 5, text: "Absolutely love the quality of their kurtas. The embroidery is beautiful and fabric is premium. Will definitely recommend!", avatar: "https://i.pravatar.cc/100?img=1" },
  { name: "Amit Kumar", location: "Mumbai", rating: 4, text: "Bought a suit set for my brother's wedding. Excellent fit and finish. Delivery was fast too!", avatar: "https://i.pravatar.cc/100?img=3" },
  { name: "Sunita Devi", location: "Bangalore", rating: 5, text: "The Banarasi saree I ordered was stunning. Exactly as shown in pictures. Great service and packaging.", avatar: "https://i.pravatar.cc/100?img=5" },
  { name: "Rahul Mehra", location: "Jaipur", rating: 4, text: "Good quality lehenga for my daughter's wedding ceremony. Affordable pricing for bridal wear.", avatar: "https://i.pravatar.cc/100?img=7" },
  { name: "Neha Gupta", location: "Lucknow", rating: 5, text: "Best online garment store in India! Easy returns, great quality, and amazing festival sales.", avatar: "https://i.pravatar.cc/100?img=9" },
  { name: "Vikram Singh", location: "Chandigarh", rating: 4, text: "Bought kurta sets for my family during Diwali. Everyone loved them. Will shop again.", avatar: "https://i.pravatar.cc/100?img=11" },
];

const stores = [
  { name: "Flagship Store - Delhi", address: "123 Fashion Street, Delhi - 110006", phone: "+91 98765 43210", image: "https://images.unsplash.com/photo-1564399593028-c5d4a6652735?w=600", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai Outlet", address: "45 Linking Road, Bandra, Mumbai - 400050", phone: "+91 98765 43211", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600", lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore Store", address: "MG Road, Bangalore - 560001", phone: "+91 98765 43212", image: "https://images.unsplash.com/photo-1552242331-1363b6a85504?w=600", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai Branch", address: "T. Nagar, Chennai - 600017", phone: "+91 98765 43213", image: "https://images.unsplash.com/photo-1518543243225-2f91c6124263?w=600", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata Showroom", address: "Park Street, Kolkata - 700016", phone: "+91 98765 43214", image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600", lat: 22.5726, lng: 88.3630 },
  { name: "Hyderabad Center", address: "Banjara Hills, Hyderabad - 500034", phone: "+91 98765 43215", image: "https://images.unsplash.com/photo-1517164773350-01a90b4895d7?w=600", lat: 17.3850, lng: 78.4867 },
];

// ---- Catalog + stock (admin-editable; overrides saved in localStorage) ----
const CATALOG_KEY = 'stitchcraft_products_v1';
const DEFAULT_STOCK_PER_SIZE = 10;
const LOW_STOCK_THRESHOLD = 5;
function normalizeProduct(p) {
  const sizes = Array.isArray(p.sizes) && p.sizes.length ? p.sizes.slice() : ['One Size'];
  const stock = Object.assign({}, p.stock);
  sizes.forEach(s => {
    const q = parseInt(stock[s], 10);
    stock[s] = isNaN(q) ? DEFAULT_STOCK_PER_SIZE : Math.max(0, q);
  });
  return Object.assign({}, p, { sizes, colors: Array.isArray(p.colors) ? p.colors.slice() : [], stock });
}
function loadCatalog() {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : null;
  } catch (e) { return null; }
}
function saveCatalog() {
  try { localStorage.setItem(CATALOG_KEY, JSON.stringify(products)); } catch (e) {}
}
function resetCatalog() {
  try { localStorage.removeItem(CATALOG_KEY); } catch (e) {}
  products = DEFAULT_PRODUCTS.map(normalizeProduct);
}
let products = (loadCatalog() || DEFAULT_PRODUCTS).map(normalizeProduct);
function getStock(p, size) {
  if (!p || !p.stock) return 0;
  if (size) return Math.max(0, parseInt(p.stock[size], 10) || 0);
  return Object.values(p.stock).reduce((s, q) => s + (parseInt(q, 10) || 0), 0);
}
function firstInStockSize(p) {
  if (!p) return null;
  return p.sizes.find(s => getStock(p, s) > 0) || null;
}
function stockStatus(p) {
  const total = getStock(p);
  if (total <= 0) return 'out';
  if (total <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}
function stockLabel(p) {
  const total = getStock(p);
  if (total <= 0) return 'Out of Stock';
  if (total <= LOW_STOCK_THRESHOLD) return total === 1 ? 'Only 1 left!' : `Only ${total} left!`;
  return 'In Stock';
}

let currentCategory = 'all';
let currentFilter = 'all';
let currentPage = 0;
const productsPerPage = 8;
function loadCart(){ try { return JSON.parse(localStorage.getItem('stitchcraft_cart')) || []; } catch(e){ return []; } }
function saveCart(){ try { localStorage.setItem('stitchcraft_cart', JSON.stringify(cart)); } catch(e){} }
let cart = loadCart();
let cartDiscount = 0;
let selectedSizes = {};
let selectedColors = {};
let currentModalProduct = null;
let modalQty = 1;
let currentUser = null;
let currentUserIsAdmin = false;
let isEnglish = true;

const translations = {
  en: { stitchcraft: "StitchCraft", delivery: "Delivery", pickup: "Store Pickup", home: "Home", shop: "Shop", categories: "Categories", stores: "Stores", offers: "Offers", trending: "Trending Now", filterWomen: "Women", filterMen: "Men", filterKids: "Kids", all: "All", loadMore: "Load More Products", cart: "Cart", proceedCheckout: "Proceed to Checkout", addToCart: "Add to Cart", buyNow: "Buy Now", selectSize: "Select Size", selectColor: "Select Color", quantity: "Quantity", yourCart: "Your Cart", emptyCart: "Your cart is empty", enterPromo: "Enter promo code", applyPromo: "Apply", subtotal: "Subtotal", shipping: "Shipping", discount: "Discount", total: "Total", checkoutDelivery: "Delivery", checkoutPickup: "Store Pickup", shippingDetails: "Shipping Details", paymentMethod: "Payment Method", upi: "UPI / GPay / PhonePe", cod: "Cash on Delivery", card: "Credit / Debit Card", emi: "No Cost EMI", placeOrder: "Place Order", secureText: "Secured by 256-bit SSL encryption", subscribeNewsletter: "Subscribe to Our Newsletter", newsletterDesc: "Get exclusive offers, new arrivals, and festival deals delivered to your inbox", enterEmail: "Enter your email address", subscribe: "Subscribe", orderSuccess: "Order Placed Successfully!", thanksPurchase: "Thank you for your purchase. Order ID:", confirmation: "A confirmation has been sent to your email and phone.", continueShopping: "Continue Shopping", findStore: "Find a Store", bigFestivalSale: "Big Festival Sale", extraOff: "EXTRA ₹500 OFF", freeDelivery: "FREE DELIVERY", useCode: "Use code:", validUntilDiwali: "Valid until Diwali", validOnline: "Valid for online orders", above999: "Above ₹999", panIndia: "Pan-India delivery", codAvailable: "Cash on Delivery available", shopNow: "Shop Now", explore: "Explore", visitUs: "Visit Us", browseCollection: "Browse Collection", festivalTitle: "Festive Wear Collection 2025", festivalDesc: "Exquisite ethnic fashion for every occasion — curated for the Indian woman", menswearTitle: "Premium Menswear", menswearDesc: "Tailored perfection — from casual kurtas to elegant suits", freeShipping: "Free Shipping Above ₹999", freeShippingDesc: "Shop online & get free delivery across India", shopCategory: "Shop by Category", discoverRange: "Discover our wide range of ethnic and western wear", customerReviews: "Customer Reviews", lovedThousands: "Loved by thousands across India", visitStores: "Visit Our Stores", experienceCollections: "Experience our collections in person across India", freeDeliveryLabel: "Free Delivery", freeDeliveryDesc: "On orders above ₹999 across India", easyReturns: "Easy Returns", easyReturnsDesc: "7-day hassle-free return policy", qualityGuaranteed: "Quality Guaranteed", qualityDesc: "Premium fabrics & craftsmanship", support24x7: "Support 24/7", callUsNumber: "+91 98765 43210", fullName: "Full Name", phone: "Phone Number", address: "Address", city: "City", state: "State", pincode: "Pincode", india: "India", selectStorePickup: "Select Store for Pickup", checkout: "Checkout", searchPlaceholder: "Search garments, brands, styles...", quickView: "Quick View", addToCartShort: "Add to Cart", wishlist: "Wishlist", aboutUs: "About Us", helpFAQ: "Help & FAQ", shippingInfo: "Shipping Info", returnsExchange: "Returns & Exchange", trackOrder: "Track Order", contactUs: "Contact Us", sizeGuide: "Size Guide", career: "Career", newArrivals: "New Arrivals", bestSellers: "Best Sellers", privacyPolicy: "Privacy Policy", termsService: "Terms of Service", sitemap: "Sitemap", freeDelivery: "Free Delivery", easyReturns: "Easy Returns", qualityGuaranteed: "Quality Guaranteed", support24x7: "Support 24/7", callUs: "Call us", allRights: "All rights reserved.", footerDesc: "India's most trusted garment store, serving customers both online and offline since 2010.", shopOnline: "Shop Online", allCategories: "All Categories", storeLocations: "Store Locations", newArrivals: "New Arrivals", bestSellers: "Best Sellers", kurtas: "Kurtas", sarees: "Sarees", lehengas: "Lehengas", westernWear: "Western Wear", kurtis: "Kurtis", menswear: "Menswear", kidsWear: "Kids Wear", accessories: "Accessories", quickLinks: "Quick Links", customerService: "Customer Service", contactUs: "Contact Us", address: "123, Fashion Street, Delhi - 110006, India", hours: "Mon-Sat: 10AM - 9PM", weAccept: "We Accept:", copyright: "© 2025 StitchCraft. All rights reserved.", loading: "Loading StitchCraft...", },
  hi: { stitchcraft: "StitchCraft", delivery: "Delivery", pickup: "Store Pickup", home: "होम", shop: "शॉप", categories: "श्रेणियाँ", stores: "स्टोर", offers: "ऑफर", trending: "सबसे लोकप्रिय", filterWomen: "महिला", filterMen: "पुरुष", filterKids: "बच्चे", all: "सब कुछ", loadMore: "और उत्पाद लोड करें", cart: "कार्ट", proceedCheckout: "चेकआउट करें", addToCart: "कार्ट में डालें", buyNow: "तुरंत खरीदें", selectSize: "साइज चुनें", selectColor: "रंग चुनें", quantity: "मात्रा", yourCart: "आपकी कार्ट", emptyCart: "आपकी कार्ट खाली है", enterPromo: "प्रोमो कोड दर्ज करें", applyPromo: "लागू करें", subtotal: "उप-कुल", shipping: "शिपिंग", discount: "डिस्काउंट", total: "कुल", checkoutDelivery: "डिलीवरी", checkoutPickup: "स्टोर से उठाएं", shippingDetails: "शिपिंग विवरण", paymentMethod: "भुगतान का तरीका", upi: "UPI / GPay / PhonePe", cod: "नकद भुगतान", card: "क्रेडिट/डेबिट कार्ड", emi: "नो कॉस्ट EMI", placeOrder: "ऑर्डर दें", secureText: "256-बिट SSL एन्क्रिप्शन सुरक्षित", subscribeNewsletter: "हमारी न्यूज़लेटर सब्सक्राइब करें", newsletterDesc: "एक्सक्लूसिव ऑफर, नई पहुँच, और त्योहारी डील आपके इनबॉक्स में", enterEmail: "अपना ईमेल दर्ज करें", subscribe: "सब्सक्राइब करें", orderSuccess: "ऑर्डर सफलतापूर्वक दिया गया!", thanksPurchase: "आपके खरीदारी के लिए धन्यवाद। ऑर्डर ID:", confirmation: "आपके ईमेल और फोन पर पुष्टि भेजी गई।", continueShopping: "खरीदारी जारी रखें", findStore: "स्टोर खोजें", bigFestivalSale: "बड़ा त्योहार सेल", extraOff: "एक्स्ट्रा ₹500 OFF", freeDelivery: "मुफ्त डिलीवरी", useCode: "कोड का उपयोग करें:", validUntilDiwali: "दिवाली तक मान्य", validOnline: "ऑनलाइन ऑर्डर के लिए", above999: "₹999 से अधिक", panIndia: "पूरे भारत में डिलीवरी", codAvailable: "नकद भुगतान उपलब्ध", shopNow: "खरीदें", explore: "देखें", visitUs: "हमें देखें", browseCollection: "कलेक्शन ब्राउज़ करें", festivalTitle: "फेस्टिव वियर कलेक्शन 2025", festivalDesc: "हर अवसर के लिए उत्कृष्ट धार्मिक फैशन — भारतीय महिला के लिए क्यूरेटेड", menswearTitle: "प्रीमियम मेंज़वेयर", menswearDesc: "सही फिट — दैनिक कुर्ताओं से लेकर शानदार सूट तक", freeShipping: "₹999 से अधिक पर मुफ्त शिपिंग", freeShippingDesc: "ऑनलाइन खरीदारी करें और पूरे भारत में मुफ्त डिलीवरी पाएं", shopCategory: "श्रेणी के अनुसार खरीदें", discoverRange: "हमारी विस्तृत धार्मिक और पश्चिमी पहनावे की रेंज़ खोजें", customerReviews: "ग्राहक समीक्षाएं", lovedThousands: "पूरे भारत में हजारों ग्राहकों से पसंद", visitStores: "हमारे स्टोर देंकर आएं", experienceCollections: "भारत भर में हमारी कलेक्शन ऑफलाइन अनुभव करें", freeDeliveryLabel: "मुफ्त डिलीवरी", freeDeliveryDesc: "₹999 से अधिक ऑर्डर पर पूरे भारत में", easyReturns: "आसान वापसी", easyReturnsDesc: "7 दिन की सरल वापसी नीति", qualityGuaranteed: "गुणवत्ता सुनिश्चित", qualityDesc: "प्रीमियम कपड़े और कारीगरी", support24x7: "24/7 सहायता", callUsNumber: "+91 98765 43210", fullName: "पूरा नाम", phone: "फोन नंबर", address: "पता", city: "शहर", state: "राज्य", pincode: "पिनकोड", india: "भारत", selectStorePickup: "पिकअप के लिए स्टोर चुनें", checkout: "चेकआउट", searchPlaceholder: "कपड़े, ब्रांड, शैली खोजें...", quickView: "क्विक व्यू", addToCartShort: "कार्ट में डालें", wishlist: "विशलिस्ट", aboutUs: "हमारे बारे में", helpFAQ: "सहायता और अक्सर पूछे जाने वाले प्रश्न", shippingInfo: "शिपिंग जानकारी", returnsExchange: "वापसी और आदान-प्रदान", trackOrder: "ऑर्डर ट्रैक करें", contactUs: "संपर्क करें", sizeGuide: "साइज गाइड", career: "करियर", newArrivals: "नई पहुँच", bestSellers: "सबसे बेहतर बिकने वाले", privacyPolicy: "गोपनीयता नीति", termsService: "सेवा के नियम", sitemap: "साइट मानचित्र", kurtas: "कुर्ताएं", sarees: "साड़ियां", lehengas: "लहंगे", westernWear: "पश्चिमी पहनावा", kurtis: "कुर्टीज़", menswear: "पुरुष पहनावा", kidsWear: "बच्चों के कपड़े", accessories: "ऍक्सेसरीज़", quickLinks: "त्वरित लिंक", customerService: "ग्राहक सेवा", contactUs: "संपर्क करें", address: "123, फैशन स्ट्रीट, दिल्ली - 110006, भारत", hours: "सोम-शन: 10AM - 9PM", weAccept: "हम स्वीकार करते हैं:", copyright: "© 2025 StitchCraft। सर्वाधिकार सुरक्षित।", loading: "स्टिचक्रेफ्ट लोड हो रहा है...",}
};

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.classList.add('hidden');
  renderProducts();
  renderTestimonials();
  renderStores();
  renderHeroDots();
  updateCartUI();
  setupScrollAnimations();
  setupNavbarScroll();
  resetHeroInterval();
  initCloud();
  try {
    if (window.location.hash === '#signup' && cloudEnabled()) openAccountModalOnSignup();
  } catch (e) {}
});

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  grid.innerHTML = testimonials.map(t => {
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<i class="fas fa-star"${i < t.rating ? '' : ' style="opacity:0.3"'}></i>`).join('');
    return `
      <div class="testimonial-card">
        <div class="testimonial-stars">${stars}</div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <img class="testimonial-avatar" src="${t.avatar}" alt="${t.name}" loading="lazy" onerror="this.style.display='none'">
          <div><div class="testimonial-name">${t.name}</div><div class="testimonial-location">${t.location}</div></div>
        </div>
      </div>`;
  }).join('');
}

function renderStores() {
  const grid = document.getElementById('storesGrid');
  if (!grid) return;
  grid.innerHTML = stores.map(s => `
    <div class="store-card">
      <div class="store-img"><img src="${s.image}" alt="${s.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="store-info">
        <h3>${s.name}</h3>
        <p class="store-address"><i class="fas fa-map-marker-alt"></i><span>${s.address}</span></p>
        <p><i class="fas fa-phone"></i> <a href="tel:${s.phone.replace(/\s/g, '')}">${s.phone}</a></p>
        <a class="store-link" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}" target="_blank" rel="noopener">Get Directions <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>`).join('');
}

function toggleLanguage() {
  isEnglish = !isEnglish;
  document.getElementById('langLabel').textContent = isEnglish ? 'HI' : 'EN';
  applyLanguage();
}

function applyLanguage() {
  const t = translations[isEnglish ? 'en' : 'hi'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  const heroTitles = document.querySelectorAll('.hero h1');
  if (!isEnglish) {
    heroTitles.forEach(h => {
      const key = h.getAttribute('data-i18n');
      if (key === 'festivalTitle') h.textContent = 'फेस्टिव वियर कलेक्शन 2025';
      else if (key === 'menswearTitle') h.textContent = 'प्रीमियम मेंज़वेयर';
      else if (key === 'freeShipping') h.textContent = '₹999 से अधिक पर मुफ्त शिपिंग';
    });
  } else {
    heroTitles.forEach(h => {
      const key = h.getAttribute('data-i18n');
      if (key === 'festivalTitle') h.textContent = 'Festive Wear Collection 2025';
      else if (key === 'menswearTitle') h.textContent = 'Premium Menswear';
      else if (key === 'freeShipping') h.textContent = 'Free Shipping Above ₹999';
    });
  }
  document.getElementById('langToggle').style.background = isEnglish ? 'var(--bg)' : 'var(--primary)';
  document.getElementById('langToggle').style.color = isEnglish ? 'var(--primary)' : 'white';
  renderProducts();
}

function renderHeroDots() {
  const dotsContainer = document.getElementById('heroDots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const slides = document.querySelectorAll('.hero-slide');
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
}

let heroInterval = null;
function resetHeroInterval(){ if (!document.querySelectorAll('.hero-slide').length) return; if (heroInterval) clearInterval(heroInterval); heroInterval = setInterval(nextSlide, 5000); }
function nextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  const current = [...slides].findIndex(s => s.classList.contains('active'));
  goToSlide((current + 1) % slides.length);
}
function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  resetHeroInterval();
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('mobile-open');
}

function toggleSearch() {
  const searchBox = document.getElementById('searchBox');
  searchBox.classList.toggle('active');
  if (searchBox.classList.contains('active')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
  }
}

function handleSearch(val) {
  if (typeof val === 'undefined' || val === null) {
    const inp = document.getElementById('searchInput');
    val = inp ? inp.value : '';
  }
  const searchTerm = String(val).toLowerCase().trim();
  if (!searchTerm) { currentFilter = 'all'; currentPage = 0; renderProducts(); return; }
  currentFilter = 'all';
  currentPage = 0;
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.gender.toLowerCase().includes(searchTerm)
  );
  renderProducts(filtered);
  const loadMoreBtn2 = document.getElementById('loadMoreBtn');
  if (loadMoreBtn2) loadMoreBtn2.style.display = 'none';
}

function filterCategory(cat) {
  currentFilter = 'all';
  currentPage = 0;
  currentCategory = (currentCategory === cat) ? 'all' : cat; // click again to clear
  document.querySelectorAll('.filter-tabs .filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.category-card').forEach(c => {
    const m = (c.getAttribute('onclick') || '');
    c.classList.toggle('active', currentCategory !== 'all' && m.includes("'" + currentCategory + "'"));
  });
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  renderProducts();
  navigateTo('shop');
  if (currentCategory !== 'all') showToast('Showing: ' + currentCategory);
}

function filterProducts(filter, btn) {
  currentFilter = filter;
  currentPage = 0;
  document.querySelectorAll('.filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

function renderProducts(filterProductsList) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  let filtered = filterProductsList || products;
  if (currentFilter !== 'all') filtered = filtered.filter(p => p.gender === currentFilter);
  if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
  const toShow = filtered.slice(0, (currentPage + 1) * productsPerPage);
  grid.innerHTML = toShow.map(p => {
    const pst = stockStatus(p);
    return `
    <div class="product-card${pst === 'out' ? ' out-of-stock' : ''}" onclick="openProductModal(${p.id})">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='0.3'">
        ${pst === 'out' ? `<span class="product-badge-small out">Out of Stock</span>` : (p.badge ? `<span class="product-badge-small ${p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</span>` : '')}
        <div class="product-actions">
          <button onclick="event.stopPropagation();openProductModal(${p.id})" title="Quick View"><i class="fas fa-eye"></i></button>
          <button onclick="event.stopPropagation();addToCartDirect(${p.id})" title="Add to Cart"><i class="fas fa-cart-plus"></i></button>
          <button onclick="event.stopPropagation();addToWishlist(${p.id})" title="Wishlist"><i class="fas fa-heart"></i></button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        ${pst === 'out' ? `<div class="stock-line out">Out of Stock</div>` : (pst === 'low' ? `<div class="stock-line low">${stockLabel(p)}</div>` : '')}
        <div class="product-price-row">
          <span class="product-price">₹${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="product-old-price">₹${p.oldPrice.toLocaleString()}</span>` : ''}
          <span class="product-rating"><i class="fas fa-star"></i> ${p.rating} (${p.reviews})</span>
        </div>
      </div>
    </div>`;
  }).join('');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = toShow.length < filtered.length ? 'inline-flex' : 'none';
}

function loadMoreProducts() { currentPage++; renderProducts(); }

function openProductModal(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  currentModalProduct = p;
  modalQty = 1;
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalRating').innerHTML = `<i class="fas fa-star"></i> ${p.rating} <span style="color:var(--text-light);font-size:0.85rem">(${p.reviews} reviews)</span>`;
  document.getElementById('modalPrice').innerHTML = `<span class="new-price">₹${p.price.toLocaleString()}</span>${p.oldPrice ? `<span class="old-price">₹${p.oldPrice.toLocaleString()}</span>` : ''}`;
  document.getElementById('modalDesc').textContent = p.desc;
  const badgeEl = document.getElementById('modalBadge');
  badgeEl.textContent = p.badge;
  badgeEl.style.display = p.badge ? 'block' : 'none';
  badgeEl.style.background = p.badge === 'Sale' ? 'var(--accent)' : p.badge === 'Premium' ? '#c41e3a' : '#28a745';
  delete selectedSizes[p.id];
  document.getElementById('modalSizes').innerHTML = p.sizes.map(s => {
    const q = getStock(p, s);
    return `<button class="size-btn" onclick="selectSize(this,'${s}')" ${q <= 0 ? 'disabled' : ''} title="${s} — ${q} in stock">${s}</button>`;
  }).join('');
  let modalStockEl = document.getElementById('modalStock');
  if (!modalStockEl) {
    modalStockEl = document.createElement('div');
    modalStockEl.id = 'modalStock';
    document.getElementById('modalDesc').after(modalStockEl);
  }
  const mst = stockStatus(p);
  modalStockEl.className = 'modal-stock ' + mst;
  modalStockEl.textContent = mst === 'out' ? 'Out of Stock' : (mst === 'low' ? stockLabel(p) : 'In Stock');
  updateQtyHeader();
  document.getElementById('modalColors').innerHTML = p.colors.map(c => `<div class="color-dot" style="background:${getColorHex(c)}" onclick="selectColor(this,'${c}')" title="${c}"></div>`).join('');
  document.getElementById('modalQty').textContent = '1';
  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function getColorHex(color) {
  const map = { white: '#ffffff', blue: '#2196F3', cream: '#FFFDD0', red: '#c41e3a', maroon: '#800000', gold: '#FFD700', peach: '#FFCBA4', teal: '#008080', burgundy: '#800020', yellow: '#FFD700', green: '#4CAF50', orange: '#FF9800', navy: '#000080', black: '#333333', grey: '#9E9E9E', gray: '#9E9E9E', pink: '#FF69B4', skyblue: '#87CEEB', purple: '#9C27B0', ivory: '#FFFFF0', beige: '#F5F5DC', charcoal: '#36454F', rosegold: '#E0BFB8', pastelyellow: '#FFF9C4', royalblue: '#4169E1' };
  const key = String(color || '').toLowerCase().replace(/\s+/g, '');
  return map[key] || '#cccccc';
}

function selectSize(el, size) {
  if (!currentModalProduct) return;
  if (getStock(currentModalProduct, size) <= 0) { showToast(`${size} is out of stock`); return; }
  selectedSizes[currentModalProduct.id] = size;
  el.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  modalQty = 1;
  document.getElementById('modalQty').textContent = modalQty;
  updateQtyHeader();
}

function selectColor(el, color) {
  if (!currentModalProduct) return;
  selectedColors[currentModalProduct.id] = color;
  el.parentElement.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

function getSelectedSize() {
  if (!currentModalProduct) return null;
  const sel = selectedSizes[currentModalProduct.id];
  if (sel) return sel;
  if (currentModalProduct.sizes.length === 1) return currentModalProduct.sizes[0];
  return null;
}
function updateQtyHeader() {
  const h = document.querySelector('#productModal .quantity-selector h4');
  if (!h) return;
  const size = getSelectedSize();
  if (currentModalProduct && size) h.textContent = `Quantity (${getStock(currentModalProduct, size)} available in ${size})`;
  else h.textContent = 'Quantity';
}
function maxQtyForCurrent() {
  if (!currentModalProduct) return 10;
  const size = getSelectedSize();
  const avail = size ? getStock(currentModalProduct, size) : getStock(currentModalProduct);
  return Math.max(1, Math.min(10, avail));
}
function changeQty(delta) {
  modalQty = Math.max(1, Math.min(maxQtyForCurrent(), modalQty + delta));
  document.getElementById('modalQty').textContent = modalQty;
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

function addToCartFromModal() {
  if (!currentModalProduct) return;
  if (currentModalProduct.sizes.length > 1 && !selectedSizes[currentModalProduct.id]) { showToast('Please select a size'); return; }
  const size = getSelectedSize() || firstInStockSize(currentModalProduct);
  if (!size || getStock(currentModalProduct, size) <= 0) { showToast('This item is out of stock'); return; }
  addToCart(currentModalProduct.id, Math.min(modalQty, getStock(currentModalProduct, size)), size);
  closeProductModal();
}

function buyNow() {
  if (!currentModalProduct) return;
  if (currentModalProduct.sizes.length > 1 && !selectedSizes[currentModalProduct.id]) { showToast('Please select a size'); return; }
  const size = getSelectedSize() || firstInStockSize(currentModalProduct);
  if (!size || getStock(currentModalProduct, size) <= 0) { showToast('This item is out of stock'); return; }
  addToCart(currentModalProduct.id, Math.min(modalQty, getStock(currentModalProduct, size)), size);
  closeProductModal();
  setTimeout(() => navigateTo('checkout'), 300);
}

function addToCartDirect(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  const size = firstInStockSize(p);
  if (!size) { showToast(`${p.name} is out of stock`); return; }
  addToCart(id, 1, size);
}

function addToWishlist(id) {
  const p = products.find(pr => pr.id === id);
  if (p) showToast(`${p.name} added to Wishlist!`);
}

function cartSizeOf(item) { return item.size || null; }
function addToCart(id, qty, size) {
  const p = products.find(pr => pr.id === id);
  const normSize = size || null;
  if (p && normSize && getStock(p, normSize) <= 0) { showToast(`${p.name} (${normSize}) is out of stock`); return; }
  const existing = cart.find(item => item.id === id && cartSizeOf(item) === normSize);
  const already = existing ? existing.qty : 0;
  if (p && normSize) qty = Math.min(qty, Math.max(0, getStock(p, normSize) - already));
  if (qty <= 0) { showToast('No more stock available for this size'); return; }
  if (existing) existing.qty += qty;
  else cart.push({ id, size: normSize, qty });
  saveCart();
  updateCartUI();
  showToast(p ? `${p.name}${normSize ? ' (' + normSize + ')' : ''} added to cart!` : 'Added to cart!');
  renderCartItems();
}

function removeFromCart(id, size) {
  const normSize = size || null;
  cart = cart.filter(item => !(item.id === id && cartSizeOf(item) === normSize));
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartQty(id, delta, size) {
  const normSize = size || null;
  const item = cart.find(i => i.id === id && cartSizeOf(i) === normSize);
  if (item) {
    if (delta > 0) {
      const p = products.find(pr => pr.id === id);
      if (p && normSize && item.qty + delta > getStock(p, normSize)) { showToast(`Only ${getStock(p, normSize)} available in ${normSize}`); return; }
    }
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id, normSize); return; }
    saveCart();
    updateCartUI();
    renderCartItems();
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = totalItems;
  const count = document.getElementById('cartCount');
  if (count) count.textContent = totalItems;
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('active');
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart" data-i18n="emptyCart">Your cart is empty</p>';
    summary.style.display = 'none';
    return;
  }
  summary.style.display = 'block';
  container.innerHTML = cart.map(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return '';
    const sizeKey = cartSizeOf(item) || '';
    return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${p.img}" alt="${p.name}"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${p.name}</div>
          ${sizeKey ? `<div class="cart-item-size">Size: ${sizeKey}</div>` : ''}
          <div class="cart-item-price">₹${(p.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button onclick="updateCartQty(${item.id},-1,'${sizeKey}')">-</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty(${item.id},1,'${sizeKey}')">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${sizeKey}')"><i class="fas fa-trash"></i> Remove</button>
        </div>
      </div>
    `;
  }).join('');
  const subtotal = cart.reduce((sum, item) => sum + (products.find(pr => pr.id === item.id)?.price * item.qty || 0), 0);
  const total = Math.max(0, subtotal - (cartDiscount || 0));
  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
}

function applyPromo() {
  const code = document.getElementById('promoCode').value.trim().toUpperCase();
  if (code === 'FESTIVE2025' || code === 'EXTRA500') {
    const subtotal = cart.reduce((s, i) => s + (products.find(pr => pr.id === i.id)?.price * i.qty || 0), 0);
    cartDiscount = code === 'FESTIVE2025' ? Math.floor(subtotal * 0.5) : 500;
    showToast('Promo code applied successfully!');
    renderCartItems();
    updateCheckoutTotals();
  } else {
    showToast('Invalid promo code');
  }
}

const NAV_ALIASES = { home: 'hero', checkout: 'checkoutOverlay', cart: 'cartOverlay' };
function navigateTo(section) {
  closeAllOverlays();
  document.getElementById('navLinks')?.classList.remove('mobile-open');
  if (section === 'cart') { toggleCart(); return; }
  if (section === 'checkout') {
    if (cart.length === 0) { showToast('Your cart is empty'); toggleCart(); return; }
    toggleCheckout(); return;
  }
  const targetId = NAV_ALIASES[section] || section;
  if (section === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  else { const el = document.getElementById(targetId); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
  document.querySelectorAll('.nav-link').forEach(a => {
    const oc = a.getAttribute('onclick') || '';
    a.classList.toggle('active', oc.includes("'" + section + "'"));
  });
}

function closeAllOverlays() {
  ['cartOverlay', 'checkoutOverlay', 'orderSuccess', 'authModal', 'ordersModal'].forEach(id => {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
  });
  closeProductModal();
}

function toggleCheckout() {
  const overlay = document.getElementById('checkoutOverlay');
  const willOpen = !overlay.classList.contains('active');
  if (willOpen && cart.length === 0) { showToast('Your cart is empty'); return; }
  overlay.classList.toggle('active');
  if (document.getElementById('checkoutOverlay').classList.contains('active')) {
    updateCheckoutTotals();
    initPickupStores();
  }
}

function switchCheckoutTab(tab, btn) {
  document.querySelectorAll('.checkout-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('checkoutDelivery').style.display = tab === 'delivery' ? 'block' : 'none';
  document.getElementById('checkoutPickup').style.display = tab === 'pickup' ? 'block' : 'none';
}

function initPickupStores() {
  const container = document.getElementById('pickupStores');
  if (!container) return;
  container.innerHTML = stores.map((s, i) => `
    <label class="payment-option" style="margin-bottom:0.5rem">
      <input type="radio" name="pickupStore" value="${i}">
      <div class="payment-card" style="flex-direction:column;align-items:flex-start">
        <strong>${s.name}</strong>
        <small style="color:var(--text-light)">${s.address}</small>
      </div>
    </label>
  `).join('');
}

function updateCheckoutTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (products.find(pr => pr.id === item.id)?.price * item.qty || 0), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = cartDiscount;
  const grandTotal = subtotal + shipping - discount;
  document.getElementById('checkoutSubtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`;
  document.getElementById('checkoutDiscount').textContent = `-₹${discount.toLocaleString()}`;
  document.getElementById('checkoutGrandTotal').textContent = `₹${Math.max(0, grandTotal).toLocaleString()}`;
}

function placeOrder() {
  if (cart.length === 0) { showToast('Your cart is empty'); return; }
  const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;
  if (!selectedPayment) { showToast('Please select a payment method'); return; }
  if (document.getElementById('checkoutDelivery').style.display !== 'none') {
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    if (!name || !phone || !address || !city || !state || !pincode) { showToast('Please fill in all shipping details'); return; }
  }
  if (document.getElementById('checkoutPickup').style.display !== 'none') {
    if (!document.querySelector('input[name="pickupStore"]:checked')) { showToast('Please select a store for pickup'); return; }
  }
  const orderId = 'SC' + Date.now().toString().slice(-8);
  const order = buildCloudOrder(orderId);
  document.getElementById('orderId').textContent = orderId;
  document.getElementById('orderSuccess').classList.add('active');
  document.getElementById('checkoutOverlay').classList.remove('active');
  document.getElementById('orderSuccess').dataset.orderCode = orderId;
  document.getElementById('orderSuccess').dataset.fullOrder = JSON.stringify(order);
  persistOrderCloud(order);
  cart.forEach(item => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return;
    const sz = cartSizeOf(item);
    if (sz && p.stock[sz] != null) {
      p.stock[sz] = Math.max(0, (parseInt(p.stock[sz], 10) || 0) - item.qty);
    } else {
      let need = item.qty;
      p.sizes.forEach(s => {
        if (need <= 0) return;
        const take = Math.min(need, parseInt(p.stock[s], 10) || 0);
        p.stock[s] = (parseInt(p.stock[s], 10) || 0) - take;
        need -= take;
      });
    }
  });
  saveCatalog();
  cart = [];
  cartDiscount = 0;
  saveCart();
  updateCartUI();
  renderProducts();
}

function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email'); return; }
  showToast('Subscribed successfully!');
  document.getElementById('newsletterEmail').value = '';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#333;color:#fff;padding:1rem 2rem;border-radius:8px;z-index:5000;font-size:0.9rem;animation:slideIn 0.3s ease,fadeOut 0.3s ease 2.7s forwards;box-shadow:0 4px 15px rgba(0,0,0,0.2);';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-aos]').forEach(el => {
    if (el.closest && el.closest('.hero')) return; // hero slides manage their own visibility
    el.style.opacity = '0'; el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

function setupNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'cartOverlay') toggleCart();
  if (e.target.id === 'checkoutOverlay') toggleCheckout();
  if (e.target.id === 'orderSuccess') document.getElementById('orderSuccess').classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllOverlays();
});

// Prevent jump-to-top for placeholder links
document.addEventListener('click', (e) => {
  const a = e.target.closest ? e.target.closest('a[href="#"]') : null;
  if (a) e.preventDefault();
});

/* ---------- Cloud accounts + shared catalog (Supabase) ---------- */

function escHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function initCloud() {
  const ok = await waitForSupabase();
  if (!ok) return;
  await syncCloudCatalog();
  await refreshAuthUI();
  try {
    if (supa && supa.auth && supa.auth.onAuthStateChange) {
      supa.auth.onAuthStateChange(() => refreshAuthUI());
    }
  } catch (e) {}
}

async function syncCloudCatalog() {
  if (!cloudEnabled()) return;
  try {
    const list = await dbListProducts();
    if (list && list.length) {
      products = list;
      currentPage = 0;
      renderProducts();
    }
  } catch (e) {}
}

async function refreshAuthUI() {
  const btn = document.getElementById('accountBtn');
  if (!btn) return;
  try { currentUser = await getSessionUser(); } catch (e) { currentUser = null; }
  try { currentUserIsAdmin = currentUser ? await isAdminUser() : false; } catch (e) { currentUserIsAdmin = false; }
  const icon = document.getElementById('accountIcon');
  const initial = document.getElementById('accountInitial');
  if (currentUser) {
    const letter = ((currentUser.email || 'U').charAt(0) || 'U').toUpperCase();
    if (icon) icon.style.display = 'none';
    if (initial) { initial.textContent = letter; initial.style.display = 'flex'; }
    const emailEl = document.getElementById('accountEmail');
    if (emailEl) emailEl.textContent = currentUser.email || '';
    const pill = document.getElementById('adminPill');
    if (pill) pill.style.display = currentUserIsAdmin ? 'inline-block' : 'none';
    const dash = document.getElementById('adminDashBtn');
    if (dash) dash.style.display = currentUserIsAdmin ? 'inline-flex' : 'none';
  } else {
    if (icon) icon.style.display = '';
    if (initial) initial.style.display = 'none';
  }
}

async function openAccountModal() {
  if (!cloudEnabled()) { showToast('Online accounts are not set up yet — ask the store owner to connect Supabase'); return; }
  await refreshAuthUI();
  if (!currentUser) { window.location.href = 'login.html'; return; }
  const forms = document.getElementById('authForms');
  const panel = document.getElementById('accountPanel');
  if (forms) forms.style.display = 'none';
  if (panel) panel.style.display = 'block';
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('active');
}

/* Deep link: login.html "Create an account" sends shoppers back here. */
async function openAccountModalOnSignup() {
  await refreshAuthUI();
  if (currentUser) return;
  const forms = document.getElementById('authForms');
  const panel = document.getElementById('accountPanel');
  if (forms) forms.style.display = 'block';
  if (panel) panel.style.display = 'none';
  switchAuthTab('signup');
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('active');
}

function closeAccountModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(which) {
  const login = which === 'login';
  document.getElementById('tabLogin').classList.toggle('active', login);
  document.getElementById('tabSignup').classList.toggle('active', !login);
  document.getElementById('loginPane').style.display = login ? 'block' : 'none';
  document.getElementById('signupPane').style.display = login ? 'none' : 'block';
}

async function loginWithEmail() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  if (!email || !password) { errEl.textContent = 'Enter your email and password.'; return; }
  const res = await signInWithEmail(email, password);
  if (res.error) { errEl.textContent = res.error; return; }
  closeAccountModal();
  await refreshAuthUI();
  showToast('Welcome back!');
}

async function signupWithEmail() {
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl = document.getElementById('signupError');
  errEl.textContent = '';
  if (!email || password.length < 6) { errEl.textContent = 'Enter an email and a password of at least 6 characters.'; return; }
  const res = await signUpWithEmail(email, password);
  if (res.error) { errEl.textContent = res.error; return; }
  if (res.needsConfirmation) {
    errEl.style.color = '#137333';
    errEl.textContent = 'Account created! Check your email to confirm, then login.';
    return;
  }
  closeAccountModal();
  await refreshAuthUI();
  showToast('Account created — welcome!');
}

async function logoutUser() {
  await signOutUser();
  currentUser = null;
  currentUserIsAdmin = false;
  closeAccountModal();
  await refreshAuthUI();
  showToast('Logged out');
}

async function openMyOrders() {
  const box = document.getElementById('ordersList');
  const modal = document.getElementById('ordersModal');
  if (!box || !modal) return;
  box.innerHTML = '<p class="auth-sub">Loading...</p>';
  modal.classList.add('active');
  const orders = await dbListMyOrders();
  if (!orders.length) { box.innerHTML = '<p class="auth-sub">No orders yet.</p>'; return; }
  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };
  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#10b981' };
  box.innerHTML = orders.map(o => {
    const items = Array.isArray(o.items) ? o.items : [];
    const desc = items.slice(0, 2).map(i => `${i.name || 'Item'}${i.size ? ' (' + i.size + ')' : ''} × ${i.qty}`).join(', ');
    const more = items.length > 2 ? ` +${items.length - 2} more` : '';
    const date = o.created_at ? new Date(o.created_at).toLocaleString() : '';
    const status = o.status || 'pending';
    const color = statusColors[status] || '#666';
    return `<div class="order-card" onclick="showOrderDetail('${o.order_code}')">
      <div class="order-card-header">
        <div>
          <div class="order-code">#${escHtml(o.order_code)}</div>
          <div class="order-date">${escHtml(date)}</div>
        </div>
        <div class="order-status" style="background:${color}20;color:${color}">${statusLabels[status] || 'Pending'}</div>
      </div>
      <div class="order-items-preview">${escHtml(desc)}${escHtml(more)}</div>
      <div class="order-total-row">Total: <strong>₹${Number(o.total || 0).toLocaleString()}</strong></div>
      <div class="order-view-detail">View Details →</div>
    </div>`;
  }).join('');
}

function showOrderDetail(orderCode) {
  const modal = document.getElementById('orderDetailModal');
  if (!modal) return;
  dbListMyOrders().then(orders => {
    const order = orders.find(o => o.order_code === orderCode);
    if (!order) { showToast('Order not found'); return; }
    const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };
    const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#10b981' };
    const status = order.status || 'pending';
    const color = statusColors[status] || '#666';
    const items = Array.isArray(order.items) ? order.items : [];
    const paymentLabels = { upi: 'UPI / GPay / PhonePe', cod: 'Cash on Delivery', card: 'Credit/Debit Card', emi: 'No Cost EMI' };
    let itemsHtml = items.map(i => `
      <div class="detail-item">
        <img src="${i.img || 'https://via.placeholder.com/60'}" alt="" onerror="this.src='https://via.placeholder.com/60'">
        <div class="detail-item-info">
          <div class="detail-item-name">${escHtml(i.name || 'Product')}</div>
          <div class="detail-item-meta">${i.size ? 'Size: ' + escHtml(i.size) : ''} × ${i.qty}</div>
          <div class="detail-item-price">₹${Number(i.price || 0).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
    let timelineHtml = '';
    const history = order.statusHistory || [];
    history.forEach((step, idx) => {
      const isActive = step.status === status;
      const isPast = history.findIndex(h => h.status === status) >= idx;
      timelineHtml += `
        <div class="timeline-step ${isPast ? 'past' : ''} ${isActive ? 'active' : ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-label">${step.label}</div>
            <div class="timeline-date">${step.date ? new Date(step.date).toLocaleString() : 'Pending'}</div>
          </div>
        </div>
      `;
    });
    modal.innerHTML = `
      <div class="order-detail-modal">
        <div class="detail-header">
          <h3>Order #${escHtml(order.order_code)}</h3>
          <button class="modal-close" onclick="closeOrderDetail()"><i class="fas fa-times"></i></button>
        </div>
        <div class="detail-body">
          <div class="detail-status-bar" style="background:${color}20;color:${color}">
            <i class="fas fa-truck"></i> ${statusLabels[status] || 'Pending'}
          </div>
          <div class="detail-section">
            <h4><i class="fas fa-clock"></i> Order Timeline</h4>
            <div class="timeline">${timelineHtml}</div>
          </div>
          <div class="detail-section">
            <h4><i class="fas fa-box"></i> Items (${items.length})</h4>
            <div class="detail-items">${itemsHtml}</div>
          </div>
          <div class="detail-section">
            <h4><i class="fas fa-rupee-sign"></i> Order Summary</h4>
            <div class="detail-summary">
              <div class="summary-row"><span>Subtotal</span><span>₹${Number(order.subtotal || 0).toLocaleString()}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${order.shipping == 0 ? 'Free' : '₹' + Number(order.shipping || 0).toLocaleString()}</span></div>
              ${order.discount > 0 ? `<div class="summary-row discount"><span>Discount</span><span>-₹${Number(order.discount || 0).toLocaleString()}</span></div>` : ''}
              <div class="summary-row total"><span>Total</span><span>₹${Number(order.total || 0).toLocaleString()}</span></div>
            </div>
          </div>
          <div class="detail-section">
            <h4><i class="fas fa-credit-card"></i> Payment Method</h4>
            <p>${paymentLabels[order.payment] || order.payment || 'Not specified'}</p>
          </div>
          ${order.pickupStore ? `
          <div class="detail-section">
            <h4><i class="fas fa-store"></i> Store Pickup</h4>
            <p>${escHtml(order.pickupStore)}</p>
          </div>
          ` : `
          <div class="detail-section">
            <h4><i class="fas fa-truck"></i> Delivery Address</h4>
            <p>${escHtml(order.name || '')}</p>
            <p>${escHtml(order.address || '')}</p>
            <p>${escHtml(order.city || '')}, ${escHtml(order.state || '')} - ${escHtml(order.pincode || '')}</p>
            <p>Phone: ${escHtml(order.phone || '')}</p>
          </div>
          `}
          <div class="detail-section">
            <h4><i class="fas fa-calendar"></i> Order Date</h4>
            <p>${order.created_at ? new Date(order.created_at).toLocaleString() : 'Not available'}</p>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
  });
}

function closeOrderDetail() {
  const modal = document.getElementById('orderDetailModal');
  if (modal) modal.classList.remove('active');
}

function closeMyOrders() {
  const modal = document.getElementById('ordersModal');
  if (modal) modal.classList.remove('active');
}

function buildCloudOrder(orderId) {
  const val = id => { const n = document.getElementById(id); return n && n.value ? n.value.trim() : ''; };
  const items = cart.map(item => {
    const pr = products.find(x => x.id === item.id) || {};
    return { id: item.id, name: pr.name || '', size: cartSizeOf(item), qty: item.qty, price: pr.price || 0, img: pr.img || '' };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  let pickupStore = null;
  try {
    const sel = document.querySelector('input[name="pickupStore"]:checked');
    if (sel && document.getElementById('checkoutPickup').style.display !== 'none') {
      const idx = parseInt(sel.value, 10);
      if (stores[idx]) pickupStore = stores[idx].name;
    }
  } catch (e) {}
  const now = new Date().toISOString();
  return {
    orderCode: orderId,
    items, subtotal, shipping,
    discount: cartDiscount,
    total: Math.max(0, subtotal + shipping - cartDiscount),
    name: val('fullName'), phone: val('phone'), address: val('address'),
    city: val('city'), state: val('state'), pincode: val('pincode'),
    payment: (document.querySelector('input[name="payment"]:checked') || {}).value || '',
    pickupStore,
    status: 'pending',
    statusHistory: [
      { status: 'pending', label: 'Order Placed', date: now },
      { status: 'confirmed', label: 'Confirmed', date: null },
      { status: 'processing', label: 'Processing', date: null },
      { status: 'shipped', label: 'Shipped', date: null },
      { status: 'delivered', label: 'Delivered', date: null }
    ],
    orderDate: now
  };
}

function persistOrderCloud(order) {
  if (!cloudEnabled()) return;
  dbCreateOrder(order).then(res => {
    if (res && res.error) return;
    order.items.forEach(it => {
      const p = products.find(x => x.id === it.id);
      if (p) dbUpdateStock(p.id, p.stock);
    });
  });
}