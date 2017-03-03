var Parchment = Quill.import('parchment');


//utils
function toggleInlineUtils(quill, range, blotName, blotValue){
  const currentFormats = quill.getFormat(range);
  const isContainBlot = currentFormats[blotName] || false;
  let finalBlotValue = (typeof blotValue !== 'undefined') ? blotValue : !isContainBlot;
  quill.format(blotName,finalBlotValue);
}


/**
 * Counter
 */
class Counter{
  constructor(quill, options){
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container);
    quill.on('text-change',this.update.bind(this));
    this.update();
  }

  calculate(){
    let text = this.quill.getText();
    if(this.options.unit === 'word'){
      text = text.trim();
      // Splitting empty text returns a non-empty array
      return text.length > 0 ? text.split(/\s+/).length : 0;
    }else{
      return text.length;
    }
  }

  update(){
    var length = this.calculate();
    var label = this.options.unit;
    if(label !== 1){
      label += 's';
    }
    this.container.innerHTML = length + ' ' + label;
  }
}

/**
 * Inline Toolbar
 */
class InlineToolbarHover{
  constructor(quill, options){
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector('#inline-toolbar');

    this.initInlineToolbar.bind(this)();
    this.quill.on('selection-change',this.update.bind(this));
    this.quill.on('text-change',this.updateTextChange.bind(this));
  }

  initInlineToolbar(){
    const quill = this.quill;
    this.boldButton = this.container.querySelector('#inline-toolbar-bold-button');
    this.underlineButton =  this.container.querySelector('#inline-toolbar-underline-button');
    this.italicButton = this.container.querySelector('#inline-toolbar-italic-button');
    this.linkButton = this.container.querySelector('#inline-toolbar-link-button');

    $(this.boldButton).click(function(event){
      event.preventDefault();
      var range = quill.getSelection();
      if (range) {
        if (range.length != 0) {
          toggleInlineUtils(quill,range,'bold');
        }
      }
    });

    $(this.underlineButton).click(function(event){
      event.preventDefault();
      var range = this.quill.getSelection();
      if (range) {
        if (range.length != 0) {
          toggleInlineUtils(quill,range,'underline');
        }
      }
    }.bind(this));

    $(this.italicButton).click(function(event){
      event.preventDefault();
      var range = quill.getSelection();
      if (range) {
        if (range.length != 0) {
          toggleInlineUtils(quill,range,'italic');
        }
      }
    });

    $(this.linkButton).click(function(event){
      event.preventDefault();
      let value = prompt('Enter link URL');
      quill.format('link', value);
    });
  }

  update(range, oldRange, source){
    if (range) {
      // console.log('format', this.quill.getFormat(range));
      // console.log('contents', this.quill.getContents(range.index, 1));

      if (range.length == 0) {
        // console.log('User cursor is on', range.index);
        $(this.container).css({
          display : 'none'
        })
      } else {
        var text = this.quill.getText(range.index, range.length);
        const bounds = this.quill.getBounds(range.index,range.length);
        $(this.container).css({
          display: 'inline-block',
          top : bounds.top - bounds.height - 15,
          left : bounds.left
        });
      }
    } else {
      // console.log('Cursor not in the editor');
      $(this.container).css({
        display : 'none'
      })
    }
  }

  updateTextChange(){
    var range = this.quill.getSelection();
    if (range) {
      if (range.length == 0) {
        $(this.container).css({
          display : 'none'
        })
      }
    }
  }
}

class InlineLinkOpenerHover{
  constructor(quill, options){
    this.quill = quill;
    this.options = options;
    this.linkOpener = document.querySelector('#link-opener');
    this.openLinkButton = this.linkOpener.querySelector('#openLink-button');
    this.editLinkButton = this.linkOpener.querySelector('#editLink-button');
    this.removeLinkButton = this.linkOpener.querySelector('#removeLink-button');
    this.hideLinkOpener = this.hideLinkOpener.bind(this);

    this.editorChangeHandler = this.editorChangeHandler.bind(this);
    this.quill.on('selection-change',this.editorChangeHandler);
  }

  hideLinkOpener(){
    $(this.linkOpener).css({
      display : 'none'
    });
  }

  editorChangeHandler(event) {
    if (event != null) {
      let linkElem = Parchment.find(event.target);
      var range = this.quill.getSelection();
      if (range) {
        let [leaf, offset] = this.quill.getLeaf(range.index);
        //get selection
        const currentElem = leaf.parent;
        if (currentElem instanceof LinkBlot) {
          const bounds = this.quill.getBounds(range.index, range.length);
          const currentFormats = this.quill.getFormat(range);
          const linkFormats = currentFormats['link'];
          let linkValue = null;

          //TODO : need to support multiple format editing link when range is expanded
          if (linkFormats != null && linkFormats instanceof Array) {
            linkValue = linkFormats[0];
          } else {
            linkValue = linkFormats;
          }

          //open link button
          $(this.openLinkButton).off('click').on('click', function (event) {
            event.preventDefault();
            if (range) {
              window.open(linkValue, '_blank');
            }
          }.bind(this));

          //edit link button
          $(this.editLinkButton).off('click').on('click', function (event) {
            event.preventDefault();

            let newURLValue = prompt('Enter new link URL');

            //get current format and then offset and index of current link blot
            const linkElemOffset = currentElem.offset();
            const linkElemlength = currentElem.length();
            this.quill.formatText(linkElemOffset, linkElemOffset + linkElemlength, {
              'link': newURLValue
            }, Quill.sources.USER);
            this.hideLinkOpener();
          }.bind(this));


          //remove link button
          $(this.removeLinkButton).off('click').on('click', function (event) {
            event.preventDefault();

            const linkElemOffset = currentElem.offset();
            const linkElemlength = currentElem.length();
            this.quill.formatText(linkElemOffset, linkElemOffset + linkElemlength, {
              'link': false
            }, Quill.sources.USER);
            this.hideLinkOpener();
          }.bind(this));

          // var my_node = this.quill.selection.getNativeRange().start.node;
          // var my_blot = Parchment.find(my_node);
          // const currentFormats = this.quill.getFormat(range);
          // const link = currentFormats['link'];
          $(this.linkOpener).css({
            display: 'block',
            top: bounds.top + bounds.height,
            left: bounds.left
          })
        } else {
          this.hideLinkOpener();
        }
      } else {
        this.hideLinkOpener();
      }
    }
  }
}

