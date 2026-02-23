/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";

export interface RemarkDbmlOptions {
  height?: number | string;
}

function heightAttribute(height: number | string): any {
  if (typeof height === 'number') {
    return {
      type: "mdxJsxAttribute",
      name: "height",
      value: {
        type: "mdxJsxAttributeValueExpression",
        value: String(height),
        data: {
          estree: {
            type: "Program",
            body: [{ type: "ExpressionStatement", expression: { type: "Literal", value: height, raw: String(height) } }],
            sourceType: "module"
          }
        }
      }
    };
  }
  return { type: "mdxJsxAttribute", name: "height", value: height };
}

export default function remarkDbmlToComponent(options: RemarkDbmlOptions = {}) {
  const globalHeight = options.height ?? 500;

  return (tree: any) => {
    let hasDbml = false;

    visit(tree, "code", (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== "number") return;

      const lang = String(node.lang || "").toLowerCase().trim();
      if (lang !== "dbml") return;

      hasDbml = true;
      const dbml = node.value ?? "";

      const metaMatch = node.meta ? node.meta.match(/height=(\S+)/)?.[1] : undefined;
      let height: number | string = globalHeight;
      if (metaMatch !== undefined) {
        const num = Number(metaMatch);
        height = Number.isNaN(num) ? metaMatch : num;
      }

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
          heightAttribute(height),
        ],
        children: [],
      };
    });

    if (hasDbml) {
      tree.children.unshift({
        type: 'mdxjsEsm',
        value: "import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';",
        data: {
          estree: {
            type: 'Program',
            body: [
              {
                type: 'ImportDeclaration',
                specifiers: [
                  {
                    type: 'ImportDefaultSpecifier',
                    local: { type: 'Identifier', name: 'DbmlDiagram' },
                  },
                ],
                source: {
                  type: 'Literal',
                  value: '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram',
                  raw: "'@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram'",
                },
              },
            ],
            sourceType: 'module',
          },
        },
      } as any);
    }
  };
}