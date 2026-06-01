import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  Star,
  Sparkles,
  Zap,
} from "lucide-react";

import specialProducts from "./data/Special-products.json";
import categoryProducts from "./data/cat-products.json";
import users from "./data/users.json";

const categories = [
  { key: "office_comp", name: "מחשבים משרדיים", img: "/Img/Case.png", hero: "/Img/office-desktop/office-desktopSectionTop.jpg" },
  { key: "cpu_cooling", name: "קירור למעבדים", img: "/Img/CpuCooling.png", hero: "/Img/cpu-cooling/CpuCoolingSectionTop.jpg" },
  { key: "power-supplay", name: "ספקי כוח", img: "/Img/power-sup.png", hero: "/Img/power-supplies/powerSuppliesSectionTop.jpg" },
  { key: "gpu", name: "כרטיסי מסך", img: "/Img/gpu.jpg", hero: "/Img/gpu/GpuSectionTop.jpg" },
  { key: "mboard", name: "לוחות אם", img: "/Img/mboard.jpg", hero: "/Img/motherboards/motherboardSectionTop.jpg" },
  { key: "cpu", name: "מעבדים", img: "/Img/cpu.png", hero: "/Img/cpu/CpuSectionTop.jpg" },
  { key: "gaming_chairs", name: "כיסאות גיימינג", img: "/Img/chair.png", hero: "/Img/noblechair/noblechairSectionTop.jpg" },
  { key: "headphones", name: "אוזניות", img: "/Img/headphones.png", hero: "/Img/headphones/headphonesSectionTop.jpg" },
  { key: "monitors", name: "מסכי מחשב", img: "/Img/screens.png", hero: "/Img/monitors/monitorsSectionTop.jpg" },
  { key: "laptops", name: "מחשבים ניידים", img: "/Img/laptop.png", hero: "/Img/notebook/notebookSectionTop.jpg" },
  { key: "gaming-pc", name: "מחשבי גיימינג", img: "/Img/gaming-pc.png", hero: "/Img/gaming-pc/gamingpcSectionTop.jpg" },
];

const sliderImages = ["/Img/slider1.jpg", "/Img/slider2.jpg", "/Img/slider3.jpg", "/Img/slider4.jpg"];

function getImage(img) {
  if (!img) return "";
  if (img.startsWith("/")) return img;
  return "/" + img.replace(/^IMG/i, "Img");
}

function priceNumber(price) {
  return Number(String(price).replace(/[^0-9]/g, "")) || 0;
}

function productId(product) {
  return `${product.source || "item"}-${product.id}-${product.name}`;
}

function readStorage(key, backup) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : backup;
  } catch {
    return backup;
  }
}

