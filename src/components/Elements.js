export const Navbar = ["Accueil", "Produits", "Contact"];

export const Footer = ["À propos", "Contact", "CGV", "Confidentialité"];

export const SocialMedia = ["TikTok", "Instagram", "WhatsApp"];

export const Products = [
  {
    id: 1,
    name: "Box Organiseur",
    subtitle: "Rangement modulable empilable",
    price: 149,
    sizes: ["Petit", "Moyen", "Grand"],
    color: ["Blanc", "Beige", "Gris", "Sauge"],
    badge: "Bestseller",
    images: {
      "Blanc": "img/box_blanc.jpg",
      "Beige": "img/box_beige.jpg",
      "Gris":  "img/box_gris.jpg",
      "Sauge": "img/box_sauge.jpg",
    },
    features: ["Empilable", "Couvercle inclus", "Lavable", "Livraison 24–48h"],
  },
  {
    id: 2,
    name: "Box Premium",
    subtitle: "Grande capacité avec séparateurs",
    price: 229,
    sizes: ["Moyen", "Grand", "XL"],
    color: ["Blanc", "Anthracite", "Terracotta"],
    badge: "Nouveau",
    images: {
      "Blanc":      "img/premium_blanc.jpg",
      "Anthracite": "img/premium_anthracite.jpg",
      "Terracotta": "img/premium_terracotta.jpg",
    },
    features: ["Séparateurs inclus", "Anti-poussière", "Grande capacité", "Empilable"],
  },
];
