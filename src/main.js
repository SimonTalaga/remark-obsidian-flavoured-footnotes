export default function obsidianFlavouredFootnotes() {
  return (tree) => {
    let footnoteIndex = 1;
    const footnotes = [];
    let currentFootnote = null;
    let footnoteDepth = 0;

    function processNode(node) {
      if (node.type === 'text') {
        return processTextNode(node);
      } else {
        if (currentFootnote) {
          currentFootnote.content.push(node);
          return [];
        }
        if (node.children) {
          node.children = node.children.flatMap(processNode);
        }
        return [node];
      }
    }

    function processTextNode(node) {
      const newNodes = [];
      let lastIndex = 0;

      for (let i = 0; i < node.value.length; i++) {
        if (node.value[i] === '^' && node.value[i+1] === '[' && !currentFootnote) {
          // Début d'une nouvelle note de bas de page
          if (lastIndex < i) {
            newNodes.push({ type: 'text', value: node.value.slice(lastIndex, i) });
          }
          currentFootnote = { content: [] };
          footnoteDepth = 1;
          i++; // On saute le crochet ouvrant
          lastIndex = i + 1;
        } else if (currentFootnote) {
          if (node.value[i] === '[') {
            footnoteDepth++;
          } else if (node.value[i] === ']') {
            footnoteDepth--;
            if (footnoteDepth === 0) {
              // Fin de la note de bas de page
              if (lastIndex < i) {
                currentFootnote.content.push({ type: 'text', value: node.value.slice(lastIndex, i) });
              }
              finishFootnote();
              newNodes.push({
                type: 'footnoteReference',
                identifier: `footnote-${footnoteIndex - 1}`,
                label: String(footnoteIndex - 1)
              });
              lastIndex = i + 1;
            }
          }
        }
      }

      if (lastIndex < node.value.length) {
        if (currentFootnote) {
          currentFootnote.content.push({ type: 'text', value: node.value.slice(lastIndex) });
        } else {
          newNodes.push({ type: 'text', value: node.value.slice(lastIndex) });
        }
      }

      return newNodes;
    }

    function finishFootnote() {
      if (!currentFootnote) return;
      
      const footnoteId = `footnote-${footnoteIndex}`;
      footnotes.push({
        type: 'footnoteDefinition',
        identifier: footnoteId,
        children: [{ type: 'paragraph', children: currentFootnote.content }]
      });
      footnoteIndex++;
      currentFootnote = null;
      footnoteDepth = 0;
    }

    tree.children = tree.children.flatMap(processNode);
    
    if (currentFootnote) {
      finishFootnote();
    }
    
    tree.children.push(...footnotes);
  };
}
