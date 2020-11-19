import React from 'react'
import styled from '@emotion/styled'
import MiniPokerCardPlaceholder from './MiniPokerCardPlaceholder'
import MiniPokerCard from './MiniPokerCard'
import LinkButton from './LinkButton'
import {PALETTE} from '~/styles/paletteV2'
import {createFragmentContainer} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {PokerDimensionValueControl_scaleValue} from '../__generated__/PokerDimensionValueControl_scaleValue.graphql'

const ControlWrap = styled('div')({
  padding: '0 8px'
})

const Control = styled('div')<{hasFocus: boolean}>(({hasFocus}) => ({
  alignItems: 'center',
  backgroundColor: hasFocus ? 'white' : 'rgba(255, 255, 255, .75)',
  border: '2px solid',
  borderColor: hasFocus ? PALETTE.TEXT_BLUE : 'transparent',
  borderRadius: 4,
  cursor: 'pointer',
  display: 'flex',
  padding: 6
}))

const Input = styled('input')({
  background: 'none',
  border: 0,
  color: PALETTE.TEXT_MAIN,
  display: 'block',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  outline: 0,
  textAlign: 'center',
  width: '100%',
  '::placeholder': {
    // color: hasFocus ? 'rgba(125, 125, 125, 125, .25' : 'rgba(125, 125, 125, .5)'
    color: 'rgba(125, 125, 125, .25)'
  }
})

const Label = styled('label')({
  color: PALETTE.TEXT_GRAY,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '24px',
  margin: '0 0 0 16px',
  padding: 0
})

const StyledLinkButton = styled(LinkButton)({
  fontSize: 14,
  fontWeight: 600,
  height: 40,
  margin: '0 0 0 8px',
  padding: '0 8px'
})

interface Props {
  hasFocus: boolean
  placeholder: string
  scaleValue: PokerDimensionValueControl_scaleValue | null
}

const PokerDimensionValueControl = (props: Props) => {
  const {hasFocus, placeholder, scaleValue} = props
  return (
    <ControlWrap>
      <Control hasFocus={hasFocus}>
        {scaleValue
          ? <>
            <MiniPokerCard scaleValue={scaleValue} />
            <Label>{'Edit Final Value'}</Label>
          </>
          : <>
            <MiniPokerCardPlaceholder>
              <Input autoFocus={hasFocus} placeholder={placeholder}></Input>
            </MiniPokerCardPlaceholder>
            <StyledLinkButton palette={'blue'}>{'Confirm'}</StyledLinkButton>
          </>
        }
      </Control>
    </ControlWrap>
  )
}

export default createFragmentContainer(
  PokerDimensionValueControl,
  {
    scaleValue: graphql`
    fragment PokerDimensionValueControl_scaleValue on TemplateScaleValue {
      ...MiniPokerCard_scaleValue
    }`
  }
)
