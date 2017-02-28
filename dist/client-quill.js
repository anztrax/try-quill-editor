var BackgroundClass = Quill.import('attributors/class/background');
var ColorClass = Quill.import('attributors/class/color');
let SizeStyle = Quill.import('attributors/style/size');

Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);

Quill.register('modules/counter',window.plugin.Counter);
Quill.register('modules/inlineToolbarHover',window.plugin.InlineToolbarHover);

//blot section
let Inline = Quill.import('blots/inline');
let Block = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');
let Embed = Quill.import('blots/embed');

let ListBlot = Quill.import('formats/list');
let TextAlignmentBlot = Quill.import('formats/align');

class BoldBlot extends Inline {};
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'strong';

class ItalicBlot extends Inline{};
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

class UnderlineBlot extends Inline{};
UnderlineBlot.blotName = 'underline';
UnderlineBlot.tagName = 'ins';

class StrikethroughBlot extends Inline{};
UnderlineBlot.blotName = 'strike';
UnderlineBlot.tagName = 'del';

class LinkBlot extends Inline{
  static create(value){
    let node = super.create();
    // Sanitize url value if desired
    node.setAttribute('href', value);

    // Okay to set other non-format related attributes
    // These are invisible to Parchment so must be static
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }
}

LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(UnderlineBlot);
Quill.register(StrikethroughBlot);
Quill.register(LinkBlot);
Quill.register(ListBlot);
Quill.register(TextAlignmentBlot);


//block section
class BlockquoteBlot extends Block{}
BlockquoteBlot.blotName = 'blockquote';
BlockquoteBlot.tagName = 'blockquote';

class ParagraphBlot extends Block{}
ParagraphBlot.blotName = 'paragraph';
ParagraphBlot.tagName = 'p';

class HeaderBlot extends Block{}
HeaderBlot.blotName = 'header';
HeaderBlot.tagName = ['h1','h2','h3','h4','h5','h6'];

Quill.register(BlockquoteBlot);
Quill.register(HeaderBlot);
Quill.register(ParagraphBlot);


//embed section
class DividerBlot extends BlockEmbed {}
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

class ImageBlot extends BlockEmbed {
  static create(value){
    let node = super.create();
    node.setAttribute('alt',value.alt);
    node.setAttribute('src',value.url);
    return node;
  }

  static value(node){
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src')
    }
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

class VideoBlot extends BlockEmbed{
  static create(url){
    let node = super.create();
    node.setAttribute('src', url);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    return node;
  }

  static formats(node){
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute('height')) {
      format.height = node.getAttribute('height');
    }
    if (node.hasAttribute('width')) {
      format.width = node.getAttribute('width');
    }
    return format;
  }

  static value(node) {
    return node.getAttribute('src');
  }

  format(name,value){
    //handle unregistered embed formats
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'iframe';

class ProcLink extends Embed{
  static create(value){
    let node = super.create(value);
    //give it some margin
    node.setAttribute('style', "background-color : lightgreen;");
    node.setAttribute('data-proc',value.value);
    node.innerHTML = value.text;
    return node;
  }
};

ProcLink.blotName = 'proc-link';
ProcLink.className = 'proc-link';
ProcLink.tagName = 'ProcLink';


Quill.register(DividerBlot);
Quill.register(ImageBlot);
Quill.register(VideoBlot);
Quill.register({
  'formats/proc-link' : ProcLink
});

//method section
function toggleInline(range, blotName, blotValue){
  const currentFormats = quill.getFormat(range);
  const isContainBlot = currentFormats[blotName] || false;
  let finalBlotValue = (typeof blotValue !== 'undefined') ? blotValue : !isContainBlot;
  quill.format(blotName,finalBlotValue);
}

// events
$('#bold-button').click(function() {
  var range = quill.getSelection();
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is at index', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted: ', text);
      toggleInline(range,'bold');
    }
  }
});
$('#italic-button').click(function() {
  var range = quill.getSelection();
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is at index', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted: ', text);
      toggleInline(range,'italic');
    }
  }
});
$('#underline-button').click(function() {
  var range = quill.getSelection();
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is at index', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted: ', text);
      toggleInline(range,'underline');
    }
  }
});
$('#strikethrough-button').click(function() {
  var range = quill.getSelection();
  if (range) {
    if (range.length == 0) {
      console.log('User cursor is at index', range.index);
    } else {
      var text = quill.getText(range.index, range.length);
      console.log('User has highlighted: ', text);
      toggleInline(range,'strike');
    }
  }
});
$('#link-button').click(function(){
  let value = prompt('Enter link URL');
  quill.format('link', value);
});

$("#blockquote-button").click(function(){
  quill.format('blockquote', true);
});

$("#divider-button").click(function(){
  var range = quill.getSelection();
  quill.insertText(range.index, '\n', Quill.sources.USER);
  quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
  quill.setSelection(range.index + 2, Quill.sources.SILENT);
});

$('#header-dropdown').change(function(event){
  const headerValue = event.target.value;
  if(headerValue  == 'normal'){
    quill.format('paragraph',true);
  }else{
    quill.format('header', event.target.value);
  }
});

$("#image-button").click(function(){
  let range = quill.getSelection();
  quill.insertText(range.index, '\n', Quill.sources.USER);
  quill.insertEmbed(range.index + 1, 'image', {
    alt: 'Quill Cloud',
    url: 'http://quilljs.com/0.20/assets/images/cloud.png'
  }, Quill.sources.USER);
  quill.setSelection(range.index + 2, Quill.sources.SILENT);
});

$("#video-button").click(function(){
  let range = quill.getSelection(true);
  quill.insertText(range.index, '\n', Quill.sources.USER);
  let url = 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0';
  quill.insertEmbed(range.index + 1, 'video', url, Quill.sources.USER);
  quill.formatText(range.index + 1, 1, { height: '170', width: '400' });
  quill.setSelection(range.index + 2, Quill.sources.SILENT);
});

$("#simple-link-button").click(function(){
  let range = quill.getSelection(true);
  let cObj = {text : 'Test', value : 'value'};
  quill.insertText(range.index, ' ', Quill.sources.USER);
  quill.insertEmbed(range.index + 1, 'proc-link', cObj, Quill.sources.USER);
  quill.insertText(range.index + 10, '   ', Quill.sources.USER);
  quill.setSelection(range.index + 10, Quill.sources.SILENT);
});

$('#text-alignment-dropdown').change(function(event){
  quill.format('align', event.target.value);
});

$('#ol-align-button').click(function(event){
  let range = quill.getSelection(true);
  toggleInline(range,'list','ordered');
});

$('#ul-align-button').click(function(event){
  let range = quill.getSelection(true);
  toggleInline(range,'list','bullet');
});

const quill = new Quill('#editor-container',{
  modules: {
    counter: {
      container: '#text-counter',
      unit: 'word'
    },
    inlineToolbarHover : true
  }
});

//parchment
var Parchment = Quill.import('parchment');

//bisa add event listener
quill.root.addEventListener('click', (ev) => {
  let image = Parchment.find(ev.target);

  if (image instanceof ImageBlot) {
    quill.setSelection(image.offset(quill.scroll), 1, 'user');
  }
});

