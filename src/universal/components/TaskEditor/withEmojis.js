import PropTypes from 'prop-types';
import React, {Component} from 'react';
import getWordAt from 'universal/components/TaskEditor/getWordAt';
import ui from 'universal/styles/ui';
import getDraftCoords from 'universal/utils/getDraftCoords';
import getAnchorLocation from './getAnchorLocation';
import LoadableDraftJSModal from 'universal/components/LoadableDraftJSModal';
import LoadableEmojiMenu from 'universal/components/LoadableEmojiMenu';
import {autoCompleteEmoji} from 'universal/utils/draftjs/completeEnitity';

const originAnchor = {
  vertical: 'top',
  horizontal: 'left'
};

const targetAnchor = {
  vertical: 'top',
  horizontal: 'left'
};

const withEmojis = (ComposedComponent) => {
  class WithEmojis extends Component {
    static propTypes = {
      editorRef: PropTypes.any,
      editorState: PropTypes.object.isRequired,
      handleChange: PropTypes.func,
      keyBindingFn: PropTypes.func,
      // could be readOnly, so not strictly required
      setEditorState: PropTypes.func
    };

    state = {
      isOpen: false,
      query: ''
    };

    keyBindingFn = (e) => {
      const {keyBindingFn} = this.props;
      if (keyBindingFn) {
        const result = keyBindingFn(e);
        if (result) return result;
      }
      if (this.menuRef.current) {
        const handled = this.menuRef.current.handleKeyDown(e);
        if (handled) return handled;
      }
      return undefined;
    };

    menuRef = React.createRef();

    menuItemClickFactory = (emoji, editorState) => (e) => {
      e.preventDefault();
      const {setEditorState} = this.props;
      const nextEditorState = autoCompleteEmoji(editorState, emoji);
      setEditorState(nextEditorState);
    };

    removeModal = () => {
      this.setState({
        isOpen: false,
        query: ''
      });
    };

    handleChange = (editorState) => {
      const {handleChange} = this.props;
      if (handleChange) {
        handleChange(editorState);
      }
      const {block, anchorOffset} = getAnchorLocation(editorState);
      const blockText = block.getText();
      const entityKey = block.getEntityAt(anchorOffset - 1);
      const {word} = getWordAt(blockText, anchorOffset - 1);

      const inASuggestion = word && !entityKey && word[0] === ':';
      if (inASuggestion) {
        this.setState({
          isOpen: true,
          query: word.slice(1)
        });
      } else if (this.state.isOpen) {
        this.removeModal();
      }
    };

    initialize = () => {
      const {isOpen} = this.state;
      if (isOpen) {
        const {renderModal, removeModal, keyBindingFn} = this;
        return {renderModal, removeModal, keyBindingFn};
      }
      return {};
    };

    renderModal = () => {
      const {query} = this.state;
      const {editorRef, editorState} = this.props;
      const coords = getDraftCoords(editorRef);
      this.cachedCoords = coords || this.cachedCoords;
      if (!this.cachedCoords) {
        return null;
      }
      return (
        <LoadableDraftJSModal
          isOpen={this.state.isOpen}
          closePortal={this.removeModal}
          LoadableComponent={LoadableEmojiMenu}
          maxWidth={500}
          maxHeight={200}
          originAnchor={originAnchor}
          queryVars={{
            menuItemClickFactory: this.menuItemClickFactory,
            query,
            menuRef: this.menuRef,
            editorState
          }}
          targetAnchor={targetAnchor}
          marginFromOrigin={ui.draftModalMargin}
          originCoords={this.cachedCoords}
        />
      );
    };

    render () {
      return (
        <ComposedComponent
          {...this.props}
          {...this.initialize()}
          handleChange={this.handleChange}
        />
      );
    }
  }
  return WithEmojis;
};

export default withEmojis;
