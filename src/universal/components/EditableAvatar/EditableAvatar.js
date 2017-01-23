import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import appTheme from 'universal/styles/theme/appTheme';
import ui from 'universal/styles/ui';
import defaultOrgAvatar from 'universal/styles/theme/images/avatar-organization.svg';
import defaultUserAvatar from 'universal/styles/theme/images/avatar-user.svg';
import FontAwesome from 'react-fontawesome';

const EditableAvatar = (props) => {
  const {forUser, onClick, picture, size, styles} = props;
  const fallbackImage = forUser ? defaultUserAvatar : defaultOrgAvatar;
  const avatarBlockStyles = css(
    styles.avatar,
    !forUser && styles.avatarForTeamsOrgs
  );
  return (
    <div className={avatarBlockStyles}>
      <div className={css(styles.avatarEditOverlay)} onClick={onClick}>
        <FontAwesome name="pencil"/>
        <span>EDIT</span>
      </div>
      <img className={css(styles.avatarImg)} src={picture || fallbackImage}/>
    </div>
  );
};

EditableAvatar.propTypes = {
  forUser: PropTypes.bool,
  onClick: PropTypes.func,
  picture: PropTypes.string,
  size: PropTypes.number,
  styles: PropTypes.object
};

const borderRadius = ui.panelBorderRadius;
const borderRadiusUser = '50%';

const styleThunk = (theme, props) => ({
  avatar: {
    height: props.size,
    position: 'relative',
    width: props.size
  },

  avatarForTeamsOrgs: {
    backgroundColor: '#fff',
    border: `1px solid ${ui.panelBorderColor}`,
    padding: '.5rem',
    borderRadius: props.forUser ? borderRadiusUser : borderRadius,
  },

  avatarEditOverlay: {
    alignItems: 'center',
    backgroundColor: appTheme.palette.dark,
    borderRadius: props.forUser ? borderRadiusUser : borderRadius,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontSize: appTheme.typography.s3,
    fontWeight: 700,
    height: props.size,
    justifyContent: 'center',
    left: props.forUser ? 0 : '-1px',
    opacity: 0,
    position: 'absolute',
    top: props.forUser ? 0 : '-1px',
    width: props.size,

    ':hover': {
      opacity: '.75',
      transition: 'opacity .2s ease-in',
    },
  },

  avatarImg: {
    borderRadius: props.forUser ? borderRadiusUser : 0,
    boxShadow: props.forUser ? ui.avatarDefaultBoxShadow : 'none',
    height: props.forUser ? props.size : (props.size - 18),
    width: props.forUser ? props.size : (props.size - 18),
  }
});

export default withStyles(styleThunk)(EditableAvatar);
