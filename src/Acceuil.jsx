import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Products, Navbar } from './components/Elements';

const WHATSAPP = '212781636843';

// ── OrderPanel ───────────────────────────────────────────────────────────────
function OrderPanel({ product, color: initColor, onClose }) {
  const [qty, setQty]           = useState(1);
  const [color, setColor]       = useState(initColor);
  const [size, setSize]         = useState(product.sizes[1] || product.sizes[0]);
  const [thumbIdx, setThumbIdx] = useState(() => product.color.indexOf(initColor));
  const [form, setForm]         = useState({ nom: '', telephone: '' });
  const [locStatus, setLocStatus] = useState('idle');
  const [location, setLocation]   = useState(null);
  const [sent, setSent]           = useState(false);

  const totalPrice = product.price * qty;
  const canSubmit  = form.nom.trim() && form.telephone.trim() && locStatus === 'ok';

  const handleColorSelect = (c) => {
    setColor(c);
    setThumbIdx(product.color.indexOf(c));
  };

  const handleLocation = () => {
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      },
      () => setLocStatus('denied')
    );
  };

  const handleSubmit = () => {
    const mapLink = location
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : '';
    const msg = [
      `📦 *Nouvelle Commande — ${product.name}*`,
      ``,
      `🎨 *Couleur :* ${color}`,
      `📐 *Taille :* ${size}`,
      `🔢 *Quantité :* ${qty}`,
      `💰 *Total :* ${totalPrice} MAD`,
      ``,
      `👤 *Client :* ${form.nom}`,
      `📞 *Téléphone :* ${form.telephone}`,
      mapLink ? `📍 *Localisation :* ${mapLink}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
  };

  if (sent) {
    return (
      <div className="order-overlay" onClick={onClose}>
        <div className="order-modal" onClick={e => e.stopPropagation()}>
          <div className="order-success">
            <div className="order-success-icon">✓</div>
            <h3>Commande envoyée !</h3>
            <p>WhatsApp s'est ouvert avec votre commande. On vous répond très vite !</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-overlay" onClick={onClose}>
      <div className="order-modal" onClick={e => e.stopPropagation()}>
        <button className="order-close" onClick={onClose}>✕</button>

        {/* ── Left : image ── */}
        <div className="order-left">
          <div className="order-main-img-wrap">
            <img
              className="order-main-img"
              src={product.images[color]}
              alt={product.name}
            />
          </div>
          <div className="order-thumbs">
            {product.color.map((c, i) => (
              <button
                key={c}
                className={`order-thumb-btn ${i === thumbIdx ? 'active' : ''}`}
                onClick={() => handleColorSelect(c)}
              >
                <img src={product.images[c]} alt={c} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right : form ── */}
        <div className="order-right">
          {product.badge && <span className="order-badge">{product.badge}</span>}
          <h2 className="order-title">{product.name}</h2>
          <p className="order-modal-price">{totalPrice} <span>MAD</span></p>

          <p className="order-section-label">Couleur — {color}</p>
          <div className="order-color-row">
            {product.color.map(c => (
              <button
                key={c}
                className={`order-color-tag ${color === c ? 'active' : ''}`}
                onClick={() => handleColorSelect(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="order-section-label">Taille</p>
          <div className="order-size-row">
            {product.sizes.map(s => (
              <button
                key={s}
                className={`order-size-btn ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="order-features">
            {product.features.map(f => (
              <span key={f}>✓ {f}</span>
            ))}
          </div>

          <div className="order-qty-row">
            <p className="order-section-label" style={{ margin: 0 }}>Quantité</p>
            <div className="qty-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <p className="order-total">{totalPrice} MAD</p>
          </div>

          <div className="order-form">
            <input
              placeholder="Nom complet"
              value={form.nom}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            />
            <input
              placeholder="Numéro de téléphone"
              type="tel"
              value={form.telephone}
              onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
            />
          </div>

          <button
            className={`loc-btn${locStatus === 'ok' ? ' loc-ok' : ''}${locStatus === 'denied' ? ' loc-denied' : ''}${locStatus === 'loading' ? ' loc-loading' : ''}`}
            onClick={handleLocation}
            disabled={locStatus === 'loading' || locStatus === 'ok'}
          >
            {locStatus === 'idle'    && '📍 Partager ma localisation (obligatoire)'}
            {locStatus === 'loading' && '⏳ Localisation en cours…'}
            {locStatus === 'ok'      && '✓ Localisation partagée'}
            {locStatus === 'denied'  && '⚠ Accès refusé — réessayer'}
          </button>

          <button
            className="order-submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Commander via WhatsApp — {totalPrice} MAD
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const [frameIdx, setFrameIdx]   = useState(0);
  const [prevIdx, setPrevIdx]     = useState(null);
  const [animating, setAnimating] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const timerRef     = useRef(null);
  const animTimerRef = useRef(null);
  const stateRef     = useRef({ frameIdx: 0, len: 0 });

  const frames = product.color.map(c => ({ color: c, src: product.images[c] }));
  stateRef.current = { frameIdx, len: frames.length };

  const slide = useCallback((newIdx) => {
    const cur = stateRef.current.frameIdx;
    if (newIdx === cur) return;
    setPrevIdx(cur);
    setFrameIdx(newIdx);
    setAnimating(true);
    clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setPrevIdx(null);
      setAnimating(false);
    }, 550);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const { frameIdx: cur, len } = stateRef.current;
      slide((cur + 1) % len);
    }, 3000);
  }, [slide]);

  useEffect(() => {
    resetTimer();
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(animTimerRef.current);
    };
  }, [resetTimer]);

  const goPrev = useCallback((e) => {
    e.stopPropagation();
    const { frameIdx: c, len } = stateRef.current;
    slide((c - 1 + len) % len);
    resetTimer();
  }, [slide, resetTimer]);

  const goNext = useCallback((e) => {
    e.stopPropagation();
    const { frameIdx: c, len } = stateRef.current;
    slide((c + 1) % len);
    resetTimer();
  }, [slide, resetTimer]);

  const currentFrame = frames[frameIdx];
  const prevFrame    = prevIdx !== null ? frames[prevIdx] : null;

  return (
    <>
      <div className="product-card" onClick={() => setOrderOpen(true)}>

        {/* ── Carousel ── */}
        <div className="carousel-wrap">
          {animating && prevFrame && (
            <img
              src={prevFrame.src}
              alt=""
              className="carousel-slide carousel-slide-out"
            />
          )}
          <img
            src={currentFrame.src}
            alt={product.name}
            className={`carousel-slide${animating ? ' carousel-slide-in' : ''}`}
          />
          <button className="carousel-arrow carousel-prev" onClick={goPrev}>‹</button>
          <button className="carousel-arrow carousel-next" onClick={goNext}>›</button>

          <div className="carousel-frame-count">
            {frames.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === frameIdx ? ' active' : ''}`}
                onClick={e => { e.stopPropagation(); slide(i); resetTimer(); }}
              />
            ))}
          </div>
        </div>

        {/* ── Overlay info ── */}
        <div className="product-info">
          <div className="product-colors">
            {frames.map((f, i) => (
              <button
                key={f.color}
                className={`color-tag${i === frameIdx ? ' selected' : ''}`}
                onClick={e => { e.stopPropagation(); slide(i); resetTimer(); }}
              >
                {f.color}
              </button>
            ))}
          </div>
          <div className="product-footer">
            <div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-sub">{product.subtitle}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="product-price">{product.price} MAD</p>
              <p className="product-cta">Commander →</p>
            </div>
          </div>
        </div>
      </div>

      {orderOpen && (
        <OrderPanel
          product={product}
          color={currentFrame.color}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function Acceuil() {
  return (
    <>
      <div className="brand">
        <h1>RANGEO</h1>
        <span className="brand-tagline">Organisez votre espace</span>
      </div>

      <header>
        <nav>
          {Navbar.map(item => (
            <a key={item} href="/">{item}</a>
          ))}
        </nav>
      </header>

      <main>
        <div className="products-grid">
          {Products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>

      <footer className="site-footer">
        <p>© 2025 Rangeo · Livraison partout au Maroc · Paiement à la livraison</p>
      </footer>
    </>
  );
}
