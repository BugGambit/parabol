import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import appTheme from 'universal/styles/theme/appTheme';
import ui from 'universal/styles/ui';
import tinycolor from 'tinycolor2';

const {cool, warm, dark, mid, light} = appTheme.palette;
const white = '#fff';
const gray = appTheme.palette.mid20l;
const buttonPalette = {
  cool,
  warm,
  dark,
  mid,
  light,
  gray,
  white
};

const makeSolidTheme = (themeColor, textColor = '#fff', style = 'solid', opacity = '.65') => {
  const buttonColor = style === 'inverted' ? tinycolor.mix(themeColor, '#fff', 90).toHexString() : themeColor;
  const color = style === 'inverted' ? tinycolor.mix(textColor, '#000', 10).toHexString() : textColor;

  return {
    backgroundColor: buttonColor,
    borderColor: buttonColor,
    color,

    ':hover': {
      color,
      opacity
    },
    ':focus': {
      color,
      opacity
    }
  };
};

const makeOutlinedTheme = (color, opacity = '.5') => ({
  backgroundColor: 'transparent',
  borderColor: 'currentColor',
  color,

  ':hover': {
    color,
    opacity
  },
  ':focus': {
    color,
    opacity
  }
});

const makePropColors = (style, colorPalette) => {
  const color = buttonPalette[colorPalette];
  if (style === 'outlined') {
    return makeOutlinedTheme(color);
  }
  const baseTextColor = style === 'inverted' ? color : white;
  const textColor = (colorPalette === 'white' || colorPalette === 'light' || colorPalette === 'gray') ? dark : baseTextColor;
  return makeSolidTheme(color, textColor, style);
};

const Button = (props) => {
  const {
    disabled,
    isBlock,
    label,
    onClick,
    onMouseEnter,
    styles,
    title,
    type
  } = props;

  const buttonTitle = title || label;

  const buttonStyles = css(
    styles.base,
    styles.propColors,
    disabled && styles.disabled,
    isBlock && styles.isBlock
  );

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      title={buttonTitle}
      type={type}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  borderRadius: PropTypes.string,
  disabled: PropTypes.bool,
  isBlock: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  size: PropTypes.oneOf(ui.buttonSizes),
  style: PropTypes.oneOf([
    'solid',
    'outlined',
    'inverted'
  ]),
  styles: PropTypes.object,
  colorPalette: PropTypes.oneOf(ui.buttonColorPalette),
  textTransform: PropTypes.oneOf([
    'none',
    'uppercase'
  ]),
  title: PropTypes.string,
  type: PropTypes.oneOf([
    'button',
    'menu',
    'reset',
    'submit'
  ])
};

Button.defaultProps = {
  type: 'button'
};

const keyframesDip = {
  '0%': {
    transform: 'translate(0, 0)'
  },
  '50%': {
    transform: 'translate(0, .25rem)'
  },
  '100%': {
    transform: 'translate(0)'
  }
};

const styleThunk = (customTheme, props) => ({
  // Button base
  base: {
    appearance: 'none',
    border: '1px solid transparent',
    borderRadius: props.borderRadius || ui.buttonBorderRadius,
    boxShadow: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: ui.buttonFontSize[props.size] || '1rem',
    fontWeight: 700,
    lineHeight: 'normal',
    outline: 'none',
    padding: '.75em 1.5em',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: props.textTransform || 'none',
    userSelect: 'none',

    ':hover': {
      textDecoration: 'none'
    },
    ':focus': {
      textDecoration: 'none'
    },

    ':active': {
      animationDuration: '.1s',
      animationName: keyframesDip,
      animationTimingFunction: 'ease-in'
    }
  },

  isBlock: {
    display: 'block',
    paddingLeft: '.25rem',
    paddingRight: '.25rem',
    width: '100%'
  },

  // doing this saves us from creating 6*3 classes
  propColors: makePropColors(props.style, props.colorPalette),

  // Disabled state
  disabled: {
    cursor: 'not-allowed',
    opacity: '.5',

    ':hover': {
      opacity: '.5'
    },
    ':focus': {
      opacity: '.5'
    },

    ':active': {
      animation: 'none'
    }
  }
});

export default withStyles(styleThunk)(Button);
