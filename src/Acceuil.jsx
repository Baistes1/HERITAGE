
import { useState, useEffect, useRef } from 'react';
import './index.css';
import { Navbar } from './components/Elements';
import { Products } from './components/Elements';



const COUNTRIES = [
  { label: 'Maroc',           flag: '🇲🇦', dial: '+212' },
  { label: 'France',          flag: '🇫🇷', dial: '+33'  },
  { label: 'Espagne',         flag: '🇪🇸', dial: '+34'  },
  { label: 'USA',             flag: '🇺🇸', dial: '+1'   },
  { label: 'Algérie',         flag: '🇩🇿', dial: '+213' },
  { label: 'Tunisie',         flag: '🇹🇳', dial: '+216' },
  { label: 'Palestine',       flag: '🇵🇸', dial: '+970' },
  { label: 'Sénégal',         flag: '🇸🇳', dial: '+221' },
  { label: 'Égypte',          flag: '🇪🇬', dial: '+20'  },
  { label: 'Arabie Saoudite', flag: '🇸🇦', dial: '+966' },
  { label: "Côte d'Ivoire",   flag: '🇨🇮', dial: '+225' },
  { label: 'Angleterre',      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', dial: '+44'  },
  { label: 'Belgique',        flag: '🇧🇪', dial: '+32'  },
  { label: 'Canada',          flag: '🇨🇦', dial: '+1'   },
  { label: 'Allemagne',       flag: '🇩🇪', dial: '+49'  },
  { label: 'Italie',          flag: '🇮🇹', dial: '+39'  },
  { label: 'Pays-Bas',        flag: '🇳🇱', dial: '+31'  },
  { label: 'Portugal',        flag: '🇵🇹', dial: '+351' },
  { label: 'Mauritanie',      flag: '🇲🇷', dial: '+222' },
  { label: 'Mali',            flag: '🇲🇱', dial: '+223' },
];

const TEXT_SUGGESTIONS = {
  'Maroc':           ['CASA', 'MAROC', '212', 'RBAT', 'TANGER', 'CASABLANCA'],
  'France':          ['PARIS', 'FRANCE', '75', 'LYON', 'MARSEILLE', 'HEXAGONE'],
  'Algérie':         ['ALGER', 'ALGÉRIE', '213', 'ORAN', 'DZ', 'CONSTANTINE'],
  'Tunisie':         ['TUNIS', 'TUNISIE', '216', 'SFAX', 'SOUSSE'],
  'USA':             ['NEW YORK', 'LA', 'NYC', 'CHICAGO', 'USA', '001'],
  'Espagne':         ['MADRID', 'BARCELONA', 'ESPAÑA', 'SEVILLA'],
  'Palestine':       ['GAZA', 'JERUSALEM', 'FALASTIN', 'FREE'],
  'Sénégal':         ['DAKAR', 'SÉNÉGAL', '221', 'TERANGA'],
  'Égypte':          ['CAIRO', 'EGYPT', '20', 'ALEX', 'MISR'],
  'Arabie Saoudite': ['RIYADH', 'KSA', 'MECCA', '966'],
  "Côte d'Ivoire":   ['ABIDJAN', 'CIV', '225', 'CÔTE'],
  'Angleterre':      ['LONDON', 'ENGLAND', 'LONDON', 'BRUM'],
};

function CustomizerPanel({ product, sexe, onClose, onValidate }) {
  const [step, setStep]           = useState(1);
  const [country, setCountry]     = useState(null);
  const [text, setText]           = useState('');
  const [customText, setCustom]   = useState('');
  const [search, setSearch]       = useState('');
  const [open, setOpen]           = useState(false);

  const filtered    = COUNTRIES.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase())
  );
  const suggestions = country ? (TEXT_SUGGESTIONS[country.label] || []) : [];

  return (
    <div className="cust-overlay" onClick={onClose}>
      <div className="cust-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-close" onClick={onClose}>✕</button>

        {/* ── Questionnaire ── */}
        <div className="cust-options">

          {/* Barre de progression */}
          <div className="cust-steps">
            <div className={`cust-step ${step >= 1 ? 'done' : ''}`}>
              <span>1</span> Pays
            </div>
            <div className="cust-step-line" />
            <div className={`cust-step ${step >= 2 ? 'done' : ''}`}>
              <span>2</span> Texte
            </div>
          </div>

          {/* ── Étape 1 : Pays ── */}
          {step === 1 && (
            <>
              <h3 className="cust-question">Quel est votre pays ?</h3>

              {/* Custom select */}
              <div className="country-select-wrap">
                <button
                  type="button"
                  className={`country-select-trigger ${open ? 'open' : ''}`}
                  onClick={() => setOpen(!open)}
                >
                  {country ? (
                    <>
                      <span className="cs-flag">{country.flag}</span>
                      <span className="cs-dial">{country.dial}</span>
                      <span className="cs-name">{country.label}</span>
                    </>
                  ) : (
                    <span className="cs-placeholder">Sélectionner un pays...</span>
                  )}
                  <span className="cs-arrow">{open ? '▲' : '▼'}</span>
                </button>

                {open && (
                  <div className="country-dropdown">
                    <div className="cs-search-wrap">
                      <input
                        className="cs-search"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="cs-list">
                      {filtered.map((c) => (
                        <li
                          key={c.label}
                          className={`cs-option ${country?.label === c.label ? 'active' : ''}`}
                          onClick={() => { setCountry(c); setOpen(false); setSearch(''); }}
                        >
                          <span className="cs-flag">{c.flag}</span>
                          <span className="cs-dial">{c.dial}</span>
                          <span className="cs-name">{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                className="cust-confirm"
                disabled={!country}
                onClick={() => setStep(2)}
              >
                Suivant →
              </button>
            </>
          )}

          {/* ── Étape 2 : Texte ── */}
          {step === 2 && (
            <>
              <h3 className="cust-question">
                Quel texte souhaitez-vous floquer ?
              </h3>
              <p className="cust-sub">Suggestions pour {country.flag} {country.label}</p>
              <div className="cust-suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className={`cust-suggestion-btn ${text === s ? 'active' : ''}`}
                    onClick={() => { setText(s); setCustom(''); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="cust-sub" style={{ marginTop: 8 }}>Ou écrivez le vôtre</p>
              <input
                className="cust-input"
                placeholder="Votre texte..."
                value={customText}
                maxLength={20}
                onChange={(e) => { setCustom(e.target.value); setText(''); }}
              />
              <div className="cust-nav">
                <button className="cust-back" onClick={() => setStep(1)}>← Retour</button>
                <button
                  className="cust-confirm"
                  disabled={!text && !customText}
                  onClick={() => { onValidate({ country, text: text || customText }); onClose(); }}
                >
                  Valider →
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function OrderPanel({ product, sexe: initSexe, color: initColor, onClose }) {
  const [qty, setQty]               = useState(1);
  const [selectedColor, setColor]   = useState(initColor);
  const [sexe, setSexe]             = useState(initSexe);
  const [form, setForm]             = useState({ nom: '', telephone: '' });
  const [location, setLocation]     = useState(null);
  const [locStatus, setLocStatus]   = useState('idle');
  const [sent, setSent]             = useState(false);
  const [customizerOpen, setCustOpen]     = useState(false);
  const [customizations, setCustomizations] = useState({});
  const [editingItem, setEditingItem]     = useState(null);
  const [previewItem, setPreviewItem]     = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const mainImage       = product.images[sexe][selectedColor];
  const customizedCount = Object.keys(customizations).length;
  const totalPrice      = product.price * qty + customizedCount * 20;

  const WHATSAPP_NUMBER = '212781636843'; // ← remplace par ton numéro

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocStatus('denied'); return; }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      },
      () => setLocStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mapsLink = location
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : '_(localisation non partagée)_';

    const message = [
      `🛍️ *Nouvelle commande — Heritage*`,
      ``,
      `*Produit :* ${product.name}`,
      `*Couleur :* ${selectedColor}`,
      `*Genre :* ${sexe === 'homme' ? 'Homme' : 'Femme'}`,
      `*Quantité :* ${qty}`,
      ...(customizedCount > 0 ? [
        ``,
        `*Personnalisations (${customizedCount} article(s)) :*`,
        ...Object.entries(customizations).map(([idx, c]) =>
          `  • Article ${Number(idx) + 1} : ${c.country.flag} ${c.country.label} — "${c.text}"`
        ),
        `*Flocage :* +${customizedCount * 20} MAD`,
      ] : []),
      `*Total :* ${totalPrice} MAD`,
      ``,
      `*Client :* ${form.nom}`,
      `*Téléphone :* ${form.telephone}`,
      `*Localisation :* ${mapsLink}`,
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setSent(true);
  };

  return (
    <>
    {customizerOpen && editingItem !== null && (
      <CustomizerPanel
        product={product}
        sexe={sexe}
        onClose={() => { setCustOpen(false); setEditingItem(null); }}
        onValidate={(data) => {
          setCustomizations(prev => ({ ...prev, [editingItem]: data }));
          setCustOpen(false);
          setEditingItem(null);
        }}
      />
    )}
    {previewItem !== null && customizations[previewItem] && (
      <div className="prev-overlay" onClick={() => setPreviewItem(null)}>
        <div className="prev-modal" onClick={(e) => e.stopPropagation()}>
          <button className="order-close" onClick={() => setPreviewItem(null)}>✕</button>
          <img src={mainImage} alt="aperçu" className="prev-img"
            onError={(e) => { e.target.src = 'https://placehold.co/360x420/e8dfd3/1a1111?text=Heritage'; }}
          />
          <div className="prev-info">
            <div className="prev-flag">{customizations[previewItem].country.flag}</div>
            <p className="prev-country">{customizations[previewItem].country.label}</p>
            <p className="prev-flock">"{customizations[previewItem].text}"</p>
            <p className="prev-note">Texte flocké sur le maillot</p>
          </div>
        </div>
      </div>
    )}
    {removeConfirm !== null && customizations[removeConfirm] && (
      <div className="confirm-overlay" onClick={() => setRemoveConfirm(null)}>
        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
          <p className="confirm-title">Supprimer la personnalisation ?</p>
          <p className="confirm-sub">
            Article {removeConfirm + 1} — {customizations[removeConfirm].country.flag} {customizations[removeConfirm].country.label}, "{customizations[removeConfirm].text}"
          </p>
          <div className="confirm-actions">
            <button className="confirm-cancel" onClick={() => setRemoveConfirm(null)}>Annuler</button>
            <button className="confirm-delete" onClick={() => {
              setCustomizations(prev => {
                const next = { ...prev };
                delete next[removeConfirm];
                return next;
              });
              setRemoveConfirm(null);
            }}>Supprimer</button>
          </div>
        </div>
      </div>
    )}
    <div className="order-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-close" onClick={onClose}>✕</button>

        {sent ? (
          <div className="order-success">
            <span className="order-success-icon">✓</span>
            <h3>Commande envoyée !</h3>
            <p>WhatsApp s'est ouvert avec votre commande. On vous répond très vite !</p>
          </div>
        ) : (
          <>
            {/* Colonne gauche — image */}
            <div className="order-left">
              <div className="order-main-img-wrap">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="order-main-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x460/e8dfd3/1a1111?text=Heritage'; }}
                />
              </div>
              <div className="order-thumbs">
                {product.color.map((c) => (
                  <button
                    key={c}
                    className={`order-thumb-btn ${selectedColor === c ? 'active' : ''}`}
                    onClick={() => setColor(c)}
                  >
                    <img
                      src={product.images[sexe][c]}
                      alt={c}
                      onError={(e) => { e.target.src = 'https://placehold.co/72x72/e8dfd3/1a1111?text=+'; }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Colonne droite — infos + formulaire */}
            <div className="order-right">
              <span className="order-badge">Collection Heritage</span>
              <h2 className="order-title">{product.name}</h2>
              <p className="order-modal-price">{totalPrice} <span>MAD</span></p>

              <div className="order-sexe-toggle">
                <button className={sexe === 'homme' ? 'active' : ''} onClick={() => setSexe('homme')}>Homme</button>
                <button className={sexe === 'femme' ? 'active' : ''} onClick={() => setSexe('femme')}>Femme</button>
              </div>

              {/* ── Personnalisation par article ── */}
              <div className="items-cust-section">
                <p className="order-section-label">Personnalisation</p>
                {Array.from({ length: qty }, (_, i) => {
                  const cust = customizations[i];
                  return (
                    <div key={i} className="item-cust-row">
                      <span className="item-cust-num">Art. {i + 1}</span>
                      {cust ? (
                        <div className="item-cust-badge">
                          <span className="item-cust-flag">{cust.country.flag}</span>
                          <span className="item-cust-text">"{cust.text}"</span>
                          <span className="item-cust-plus">+20</span>
                          <button className="item-cust-btn" onClick={() => setPreviewItem(i)}>Aperçu</button>
                          <button className="item-cust-btn" onClick={() => { setEditingItem(i); setCustOpen(true); }}>Modifier</button>
                          <button className="item-cust-remove" onClick={() => setRemoveConfirm(i)}>✕</button>
                        </div>
                      ) : (
                        <button
                          className="item-cust-add"
                          onClick={() => { setEditingItem(i); setCustOpen(true); }}
                        >+ Personnaliser</button>
                      )}
                    </div>
                  );
                })}
              </div>



              <p className="order-section-label">Couleur — <strong>{selectedColor}</strong></p>
              <div className="order-color-row">
                {product.color.map((c) => (
                  <button
                    key={c}
                    className={`order-color-tag ${selectedColor === c ? 'active' : ''}`}
                    onClick={() => setColor(c)}
                  >{c}</button>
                ))}
              </div>

              <div className="order-features">
                <span> Livraison rapide</span>
                <span> Qualité premium</span>
                <span> Paiement à la livraison</span>
                <span>↩ Retour facile</span>
              </div>

              <div className="order-qty-row">
                <span className="order-section-label">Quantité</span>
                <div className="qty-controls">
                  <button onClick={() => {
                    setQty(q => {
                      if (q <= 1) return q;
                      setCustomizations(prev => {
                        const next = { ...prev };
                        delete next[q - 1];
                        return next;
                      });
                      return q - 1;
                    });
                  }}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <span className="order-total">Total : {totalPrice} MAD</span>
              </div>

              <form className="order-form" onSubmit={handleSubmit}>
                <input name="nom"       placeholder="Nom complet" value={form.nom}       onChange={handleChange} required />
                <input name="telephone" placeholder="Téléphone"   value={form.telephone} onChange={handleChange} type="tel" required />

                <button type="button" className={`loc-btn loc-${locStatus}`} onClick={handleGetLocation}>
                  {locStatus === 'idle'    && ' Partager ma localisation'}
                  {locStatus === 'loading' && ' Récupération...'}
                  {locStatus === 'ok'      && ' Localisation obtenue'}
                  {/* {locStatus === 'denied'  && ' Accès refusé — réessayer'} */}
                </button>

                <button type="submit" className="order-submit" disabled={locStatus !== 'ok'}>
                  Commander via WhatsApp — {totalPrice} MAD
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

function ProductCard({ product }) {
  const [frameIdx, setFrameIdx]   = useState(0);
  const [prevIdx, setPrevIdx]     = useState(null);
  const [animating, setAnimating] = useState(false);
  const [sexe, setSexe]           = useState('homme');
  const [orderOpen, setOrderOpen] = useState(false);
  const timerRef                  = useRef(null);
  const animTimerRef              = useRef(null);
  const stateRef                  = useRef({ frameIdx: 0, len: 0 });

  const frames        = product.color.map(c => ({ color: c, src: product.images[sexe][c] }));
  const selectedColor = frames[frameIdx].color;
  stateRef.current    = { frameIdx, len: frames.length };

  const slide = (newIdx) => {
    const cur = stateRef.current.frameIdx;
    if (newIdx === cur) return;
    setPrevIdx(cur);
    setFrameIdx(newIdx);
    setAnimating(true);
    clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 600);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const { frameIdx: cur, len } = stateRef.current;
      slide((cur + 1) % len);
    }, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => { clearInterval(timerRef.current); clearTimeout(animTimerRef.current); };
  }, [frames.length]);

  useEffect(() => { setPrevIdx(null); setAnimating(false); }, [sexe]);

  const prev = (e) => { e.stopPropagation(); const { frameIdx: c, len } = stateRef.current; slide((c - 1 + len) % len); resetTimer(); };
  const next = (e) => { e.stopPropagation(); const { frameIdx: c, len } = stateRef.current; slide((c + 1) % len); resetTimer(); };

  return (
    <>
      <div className="product-card" onClick={() => setOrderOpen(true)}>

        {/* ── Carousel ── */}
        <div className="carousel-wrap">
          {animating && prevIdx !== null && frames[prevIdx] && (
            <img
              src={frames[prevIdx].src}
              alt=""
              className="carousel-slide carousel-slide-out"
              onError={(e) => { e.target.src = `https://placehold.co/700x500/1a1111/D4AF37?text=${sexe}`; }}
            />
          )}
          <img
            src={frames[frameIdx].src}
            alt={`${product.name} - ${sexe} - ${selectedColor}`}
            className={`carousel-slide${animating ? ' carousel-slide-in' : ''}`}
            onError={(e) => { e.target.src = `https://placehold.co/700x500/1a1111/D4AF37?text=${sexe}`; }}
          />
        </div>

        {/* Flèches */}
        <button className="carousel-arrow carousel-prev" onClick={prev}>‹</button>
        <button className="carousel-arrow carousel-next" onClick={next}>›</button>

        {/* Frame counter — style Notion */}
        <div className="carousel-frame-count">
          {frames.map((_, i) => (
            <span
              key={i}
              className={`carousel-dot ${i === frameIdx ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); slide(i); resetTimer(); }}
            />
          ))}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="sexe-toggle">
            <button className={`sexe-btn ${sexe === 'homme' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSexe('homme'); }}>Homme</button>
            <button className={`sexe-btn ${sexe === 'femme' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSexe('femme'); }}>Femme</button>
          </div>

          <div className="product-colors">
            {product.color.map((c, i) => (
              <span key={i}
                className={`color-tag ${selectedColor === c ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); slide(i); }}>
                {c}
              </span>
            ))}
          </div>

          <div className="product-footer">
            <span className="product-price">{product.price} MAD</span>
            <span className="product-cta">Commander →</span>
          </div>
        </div>
      </div>

      {orderOpen && (
        <OrderPanel
          product={product}
          sexe={sexe}
          color={selectedColor}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <div className="brand">
        <h1 className="brand-name">HERITAGE</h1>
        <span className="brand-tagline">Collection Exclusive</span>
      </div>
      <header className="App-header">
        <nav>
          {Navbar.map((item, index) => (
            <a key={index} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <div className="products-grid">
          {Products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
