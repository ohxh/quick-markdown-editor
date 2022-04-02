import Extension from "../lib/Extension";
import nameToEmoji from "gemoji/name-to-emoji.json";

export default class EmojiTrigger extends Extension {
  get name() {
    return "emoji";
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;
      const transaction = state.tr.insertText(
        nameToEmoji[attrs.markup],
        position
      );
      dispatch(transaction);
      return true;
    };
  }
}
