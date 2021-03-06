import {
  chainCommands,
  deleteSelection,
  selectNodeBackward,
  joinBackward,
} from "prosemirror-commands";
import {
  mathPlugin,
  mathBackspaceCmd,
  insertMathCmd,
  makeInlineMathInputRule,
  REGEX_INLINE_MATH_DOLLARS,
} from "@benrbray/prosemirror-math";
import Node from "./Node";
import mathRulePlugin from "../lib/markdown/math";
import "katex/dist/katex.min.css";
import "@benrbray/prosemirror-math/style/math.css";

export default class Math extends Node {
  get name() {
    return "math_inline";
  }

  get schema() {
    return {
      group: "inline math",
      content: "text*",
      inline: true,
      atom: true,
      toDOM: () => [
        "math-inline",
        { class: "math-node", spellcheck: "false" },
        0,
      ],
      parseDOM: [
        {
          tag: "math-inline",
        },
      ],
    };
  }

  commands({ type }) {
    return () => insertMathCmd(type);
  }

  inputRules({ schema }) {
    return [
      makeInlineMathInputRule(
        REGEX_INLINE_MATH_DOLLARS,
        schema.nodes.math_inline
      ),
    ];
  }

  keys({ type }) {
    return {
      "Mod-Space": insertMathCmd(type),
      Backspace: chainCommands(
        deleteSelection,
        mathBackspaceCmd,
        joinBackward,
        selectNodeBackward
      ),
    };
  }

  get plugins() {
    return [mathPlugin];
  }

  get rulePlugins() {
    return [mathRulePlugin];
  }

  toMarkdown(state, node) {
    state.write("$");
    console.warn({ state, node, text: node.content.content[0].text });
    state.write(node.content.content[0].text);
    state.write("$");
  }

  parseMarkdown() {
    return {
      node: "math_inline",
      block: "math_inline",
      noCloseToken: "math_inline",
    };
  }
}
