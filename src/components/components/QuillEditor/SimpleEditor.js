import React from 'react';

export default class SimpleEditor extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    const editor = new Quill(this.props.editorID,{theme: 'snow'});
  }

  render(){
    return (
      <div id={this.props.editorID}>
        {this.props.children}
      </div>
    )
  }
}