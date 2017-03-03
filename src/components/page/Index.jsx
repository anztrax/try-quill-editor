import React from 'react';


export default class Index extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link href="https://cdn.quilljs.com/1.2.1/quill.snow.css" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/quill/1.2.1/quill.min.js"></script>
          <link rel="stylesheet" href="/dist/test.css" />
          <script src="/dist/Custom-Modules.js"></script>
        </head>
        <body>
          <div id="tooltip-controls">
            <button id="bold-button">Bold</button>
            <button id="italic-button">Italic</button>
            <button id="underline-button">Underline</button>
            <button id="strikethrough-button">Strikethrough</button>
            <button id="link-button">Link</button>
            <button id="blockquote-button">Blockquote</button>
            <button id="comment-button">Comment</button>
            <button id="resolve-comment-button">Resolve Comment</button>
            <button id="suggestion-button">Suggestion</button>
            <button id="simple-link-button">Simple Link</button>
            <select id="header-dropdown">
              <option value="1">Header 1</option>
              <option value="2">Header 2</option>
              <option value="3">Header 3</option>
              <option value="4">Header 4</option>
              <option value="5">Header 5</option>
              <option value="6">Header 6</option>
              <option value="normal">Normal</option>
            </select>
            <select id="text-alignment-dropdown">
              <option value={false}>Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
            <button id="ol-align-button">OL</button>
            <button id="ul-align-button">UL</button>
          </div>
          <div id="sidebar-controls">
            <button id="image-button">Image</button>
            <button id="video-button">Video</button>
            <button id="tweet-button">Tweet</button>
            <button id="divider-button">Devider</button>
          </div>

          <div className="editor-outer-container">
            <div id="editor-container">
              Tell your story...
              <a href="http://google.com">hello
              </a>
              <a href="http://anothergoogle.com">
                another google
              </a>
              <span data-commentID="100" className="comment-blot">
                tesitng gan
              </span>
            </div>

            <div id="inline-toolbar" className="inline-toolbar">
              <button id="inline-toolbar-bold-button">B</button>
              <button id="inline-toolbar-underline-button">U</button>
              <button id="inline-toolbar-italic-button">I</button>
              <button id="inline-toolbar-link-button">Link</button>
            </div>

            <div id="link-opener" className="link-opener">
              <button id="openLink-button">Open Link</button>
              <button id="editLink-button">Edit Link</button>
              <button id="removeLink-button">Remove Link</button>
            </div>
          </div>

          <div>
            Current words :
            <span id="text-counter"></span>
          </div>
          <script src="/dist/client-quill.js"></script>
        </body>
      </html>
    )
  }
}