/**
 * Comment Highlighter
 */
class CommentHighlighter{
  constructor(quill, options){
    this.quill = quill;
    this.options = options;
    this.editorChangeHandler = this.editorChangeHandler.bind(this);
    this.removeHiglightedComment = this.removeHiglightedComment.bind(this);

    this.quill.on('selection-change',this.editorChangeHandler);
  }

  removeHiglightedComment(){
    const allCommentNodes = document.querySelectorAll('span[data-commentid]');
    for (let i = 0; i < allCommentNodes.length; ++i) {
      allCommentNodes[i].className = 'comment-blot';
    }
  }

  editorChangeHandler(currentRange, oldRange, source){
    //get parent of the parent ?, no i think . just find the comment ID
    const range = this.quill.getSelection();
    if(range) {
      let [leaf, offset] = this.quill.getLeaf(range.index);
      const currentElem = leaf.parent;

      this.removeHiglightedComment();
      if (currentElem instanceof CommentBlot) {
        const currentFormats = this.quill.getFormat(range);
        const commentFormats = currentFormats['comment'];
        if (typeof commentFormats !== 'undefined') {
          if (commentFormats.length >= 1) {
            let commentFormat = commentFormats;
            if (commentFormats instanceof Array) {
              commentFormat = commentFormats[0];
            }

            const commentIDValues = commentFormat.split(',');
            const commentIDLastValue = commentIDValues[commentIDValues.length - 1];

            //get nodes of comment then add style
            const commentNodes = document.querySelectorAll('span[data-commentid*="' + commentIDLastValue + '"]');
            for (let i = 0; i < commentNodes.length; ++i) {
              commentNodes[i].className = 'comment-blot highlighted-comment-blot';
            }

            // console.log('link node : ',linkNode, ' , commentIDLastValue : ',commentIDLastValue);
          }
        }
      }
    }else{
      this.removeHiglightedComment();
    }
  }
}

class CommentWhitespaceManagement{
  constructor(quill, options){
    this.quill = quill;
    this.options = options;
    this.isAtTheEndOfCommentText = this.isAtTheEndOfCommentText.bind(this);
    this.getCommentBlots = this.getCommentBlots.bind(this);

    quill.on('text-change',this.handleTextChange.bind(this));
  }

  getCommentBlots(commentId){
    return document.querySelectorAll('span[data-commentid*="'+commentId+'"');
  }

  isAtTheEndOfCommentText(allCommentNode,range){
    /**
     * NOTE : get index and length of the comment and then check at current range
     */
    const lastCommentNode = allCommentNode[allCommentNode.length - 1];
    const commentBlot = Quill.find(lastCommentNode);
    const commentBlotIndex = this.quill.getIndex(commentBlot);

    if(range.index + range.length >= (commentBlotIndex + commentBlot.offset() + commentBlot.length())){
      return true;
    }

    return false;
  }

  handleTextChange(delta, oldContents, source) {
    const currentOps = delta.ops[1];
    const range = this.quill.getSelection();
    //if current operation is insert something at then end of comment and then don't make it into comment
    if (range != null) {
      const formats = this.quill.getFormat(range);
      if (formats != null && typeof formats['comment'] !== 'undefined') {
        const commentId = formats['comment'];
        const commentIdArray = commentId.split(',');
        const commentBlots = this.getCommentBlots(commentIdArray[commentIdArray.length - 1]);
        const isEndOfCommentText = this.isAtTheEndOfCommentText(commentBlots,range);
        console.log('is end of comment text : ', isEndOfCommentText);

        if (isEndOfCommentText) {
          if(typeof currentOps !== 'undefined' && typeof currentOps['insert'] !== 'undefined') {
            this.quill.formatText(range.index - 1, range.index, {
              'comment': false
            }, Quill.sources.USER);
          }
        }else{

        }
      }

      console.log('range : ', range);
      console.log('delta : ', delta, ' old contents : ', oldContents);
    }
  }
}

window.plugin = {};
window.plugin.Counter = Counter;
window.plugin.InlineToolbarHover = InlineToolbarHover;
window.plugin.InlineLinkOpenerHover = InlineLinkOpenerHover;
window.plugin.CommentHighlighter = CommentHighlighter;

window.plugin.CommentWhitespaceManagement = CommentWhitespaceManagement;