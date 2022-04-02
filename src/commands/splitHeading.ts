import { EditorState, TextSelection } from "prosemirror-state";
import { findBlockNodes } from "prosemirror-utils";
import { NodeType } from "prosemirror-model";

export default function splitHeading(type: NodeType) {
  return (state: EditorState, dispatch): boolean => {
    const { $from, from, $to, to } = state.selection;

    // check we're in a matching heading node
    if ($from.parent.type !== type) return false;

    // check that the caret is at the end of the content, if it isn't then
    // standard node splitting behaviour applies
    const endPos = $to.after() - 1;
    if (endPos !== to) return false;

    return false;
  };
}
