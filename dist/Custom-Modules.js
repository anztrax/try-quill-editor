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

    this.editorChangeHandler = this.editorChangeHandler.bind(this);
    this.quill.on('selection-change',this.editorChangeHandler);
  }

  editorChangeHandler(event){
    let linkElem = Parchment.find(event.target);
    console.log(linkElem instanceof LinkBlot);
    var range = this.quill.getSelection();
    if(range) {
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

        $(this.openLinkButton).off('click').on('click', function (event) {
          event.preventDefault();
          if (range) {
            window.open(linkValue, '_blank');
          }
        }.bind(this));

        $(this.editLinkButton).off('click').on('click', function (event) {
          event.preventDefault();

          let newURLValue = prompt('Enter new link URL');

          //get current format and then offset and index of current link blot
          const linkElemOffset = currentElem.offset();
          const linkElemlength = currentElem.length();
          this.quill.formatText(linkElemOffset, linkElemOffset + linkElemlength, {
            'link': newURLValue
          }, Quill.sources.USER);

        }.bind(this));


        $(this.removeLinkButton).off('click').on('click', function (event) {
          event.preventDefault();

        }.bind(this));

        // var my_node = this.quill.selection.getNativeRange().start.node;
        // var my_blot = Parchment.find(my_node);
        // const currentFormats = this.quill.getFormat(range);
        // const link = currentFormats['link'];
        $(this.linkOpener).css({
          display : 'block',
          top: bounds.top + bounds.height,
          left: bounds.left
        })
      }else{
        $(this.linkOpener).css({
          display : 'none'
        });
      }
    }else {
      $(this.linkOpener).css({
        display : 'none'
      })
    }
  }
}

window.plugin = {};
window.plugin.Counter = Counter;
window.plugin.InlineToolbarHover = InlineToolbarHover;
window.plugin.InlineLinkOpenerHover = InlineLinkOpenerHover;