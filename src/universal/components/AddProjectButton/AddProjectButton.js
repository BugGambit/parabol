import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import FontAwesome from 'react-fontawesome';
import ui from 'universal/styles/ui';

const iconStyle = {
  fontSize: ui.iconSize2x,
  height: '1.5rem',
  lineHeight: '1.5rem',
  paddingTop: '1px'
};

const AddProjectButton = (props) => {
  const {styles, label, onClick} = props;
  return (
    <FontAwesome
      className={css(styles.addIcon)}
      name="plus-square-o"
      onClick={onClick}
      style={iconStyle}
      title={`Add a Project set to ${label}`}
    />
  );
};

AddProjectButton.propTypes = {
  styles: PropTypes.object,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

const styleThunk = () => ({
  addIcon: {
    ':hover': {
      cursor: 'pointer',
      opacity: '.5'
    },
    ':focus': {
      cursor: 'pointer',
      opacity: '.5'
    }
  }
});

export default withStyles(styleThunk)(AddProjectButton);
