import { makeBlockMathInputRule } from "@benrbray/prosemirror-math";
import { Selection } from "prosemirror-state";
import Node from "./Node";

const REGEX_BLOCK_MATH_DOLLARS = /^\$\$\s+$/;

export default class MathDisplay extends Node {
  get name() {
    return "math_display";
  }

  get schema() {
    return {
      group: "block math",
      content: "text*",
      atom: true,
      code: true,
      toDOM: () => [
        "math-display",
        { class: "math-node", spellcheck: "false" },
        0,
      ],
      parseDOM: [
        {
          tag: "math-display",
        },
      ],
    };
  }

  commands({ type }) {
    return () => (state, dispatch) => {
      const { $from } = state.selection;
      if (dispatch) {
        const mathNode = type.create();
        let tr = state.tr.replaceSelectionWith(mathNode);
        tr = tr.setSelection(Selection.near(tr.doc.resolve($from.pos - 1)));
        dispatch(tr);
      }
      return true;
    };
  }

  inputRules({ type }) {
    return [makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, type)];
  }

  toMarkdown(state, node) {
    state.write("$$\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("$$");
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      node: "math_display",
      block: "math_display",
      noCloseToken: "math_display",
    };
  }
}
