import { EditorState } from "prosemirror-state";

export default function isInBlockQuote(state: EditorState): boolean {
  if (state.schema.nodes.blockquote) {
    const $head = state.selection.$head;
    for (let d = $head.depth; d > 0; d--) {
      if ($head.node(d).type === state.schema.nodes.blockquote) {
        return true;
      }
    }
  }
  return false;
}