function prepareProduct(product, source) {
  return {
    ...product,
    source,
    image: getImage(product.img),
    idForCart: `${source}-${product.id}-${product.name}`,
  };
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [wishlist, setWishlist] = useState(() => readStorage("digitil_wishlist", []));
  const [cart, setCart] = useState(() => readStorage("digitil_cart", []));

  useEffect(() => {
    localStorage.setItem("digitil_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("digitil_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
  }, [mobileOpen]);

  function moveSlide(direction) {
    let nextIndex = slideIndex + direction;

    if (nextIndex > sliderImages.length - 1) nextIndex = 0;
    if (nextIndex < 0) nextIndex = sliderImages.length - 1;

    setSlideIndex(nextIndex);
  }

  function goHome() {
    setPage("home");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setPage("category");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openWishlist() {
    setPage("wishlist");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCart() {
    setPage("cart");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLogin() {
    setPage("login");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function searchProducts(event) {
    event.preventDefault();
    if (searchText.trim() === "") return;
    setSearchResult(searchText.trim());
    setPage("search");
    setMobileOpen(false);
  }

  function addToCart(product) {
    const id = productId(product);
    const foundProduct = cart.find((item) => productId(item) === id);

    if (foundProduct) {
      const updatedCart = cart.map((item) => {
        if (productId(item) === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      setCart([{ ...product, quantity: 1 }, ...cart]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => productId(item) !== id));
  }

  function changeQuantity(id, quantity) {
    const updatedCart = cart.map((item) => {
      if (productId(item) === id) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function toggleWishlist(product) {
    const id = productId(product);
    const foundProduct = wishlist.find((item) => productId(item) === id);

    if (foundProduct) {
      setWishlist(wishlist.filter((item) => productId(item) !== id));
    } else {
      setWishlist([{ ...product }, ...wishlist]);
    }
  }

  function clearCart() {
    setCart([]);
  }

  const allProducts = [];
  Object.keys(categoryProducts).forEach((key) => {
    const products = categoryProducts[key] || [];
    products.forEach((item) => allProducts.push(prepareProduct(item, key)));
  });
  specialProducts.forEach((item) => allProducts.push(prepareProduct(item, "special")));

  const filteredProducts = allProducts.filter((product) => {
    const text = `${product.h5} ${product.name} ${product.brand} ${product.type}`.toLowerCase();
    return text.includes(searchResult.toLowerCase());
  });

  return (
    <div className="site">
      <Header
        page={page}
        searchText={searchText}
        setSearchText={setSearchText}
        searchProducts={searchProducts}
        goHome={goHome}
        openWishlist={openWishlist}
        openCart={openCart}
        openLogin={openLogin}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <MobileMenu
        open={mobileOpen}
        categories={categories}
        goHome={goHome}
        openCategory={openCategory}
        openWishlist={openWishlist}
        openCart={openCart}
        openLogin={openLogin}
        setMobileOpen={setMobileOpen}
      />

      {page === "home" && (
        <HomePage
          categories={categories}
          openCategory={openCategory}
          slideIndex={slideIndex}
          moveSlide={moveSlide}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          setPage={setPage}
        />
      )}

      {page === "category" && (
        <CategoryPage
          category={selectedCategory}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      )}

      {page === "search" && (
        <SearchPage
          query={searchResult}
          products={filteredProducts}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      )}

      {page === "wishlist" && (
        <WishlistPage
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      )}

      {page === "cart" && (
        <CartPage
          cart={cart}
          changeQuantity={changeQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
      )}

      {page === "login" && <LoginPage />}

      <Footer goHome={goHome} openCategory={openCategory} categories={categories} />
    </div>
  );
}

function Header({
  searchText,
  setSearchText,
  searchProducts,
  goHome,
  openWishlist,
  openCart,
  openLogin,
  mobileOpen,
  setMobileOpen,
  wishlistCount,
  cartCount,
}) {
  return (
    <header className="main-header">
      <button className="logo" onClick={goHome}>
        <span>Digit</span>IL
      </button>

      <nav className="desktop-nav">
        <button onClick={goHome}>בית</button>
        <a href="#products">קטגוריות</a>
        <a href="#specials">מבצעים</a>
        <a href="#contact">יצירת קשר</a>
      </nav>

      <form className="search-box" onSubmit={searchProducts}>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="חיפוש מחשבים, מסכים, כרטיסי מסך..."
        />
        <button aria-label="חיפוש">
          <Search size={19} />
        </button>
      </form>

      <div className="header-actions">
        <IconButton icon={<Heart size={20} />} count={wishlistCount} onClick={openWishlist} label="מועדפים" />
        <IconButton icon={<User size={20} />} onClick={openLogin} label="התחברות" />
        <IconButton icon={<ShoppingCart size={20} />} count={cartCount} onClick={openCart} label="עגלה" />
        <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

function IconButton({ icon, count, onClick, label }) {
  return (
    <button className="icon-btn" onClick={onClick} aria-label={label}>
      {icon}
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

function MobileMenu({ open, categories, goHome, openCategory, openWishlist, openCart, openLogin, setMobileOpen }) {
  return (
    <>
      <div className={`screen-dark ${open ? "show" : ""}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-menu-top">
          <strong>DigitIL</strong>
          <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
        </div>

        <button onClick={goHome}>בית</button>
        <button onClick={openWishlist}>מועדפים</button>
        <button onClick={openCart}>עגלה</button>
        <button onClick={openLogin}>התחברות</button>

        <div className="mobile-categories">
          <span>קטגוריות</span>
          {categories.slice(0, 8).map((category) => (
            <button key={category.key} onClick={() => openCategory(category)}>{category.name}</button>
          ))}
        </div>
      </aside>
    </>
  );
}

function HomePage({ categories, openCategory, slideIndex, moveSlide, wishlist, toggleWishlist, addToCart, setPage }) {
  const specialItems = specialProducts.map((item) => prepareProduct(item, "special"));

  return (
    <main>
      <section className="hero-section">
        <div className="hero-image">
          <img src="/Img/hero-pic3.jpg" alt="חנות מחשבים DigitIL" />
        </div>

        <div className="hero-content">
          <h1>ציוד מחשבים איכותי לכל מקום ולכל כיס</h1>
          <p>
            מחשבי גיימינג, מחשבים משרדיים, מסכים, כרטיסי מסך, מעבדים ואביזרים —
            בעיצוב נקי, חווית קנייה מהירה ומוצרים שמרגישים יוקרתיים.
          </p>

          <div className="hero-buttons">
            <a href="#products" className="primary-link">צפה בקטגוריות</a>
            <a href="#specials" className="secondary-link">המבצעים שלנו</a>
          </div>

          <div className="trust-row">
            <TrustItem icon={<Truck size={20} />} title="משלוח מהיר" text="עד הבית או איסוף עצמי" />
            <TrustItem icon={<ShieldCheck size={20} />} title="אחריות יבואן" text="מוצרים מקוריים בלבד" />
            <TrustItem icon={<Headphones size={20} />} title="ייעוץ אישי" text="התאמת מוצר לפי צורך" />
          </div>
        </div>
      </section>

      <section className="deals-section">
        <div className="main-slider">
          <img src={sliderImages[slideIndex]} alt="באנר מבצעים" />
          <div className="slider-glass">
            <span>מבצעי השבוע</span>
            <h2>שדרוגים לגיימינג ולעבודה</h2>
            <p>ציוד מוביל, מפרטים חזקים ומוצרים שנבחרו בקפידה.</p>
          </div>
          <button className="slider-btn right" onClick={() => moveSlide(1)}><ChevronRight /></button>
          <button className="slider-btn left" onClick={() => moveSlide(-1)}><ChevronLeft /></button>
        </div>

        <div className="side-ads">
          <img src="/Img/ad-small-upper.png" alt="מבצע" />
          <div className="two-ads">
            <img src="/Img/ad-small-lower-left.jpg" alt="מבצע" />
            <img src="/Img/ad-small-lower-right.jpg" alt="מבצע" />
          </div>
        </div>
      </section>

      <section id="products" className="categories-section">
        <SectionTitle label="קטגוריות" title="בחר את השדרוג הבא שלך" text="שמרתי את מבנה הקטגוריות מהאתר המקורי, אבל נתתי לו מראה נקי, רחב ויותר יוקרתי." />

        <div className="categories-grid">
          {categories.map((category) => (
            <button className="category-card" key={category.key} onClick={() => openCategory(category)}>
              <img src={category.img} alt={category.name} />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="specials" className="specials-section">
        <SectionTitle label="מבצעים" title="המוצרים החמים עכשיו" text="כרטיסים, מסכים ואוזניות שבולטים בעיצוב, מחיר ובביקוש." />

        <div className="products-grid">
          {specialItems.map((product) => (
            <ProductCard
              key={productId(product)}
              product={product}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              onFastBuy={() => {
                addToCart(product);
                setPage("cart");
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="trust-item">
      {icon}
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function SectionTitle({ label, title, text }) {
  return (
    <div className="section-title">
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function CategoryPage({ category, wishlist, toggleWishlist, addToCart }) {
  const products = (categoryProducts[category.key] || []).map((item) => prepareProduct(item, category.key));
  const [sort, setSort] = useState("default");
  const [filterText, setFilterText] = useState("");

  let shownProducts = products.filter((product) => {
    const text = `${product.h5} ${product.name} ${product.brand}`.toLowerCase();
    return text.includes(filterText.toLowerCase());
  });

  if (sort === "low") {
    shownProducts = [...shownProducts].sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
  }

  if (sort === "high") {
    shownProducts = [...shownProducts].sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
  }

  return (
    <main>
      <section className="category-hero" style={{ backgroundImage: `url(${category.hero})` }}>
        <div>
          <span>קטגוריה</span>
          <h1>{category.name}</h1>
          <p>{products.length} מוצרים זמינים לבחירה מהירה</p>
        </div>
      </section>

      <section className="category-content">
        <div className="category-toolbar">
          <div>
            <h2>{category.name}</h2>
            <p>בחר מוצר, הוסף למועדפים או זרוק ישר לעגלה.</p>
          </div>

          <div className="toolbar-inputs">
            <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="חיפוש בתוך הקטגוריה" />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">סדר רגיל</option>
              <option value="low">מחיר מהנמוך לגבוה</option>
              <option value="high">מחיר מהגבוה לנמוך</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {shownProducts.map((product) => (
            <ProductCard
              key={productId(product)}
              product={product}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          ))}
        </div>

        {shownProducts.length === 0 && <EmptyState title="לא נמצאו מוצרים" text="נסה לחפש שם מוצר אחר או לשנות מיון." />}
      </section>
    </main>
  );
}

function SearchPage({ query, products, wishlist, toggleWishlist, addToCart }) {
  return (
    <main className="simple-page">
      <SectionTitle label="חיפוש" title={`תוצאות עבור: ${query}`} text={`נמצאו ${products.length} מוצרים שמתאימים לחיפוש שלך.`} />

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={productId(product)}
            product={product}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
          />
        ))}
      </div>

      {products.length === 0 && <EmptyState title="לא מצאתי מוצר מתאים" text="נסה חיפוש קצר יותר, לדוגמה RTX, Ryzen, Monitor או Corsair." />}
    </main>
  );
}

function ProductCard({ product, wishlist, toggleWishlist, addToCart, onFastBuy }) {
  const isLiked = wishlist.some((item) => productId(item) === productId(product));

  return (
    <article className="product-card">
      <button className={`wish-btn ${isLiked ? "active" : ""}`} onClick={() => toggleWishlist(product)} aria-label="הוסף למועדפים">
        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
      </button>

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <div className="product-labels">
          <span>{product.brand || "DigitIL"}</span>
          <span><Star size={13} fill="currentColor" /> מומלץ</span>
        </div>

        <h3>{product.h5}</h3>
        <p>{product.type} · {product.for}</p>

        <div className="product-bottom">
          <strong>{product.price}</strong>
          <div className="card-buttons">
            <button className="quick-btn" onClick={onFastBuy || (() => addToCart(product))}>קנייה מהירה</button>
            <button className="cart-btn" onClick={() => addToCart(product)} aria-label="הוסף לעגלה"><ShoppingCart size={19} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}

function WishlistPage({ wishlist, toggleWishlist, addToCart }) {
  return (
    <main className="simple-page">
      <SectionTitle label="מועדפים" title="המוצרים ששמרת" text="כאן נשמרים המוצרים שהלקוח סימן כדי לחזור אליהם בהמשך." />

      {wishlist.length === 0 && <EmptyState title="רשימת המועדפים ריקה" text="סמן לב על מוצר כדי לראות אותו כאן." />}

      <div className="list-page">
        {wishlist.map((product) => (
          <div className="wide-item" key={productId(product)}>
            <img src={product.image} alt={product.name} />
            <div className="wide-info">
              <span>{product.brand}</span>
              <h3>{product.name}</h3>
              <p>{product.h5}</p>
              <small>{product.type} · {product.for}</small>
            </div>
            <div className="wide-actions">
              <strong>{product.price}</strong>
              <button className="primary-btn" onClick={() => addToCart(product)}>הוסף לעגלה</button>
              <button className="ghost-btn" onClick={() => toggleWishlist(product)}>הסר</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function CartPage({ cart, changeQuantity, removeFromCart, clearCart }) {
  const productsTotal = cart.reduce((sum, item) => sum + priceNumber(item.price) * item.quantity, 0);
  const deliveryPrice = productsTotal > 0 ? 0 : 0;
  const total = productsTotal + deliveryPrice;

  return (
    <main className="simple-page cart-page">
      <SectionTitle label="עגלה" title="סיכום הקנייה שלך" text="עגלה נקייה עם שינוי כמות, מחיקה וסיכום תשלום." />

      {cart.length === 0 && <EmptyState title="העגלה ריקה" text="הוסף מוצר מהקטגוריות או מהמבצעים כדי לראות אותו כאן." />}

      {cart.length > 0 && (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={productId(item)}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span>{item.brand}</span>
                  <h3>{item.name}</h3>
                  <p>{item.h5}</p>
                </div>

                <select value={item.quantity} onChange={(e) => changeQuantity(productId(item), e.target.value)}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => <option key={num}>{num}</option>)}
                </select>

                <strong>₪ {(priceNumber(item.price) * item.quantity).toLocaleString()}</strong>

                <button className="delete-btn" onClick={() => removeFromCart(productId(item))}><Trash2 size={18} /></button>
              </div>
            ))}
          </section>

          <aside className="payment-card">
            <h2>סיכום תשלום</h2>
            <PaymentRow title="מחיר פריטים" value={`₪ ${productsTotal.toLocaleString()}`} />
            <PaymentRow title="משלוח" value={deliveryPrice === 0 ? "חינם" : `₪ ${deliveryPrice}`} />
            <PaymentRow title="סה״כ" value={`₪ ${total.toLocaleString()}`} strong />
            <button className="checkout-btn"><CreditCard size={18} /> מעבר לתשלום</button>
            <button className="coupon-btn">יש לכם קופון?</button>
            <button className="clear-btn" onClick={clearCart}>נקה עגלה</button>
          </aside>
        </div>
      )}
    </main>
  );
}

function PaymentRow({ title, value, strong }) {
  return (
    <div className={`payment-row ${strong ? "strong" : ""}`}>
      <span>{title}</span>
      <b>{value}</b>
    </div>
  );
}

function LoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function loginUser(event) {
    event.preventDefault();

    const foundUser = users.find((user) => user.Mail === mail && user.password === password);

    if (foundUser) {
      setMessage("התחברת בהצלחה למערכת.");
    } else {
      setMessage("אימייל או סיסמה לא נכונים.");
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={loginUser}>
        <span className="small-title"><Zap size={16} /> אזור אישי</span>
        <h1>כניסה ל־DigitIL</h1>
        <p>התחברות דמו לפי המשתמשים שהיו בקובץ JSON המקורי.</p>

        <label>
          אימייל
          <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="example@gmail.com" />
        </label>

        <label>
          סיסמה
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="הקלד סיסמה" />
        </label>

        <div className="login-options">
          <label className="check-label"><input type="checkbox" /> זכור אותי</label>
          <a href="#">שכחתי סיסמה</a>
        </div>

        <button className="primary-btn">התחברות</button>
        {message && <div className="login-message">{message}</div>}
      </form>
    </main>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Footer({ goHome, openCategory, categories }) {
  return (
    <footer id="contact" className="footer">
      <div>
        <button className="footer-logo" onClick={goHome}>DigitIL</button>
        <p>פרויקט React פרימיום לחנות מחשבים, מבוסס על האתר המקורי שלך ומשודרג לעיצוב כחול־לבן נקי.</p>
      </div>

      <div>
        <h4>קטגוריות</h4>
        {categories.slice(0, 5).map((category) => <button key={category.key} onClick={() => openCategory(category)}>{category.name}</button>)}
      </div>

      <div>
        <h4>שירות</h4>
        <span>אחריות יבואן</span>
        <span>משלוח חינם בהזמנות נבחרות</span>
        <span>ייעוץ לבניית מפרט</span>
      </div>
    </footer>
  );
}
