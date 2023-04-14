import React, { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { Preview } from "./preview";

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

{
  /* <div class="main">
      <div class="menu">
        <span style="line-height: 32px; margin-right: auto;">
          簡歷名稱：
          <input
            id="resume_name"
            style="
              height: 24px;
              width: 155px;
              padding: 0 8px;
              margin-right: 24px;
            "
            type="text"
          />
        </span>
        <button onclick="print()" class="button">
          打印
          <!-- <span class="text">
            if you want to print this resume, you need unenable headers and
            footers then enable background graphics.
          </span> -->
        </button>
        <button onclick="saveResume()" class="button">保存</button>
        <button onclick="publishResume()" class="button" id="publish_button">發布</button>
        <button onclick="openPublicURL()" style="display: none;" class="button" id="open_url_button">獲取發布連結</button>
        <button onclick="createPicker()" class="button">打開現有簡歷</button>
        <button onclick="createNewDialog()" class="button">創建新簡歷</button>
        <button
          id="signout_button"
          class="button"
          onclick="handleSignoutClick()"
        >
          登出
        </button>
      </div>
      <div class="content">
        <div class="text-board">
          <textarea id="text"></textarea>
        </div>
        <div class="text-preview" id="preview">
          <div class="row row--section">
            <div class="column column--1-1" id="content"></div>
          </div>
        </div>
      </div>
    </div> */
}

const initStr = `->![aa3733d8f8f411ebb81cb27ada609f87.jpg](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIuV62_Mtky1qWoIxBXiUsIfwTAMD4a2FUUg&usqp=CAU)
# **Kate Miller**
An engineering manager building and leading engineering teams at Apple Inc

## Work Experience

### Apple Inc
->_Copenhagen_

**Engineering Manager**
->_Jan 2019 to Present_

- Increased engineering staff's operating efficiency by providing structure, operating procedures, engineering tools, guidelines, and handbooks.
- Contributed to company-wide engineering initiatives
- Supported the engineering and product teams to achieve a high level of technical quality, reliability, and ease-of-use.

**Backend Engineer, Financial Data**
->_April 2018 to December 2018_

- Built large-scale (petabyte-size) financial data platform/solution/pipelines using Big Data technologies
- Worked cross-functionally with many teams: Engineering, Treasury, Finance, Accounting, etc.
- Worked on systems critical to future operation, with impact over billions of dollars of payments volume.
- Developed a deep understanding of modern payments and financial technology across many countries.

### Stripe
->_San Francisco, CA_

**Full Stack Engineer**
-> _September 2016 to March 2018_

- Responsible for developing, maintaining internal web applications
- Collaborated with technical and business staff in design, development, testing and implementation
- Set up, managed and monitored systems to ensure business continuity

### Bloomberg
->_New York, NY_

**Software Engineer Intern**
->_June 2016 to August 2016_

- Worked on Bloomberg's platform to enhance the user experience
- Proactively participated in the team's weekly meetings and conducted reports on the project's progress


## Education

### Carnegie Mellon University
->_2014-2016_
**Masters of Computer Science**, _Pittsburgh, Pennsylvania_

### The State University of NY
->_2010 - 2014_
**Bachelor of Engineering**,  _Oswego, New York_

`;

console.log(marked);

const Editor: React.FC = () => {
  const [value, setValue] = useState(initStr || "");

  const html = useMemo(() => {
    return marked.parse(value);
  }, [value]);

  return (
    <div className="flex h-full w-full">
      <div className="h-full w-1/2">
        <textarea
          className="h-full w-full p-4 shadow-md outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
      </div>
      {/* <div className="text-preview" id="preview">
        <div className="row row--section">
          <div className="column column--1-1" id="content"></div>
        </div>
      </div> */}
      <Preview>
        <div
          className="column column--1-1"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        ></div>
      </Preview>
    </div>
  );
};

export { Editor };
