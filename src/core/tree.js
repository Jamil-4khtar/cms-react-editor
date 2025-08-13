// immutable helpers over the doc tree
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

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
  const cloned = deepClone(doc);
  const target = getBlockById(cloned.root, id);
  if (!target) return doc;
  target.styles = target.styles || {};
  target.styles.inline = { ...(target.styles.inline || {}), ...stylesDelta };
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
