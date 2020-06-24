import React from 'react';
import styles from './styles.module.scss';
import _ from 'lodash';

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

class Editor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {editorHtml: '', theme: 'snow'};
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevProps.value, this.props.value)) {
            this.setState({
                editorHtml: this.props.value
            });
        }
    }

    handleChange (html) {
        this.setState({editorHtml: html});
        this.props.callback(html);
    }
    
    handleThemeChange (newTheme) {
        if (newTheme === 'core') {newTheme = null}
        this.setState({theme: newTheme});
    }
    
    submit = () => {
        if (this.props.callback) {
            this.props.callback(this.state.editorHtml);
        }
    }
 
    render () {
        return (
            <>
                <ReactQuill 
                    theme={this.state.theme}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={Editor.modules}
                    formats={Editor.formats}
                    className={styles['editor']}
                    bounds={'.app'}
                    placeholder={this.props.placeholder}
                />
            </>
        );
    }
}

/* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
Editor.modules = {
    toolbar: [
        [{'header': '1'}, {'header': '2'}, {'font': []}],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
            {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false
    }
};
/* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];
  
export default Editor;