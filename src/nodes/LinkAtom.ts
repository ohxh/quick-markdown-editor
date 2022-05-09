import { InputRule } from "prosemirror-inputrules";
import { TextSelection } from "prosemirror-state";
import Node from "./Node";

export default class LinkAtom extends Node {
  get name() {
    return "link-atom";
  }

  get schema() {
    return {
      attrs: {
        style: {
          default: "",
        },
        "data-name": {
          default: undefined,
        },
      },
      inline: true,
      content: "text*",
      marks: "",
      group: "inline",
      selectable: false,
      parseDOM: [
        {
          tag: "span.emoji",
          preserveWhitespace: "full",
          getAttrs: (dom: HTMLDivElement) => ({
            "data-name": dom.dataset.name,
          }),
        },
      ],
      toDOM: (node) => {
        return ["a", { class: "link-atom" }, "text"];
      },
    };
  }

  commands({ type }) {
    return (attrs) => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const node = type.create(attrs);
      let tr = state.tr.setSelection(
        new TextSelection(
          state.doc.resolve(selection.$cursor.pos - 1),
          state.doc.resolve(selection.$cursor.pos - 0)
        )
      );
      tr = tr.deleteSelection();
      tr = tr.insert(position - 1, node);
      dispatch(tr);
      return true;
    };
  }

  toMarkdown(state, node) {
    const name = node.attrs["data-name"];
    if (name) {
      state.write(`:${name}:`);
    }
  }

  parseMarkdown() {
    return {
      node: "link-atom",
      getAttrs: (tok) => {
        return { "data-name": tok.markup.trim() };
      },
    };
  }
}
