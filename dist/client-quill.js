var BackgroundClass = Quill.import('attributors/class/background');
var ColorClass = Quill.import('attributors/class/color');
let SizeStyle = Quill.import('attributors/style/size');

let HistoryModule = Quill.import('modules/history');

Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);


Quill.register('modules/counter',window.plugin.Counter);
Quill.register('modules/inlineToolbarHover',window.plugin.InlineToolbarHover);
Quill.register('modules/inlineLinkOpener',window.plugin.InlineLinkOpenerHover);
Quill.register('modules/history',HistoryModule);
Quill.register('modules/commentHighlighter',window.plugin.CommentHighlighter);
Quill.register('modules/commentWhitespaceManagement',window.plugin.CommentWhitespaceManagement);

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
    let button = document.createElement('span');
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

class CommentBlot extends Inline{
  static create(value){
    let node = super.create();
    node.setAttribute('data-commentID', value);
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    const formats = {};

    formats['data-commentID'] = node.getAttribute('data-commentID');
    formats['style'] = node.getAttribute('style');
    return node.getAttribute('data-commentID');
  }
}
CommentBlot.blotName = 'comment';
CommentBlot.className = 'comment-blot';
CommentBlot.tagName = 'span';

Quill.register(BoldBlot);
Quill.register(ItalicBlot);
Quill.register(UnderlineBlot);
Quill.register(StrikethroughBlot);
Quill.register(LinkBlot);
Quill.register(ListBlot);
Quill.register(TextAlignmentBlot);
Quill.register('formats/comment',CommentBlot);

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

class ProcLink extends Inline{
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

$('#comment-button').click(function(event){
  addCommentBlot();
});
$('#resolve-comment-button').click(function(event){
  removeCommentBlot();
});

function removeCommentBlot(){
  //TODO : when remove new comment check if current element comment is available / not
  let range = quill.getSelection();
  if(range){
    const format = quill.getFormat(range);
    let commentFormat = format['comment'];

    //NOTE : get all node that contain data-commentid == commentFormat and then remove commentid
    if(commentFormat != null){
      //NOTE : get last value of commentID
      const commentIDValues = commentFormat.split(',');
      const commentIDLastValue = commentIDValues[commentIDValues.length - 1];

      const textRanges = getCommentBlot(commentIDLastValue);
      textRanges.map(function(textRange){
        const currentCommentFormat = textRange['format']['comment'];
        const currentCommentFormatFragment = currentCommentFormat.split(',');

        //NOTE : we get commentID and then we just compare with `commentIDLastValue` ...
        let commentFormatValue = false;

        const indexOfCommentID = currentCommentFormatFragment.findIndex(function(commentID){
          return commentID == commentIDLastValue
        });
        if(indexOfCommentID != -1){
          currentCommentFormatFragment.splice(indexOfCommentID,1);
          if(currentCommentFormatFragment.length > 0){
            commentFormatValue = currentCommentFormatFragment.join(',');
          }else{
            commentFormatValue = false;
          }
        }

        quill.formatText(textRange.index, textRange.length, {
          'comment': commentFormatValue
        },Quill.sources.API);
      });
    }
  }
}

function getCommentBlot(commentID){
  const textRanges = [];
  const allCommentNodes = document.querySelectorAll('span[data-commentid*="'+commentID+'"');
  for(let i=0;i < allCommentNodes.length ;i++){
    const commentBlot =  Quill.find(allCommentNodes[i]);
    const commentBlotIndex = quill.getIndex(commentBlot);
    const formats = commentBlot.formats();
    const commentFormat = formats['comment'];

    textRanges.push({
      format : {
        comment : commentFormat
      },
      index : commentBlotIndex,
      length : commentBlot.length()
    });
  }

  return textRanges;
}

function addCommentBlot(){
  //TODO : when adding new comment then check if current element comment is available / not.
  let range = quill.getSelection();
  if (range) {
    let commentID = prompt('Enter comment ID ');
    if (range.length != 0) {
      //TODO : if comment blot is not available at range then add comment format
      const format = quill.getFormat(range);
      let commentFormat = format['comment'];

      if(commentFormat != null){
        if(!(commentFormat instanceof Array)){
          commentFormat = [].concat(commentFormat);
        }
        commentFormat.push(commentID);

        quill.formatText(range.index, range.length, {
          'comment': commentFormat.toString()
        },Quill.sources.USER);

      }else{
        const offsetAndFormats = getOffsetAndFormatsFromCurrentRange(range);
        const formats = getFormatsFromRange(offsetAndFormats);
        if(formats['comment'] != null) {
          offsetAndFormats.map(function (offsetAndFormat) {
            const offset = offsetAndFormat.offset;
            const length = offsetAndFormat.length;
            const format = offsetAndFormat.format;
            let commentFormat = commentID;

            if(format != null) {
              commentFormat = format['comment'];
              if (commentFormat != null) {
                if (!(commentFormat instanceof Array)) {
                  commentFormat = [].concat(commentFormat);
                }
                commentFormat.push(commentID);
              } else {
                commentFormat = commentID;
              }
            }

            quill.formatText(offset, length, {
              'comment': commentFormat.toString()
            }, Quill.sources.USER);
          });
        }else {
          quill.format('comment', commentID, Quill.sources.USER);
        }
      }
    }else{
      //TODO: if range is not on selected text then get text of it
    }
  }else{

  }
}

/**
 * NOTE : there are something wrong with method `quill.getFormat`. So we need this method to get real data
 */
function getOffsetAndFormatsFromCurrentRange(range){
  const offsetAndFormats = [];
  const delta = quill.getContents(range);
  delta.ops.map(function(op, index){
    const attributes = (typeof op['attributes'] !== 'undefined') ? op['attributes'] : null;
    const textLength = op['insert'].length;

    let offsetValue = 0;
    if(index == 0) { //if start index then use first range index
      offsetValue = range.index;
    }else{
      offsetValue = 0;
      const currentIteratorValue = offsetAndFormats[index - 1];
      offsetValue += currentIteratorValue.offset + currentIteratorValue.length;
    }

    offsetAndFormats.push({
      offset: offsetValue,
      length: textLength,
      format : attributes
    });
  });

  return offsetAndFormats;
}

function getFormatsFromRange(offsetAndFormats){
  const formats = {};
  Object.keys(offsetAndFormats).map(function(offsetAndFormatKey){
    const offsetAndFormat = offsetAndFormats[offsetAndFormatKey];
    const format = offsetAndFormat.format;
    const offset = offsetAndFormat.offset;
    const length = offsetAndFormat.length;
    if(format != null) {
      Object.keys(format).map(function (formatKey) {
        const formatValue = format[formatKey];
        if (typeof formats[formatKey] === 'undefined') {
          formats[formatKey] = [];
        }

        formats[formatKey].push({
          offset: offset,
          length: length
        });
      });
    }
  });

  return formats;
}

var toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'align': [] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
];

const quill = new Quill('#editor-container',{
  placeholder: 'Place text here...',
  theme: 'snow',
  modules: {
    toolbar : false,
    counter: {
      container: '#text-counter',
      unit: 'word'
    },
    inlineToolbarHover : true,
    inlineLinkOpener : true,
    commentHighlighter : true,
    history : {
      userOnly : true
    },
    commentWhitespaceManagement : true
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

