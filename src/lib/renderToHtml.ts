import createMarkdown from "./markdown/rules";
import { PluginSimple } from "markdown-it";
import markRule from "../rules/mark";
import checkboxRule from "../rules/checkboxes";
import embedsRule from "../rules/embeds";
import breakRule from "../rules/breaks";
import tablesRule from "../rules/tables";
import underlinesRule from "../rules/underlines";

const defaultRules = [
  embedsRule,
  breakRule,
  checkboxRule,
  markRule({ delim: "==", mark: "highlight" }),
  markRule({ delim: "!!", mark: "placeholder" }),
  underlinesRule,
  tablesRule,
];

export default function renderToHtml(
  markdown: string,
  rulePlugins: PluginSimple[] = defaultRules
): string {
  return createMarkdown({ plugins: rulePlugins })
    .render(markdown)
    .trim();
}
