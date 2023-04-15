import React, { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Preview } from "./preview";
import { useResume } from "~/hook/useResume";

const description: marked.TokenizerAndRendererExtension = {
  name: "description",
  level: "block", // Is this a block-level or inline-level tokenizer?
  start(src) {
    return src.match(/->[^->\n]/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^->\s*(.*)(\n|$)/; // Regex for the complete token
    const match = rule.exec(src);

    if (match) {
      return {
        // Token to generate
        type: "description", // Should match "name" above
        raw: match[0], // Text to consume from the source
        dt: this.lexer.inlineTokens(match?.[1]?.trim() || ""),
        // dt: this.lexer.inlineTokens(match[1].trim()), // Additional custom properties, including
        // dd: this.lexer.inlineTokens(match[2].trim()), //   any further-nested inline tokens
      };
    }
    // return false
  },
  renderer(token) {
    return `<p class="pull-right">${this.parser.parseInline(token.dt)}</p>`;
  },
};

marked.use({
  extensions: [description],
});

const initStr = `
# John Doe

## Summary

Experienced software developer with expertise in full-stack web development and a passion for creating elegant solutions to complex problems.

## Skills

- Languages: JavaScript, Python, Java, Ruby
- Front-end: React, Vue.js, jQuery, HTML5/CSS3
- Back-end: Node.js, Django, Flask, Spring
- Databases: MySQL, MongoDB, PostgreSQL, Redis
- Tools: Git, JIRA, Agile, Scrum

## Professional Experience

### Software Developer, Acme Inc.

->_2019 - present_

- Developed and maintained web applications using React and Node.js
- Led a team of developers in building a new platform from scratch
- Improved application performance and user experience through optimization and refactoring
- Utilized Agile methodology and JIRA for project management

### Web Developer, XYZ Corp.

->_2017 - 2019_

- Built and maintained e-commerce websites using Vue.js and Django
- Developed custom themes and plugins for WordPress sites
- Optimized websites for speed and search engine rankings
- Managed multiple projects simultaneously using Scrum methodology

## Education

### Bachelor of Science in Computer Science

University of California, Los Angeles

->_2013 - 2017dwdw_

`;
const Editor: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ ...props }) => {
  const { content, dispatch } = useResume();

  /* @refresh reset */
  const html = useMemo(() => {
    return marked.parse(content);
  }, [content]);

  return (
    <div {...props}>
      <div className="h-full w-1/2">
        <textarea
          className="h-full w-full p-4 text-sm shadow-md outline-none"
          value={content}
          onChange={(e) =>
            dispatch({ type: "SET_CONTENT", payload: e.target.value })
          }
        ></textarea>
      </div>

      <Preview>
        <div
          className="text-preview"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        >
          {/* <div className="row row--section">
            <div
              className="column column--1-1"
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            ></div> */}
          {/* <div></div> */}
        </div>
      </Preview>
    </div>
  );
};

export { Editor };
