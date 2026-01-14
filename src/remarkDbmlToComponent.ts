/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";

export default function remarkDbmlToComponent() {
  return (tree: any) => {
    
    visit(tree, "code", (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== "number") return;

      const lang = String(node.lang || "").toLowerCase().trim();
      if (lang !== "dbml") return;

      const dbml = node.value ?? "";

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "DbmlDiagram",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "dbml",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: `\`${dbml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\``,
              data: {
                estree: {
                  type: "Program",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "TemplateLiteral",
                        expressions: [],
                        quasis: [
                          {
                            type: "TemplateElement",
                            value: {
                              raw: dbml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$'),
                              cooked: dbml
                            },
                            tail: true
                          }
                        ]
                      }
                    }
                  ],
                  sourceType: "module"
                }
              }
            },
          },
        ],
        children: [],
      };
    });
  };
}