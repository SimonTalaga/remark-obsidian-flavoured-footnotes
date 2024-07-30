# remark-obsidian-flavoured-footnotes
A remark plugin that parses a file searching for [Obsidian](https://obsidian.md)-style footnotes markup, and then creates a footnotes section at the end of the AST.
Footnotes are created by typing `^[Footnote content]` wherever one desires, so that the writer does not break her line of thought and never has to bother about the right indexes : they are automatically computed by the plugin. 
For instance, the following Markdown paragraph :

```md
Lorem ipsum odor amet^[Von Dughâto, P. (1922). *Un Livre exceptionnel*. pp. 110-117], consectetuer adipiscing elit. Est magnis cras auctor donec netus vel mus. Elementum quisque massa risus aliquet class dictum consequat. Nostra nam finibus orci senectus orci orci^[*Ibid*. p. 137] aenean neque. Est luctus bibendum magnis fames lobortis. Justo leo pharetra lacinia et bibendum elementum eget varius.^[*Ibid*. p. 284] Rhoncus consectetur massa vehicula tellus habitasse non tempor congue. Est dignissim justo vulputate interdum elit. Vel ad viverra fermentum augue integer cubilia neque pretium.
```

... will yield the following abstract syntax tree (AST) :

```json
{
  "type": "root",
  "children": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Lorem ipsum odor amet"
        },
        {
          "type": "footnoteReference",
          "identifier": "footnote-1",
          "label": "1"
        },
        {
          "type": "text",
          "value": ", consectetuer adipiscing elit. Est magnis cras auctor donec netus vel mus. Elementum quisque massa risus aliquet class dictum consequat. Nostra nam finibus orci senectus orci orci"
        },
        {
          "type": "footnoteReference",
          "identifier": "footnote-2",
          "label": "2"
        },
        {
          "type": "text",
          "value": " aenean neque. Est luctus bibendum magnis fames lobortis. Justo leo pharetra lacinia et bibendum elementum eget varius."
        },
        {
          "type": "footnoteReference",
          "identifier": "footnote-3",
          "label": "3"
        },
        {
          "type": "text",
          "value": " Rhoncus consectetur massa vehicula tellus habitasse non tempor congue."
        }
      ],
      "position": {
        "start": {
          "line": 2,
          "column": 1,
          "offset": 2
        },
        "end": {
          "line": 2,
          "column": 489,
          "offset": 490
        }
      }
    },
    {
      "type": "footnoteDefinition",
      "identifier": "footnote-1",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "value": "Von Dughâto, P. (1922). "
            },
            {
              "type": "emphasis",
              "children": [
                {
                  "type": "text",
                  "value": "Un Livre exceptionnel",
                  "position": {
                    "start": {
                      "line": 2,
                      "column": 49,
                      "offset": 50
                    },
                    "end": {
                      "line": 2,
                      "column": 70,
                      "offset": 71
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 2,
                  "column": 48,
                  "offset": 49
                },
                "end": {
                  "line": 2,
                  "column": 71,
                  "offset": 72
                }
              }
            },
            {
              "type": "text",
              "value": ". pp. 110-117"
            }
          ]
        }
      ]
    },
    {
      "type": "footnoteDefinition",
      "identifier": "footnote-2",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "emphasis",
              "children": [
                {
                  "type": "text",
                  "value": "Ibid",
                  "position": {
                    "start": {
                      "line": 2,
                      "column": 268,
                      "offset": 269
                    },
                    "end": {
                      "line": 2,
                      "column": 272,
                      "offset": 273
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 2,
                  "column": 267,
                  "offset": 268
                },
                "end": {
                  "line": 2,
                  "column": 273,
                  "offset": 274
                }
              }
            },
            {
              "type": "text",
              "value": ". p. 137"
            }
          ]
        }
      ]
    },
    {
      "type": "footnoteDefinition",
      "identifier": "footnote-3",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "emphasis",
              "children": [
                {
                  "type": "text",
                  "value": "Ibid",
                  "position": {
                    "start": {
                      "line": 2,
                      "column": 404,
                      "offset": 405
                    },
                    "end": {
                      "line": 2,
                      "column": 408,
                      "offset": 409
                    }
                  }
                }
              ],
              "position": {
                "start": {
                  "line": 2,
                  "column": 403,
                  "offset": 404
                },
                "end": {
                  "line": 2,
                  "column": 409,
                  "offset": 410
                }
              }
            },
            {
              "type": "text",
              "value": ". p. 284"
            }
          ]
        }
      ]
    }
  ],
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 2,
      "column": 489,
      "offset": 490
    }
  }
}
```
... And, using `remark-rehype`, the following HTML :

```html
<p>Lorem ipsum odor amet<sup><a href="#user-content-fn-footnote-1" id="user-content-fnref-footnote-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>, consectetuer adipiscing elit. Est magnis cras auctor donec netus vel mus. Elementum quisque massa risus aliquet class dictum consequat. Nostra nam finibus orci senectus orci orci<sup><a href="#user-content-fn-footnote-2" id="user-content-fnref-footnote-2" data-footnote-ref="" aria-describedby="footnote-label">2</a></sup> aenean neque. Est luctus bibendum magnis fames lobortis. Justo leo pharetra lacinia et bibendum elementum eget varius.<sup><a href="#user-content-fn-footnote-3" id="user-content-fnref-footnote-3" data-footnote-ref="" aria-describedby="footnote-label">3</a></sup> Rhoncus consectetur massa vehicula tellus habitasse non tempor congue.</p>
<section data-footnotes="" class="footnotes">
   <hr class="sr-only" id="footnote-label"/>
   <ol>
      <li id="user-content-fn-footnote-1">
         <p>Von Dughâto, P. (1922). <em>Un Livre exceptionnel</em>. pp. 110-117 <a href="#user-content-fnref-footnote-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
      </li>
      <li id="user-content-fn-footnote-2">
         <p><em>Ibid</em>. p. 137 <a href="#user-content-fnref-footnote-2" data-footnote-backref="" aria-label="Back to reference 2" class="data-footnote-backref">↩</a></p>
      </li>
      <li id="user-content-fn-footnote-3">
         <p><em>Ibid</em>. p. 284 <a href="#user-content-fnref-footnote-3" data-footnote-backref="" aria-label="Back to reference 3" class="data-footnote-backref">↩</a></p>
      </li>
   </ol>
</section>
```
