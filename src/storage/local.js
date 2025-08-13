const KEY = (slug) => `cms:doc:${slug}`;

const defaultDoc = (slug = "/demo") => ({
  id: "page-1",
  slug,
  root: {
    id: "root",
    type: "container",
    styles: { inline: { padding: "24px", fontFamily: "system-ui, sans-serif" } },
    children: [
      {
        id: "title-1",
        type: "text",
        props: { text: "Welcome to the Visual Editor" },
        styles: { inline: { fontSize: "28px", fontWeight: "700", margin: "8px 0" } },
        children: []
      },
      {
        id: "para-1",
        type: "text",
        props: { text: "Double‑click text to edit. Select to style." },
        styles: { inline: { color: "#374151", marginBottom: "12px" } },
        children: []
      },
      {
        id: "img-1",
        type: "image",
        props: { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200", alt: "Sample" },
        styles: { inline: { width: "480px", height: "auto", borderRadius: "12px" } },
        children: []
      }
    ]
  }
});

export function loadDoc(slug) {
  try {
    const raw = localStorage.getItem(KEY(slug));
    return raw ? JSON.parse(raw) : defaultDoc(slug);
  } catch {
    return defaultDoc(slug);
  }
}

export function saveDoc(slug, doc) {
  try {
    localStorage.setItem(KEY(slug), JSON.stringify(doc));
  } catch {
    // ignore quota errors in this mock
  }
}
