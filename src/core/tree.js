// immutable helpers over the doc tree
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Create default blocks when missing, keep existing when matched by id.
// For simplicity, we keep a flat order under root in DOM order.
export function mergeDocWithDomSnapshot(doc, domBlocks) {
  const next = deepClone(doc);
  const byId = new Map();

  // index existing blocks by id (walk the tree)
  (function index(node) {
    if (!node) return;
    byId.set(node.id, node);
    (node.children || []).forEach(index);
  })(next.root);

  const children = [];

  for (const b of domBlocks) {
    const existing = byId.get(b.id);
    if (existing) {
      // ensure minimal shape
      existing.type = existing.type || b.type || "container";
      existing.props = existing.props || {};
      if (
        existing.type === "text" &&
        b.text != null &&
        existing.props.text == null
      ) {
        existing.props.text = b.text;
      }
      if (existing.type === "image" && b.src && !existing.props.src) {
        existing.props.src = b.src;
      }
      existing.styles = existing.styles || { inline: {} };
      children.push(existing);
    } else {
      // create a new block with defaults based on inferred type
      const created = {
        id: b.id,
        type: b.type || "container",
        props:
          b.type === "text"
            ? { text: b.text || "" }
            : b.type === "image"
            ? { src: b.src || "", alt: "" }
            : {},
        styles: { inline: {} },
        children: [],
      };
      children.push(created);
    }
  }

  // Adopt flattened DOM order under root (works well for many pages;
  // for complex nesting you can extend this to compute parent-child relationships)
  next.root.children = children;
  return next;
}

export function findParentAndIndex(node, id, parent = null) {
  if (!node) return null;
  const children = node.children || [];
  for (let i = 0; i < children.length; i++) {
    const ch = children[i];
    if (ch.id === id) return { parent: node, index: i };
    const deep = findParentAndIndex(ch, id, node);
    if (deep) return deep;
  }
  return null;
}

export function getBlockById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  const children = node.children || [];
  for (const ch of children) {
    const found = getBlockById(ch, id);
    if (found) return found;
  }
  return null;
}

export function moveSelectedUpOrDown(doc, id, direction) {
  if (!id) return doc;
  const cloned = deepClone(doc);
  const info = findParentAndIndex(cloned.root, id);
  if (!info) return doc;
  const arr = info.parent.children || [];
  const i = info.index;
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= arr.length) return doc;
  const [item] = arr.splice(i, 1);
  arr.splice(j, 0, item);
  return cloned;
}

export function patchBlockStyles(doc, id, stylesDelta) {
  const cloned = JSON.parse(JSON.stringify(doc));
  const target = (function find(n) {
    if (!n) return null;
    if (n.id === id) return n;
    for (const ch of n.children || []) {
      const res = find(ch);
      if (res) return res;
    }
    return null;
  })(cloned.root);
  if (!target) return doc;

  target.styles = target.styles || {};
  const prev = target.styles.inline || {};
  const next = { ...prev };

  for (const k in stylesDelta) {
    const v = stylesDelta[k];
    if (v === undefined || v === "") delete next[k];
    else next[k] = v;
  }

  target.styles.inline = next;
  return cloned;
}

export function patchBlockText(doc, id, text) {
  const cloned = deepClone(doc);
  const target = getBlockById(cloned.root, id);
  if (!target) return doc;
  target.props = target.props || {};
  target.props.text = text;
  return cloned;
}
