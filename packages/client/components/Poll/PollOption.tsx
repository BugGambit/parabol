import React, {Ref} from 'react'
import styled from '@emotion/styled'
import {usePollContext} from './PollContext'
import {PALETTE} from '~/styles/paletteV3'

interface Props {
  id: string
  title?: string
  placeholder: string | null
}

const PollOptionRoot = styled('div')({
  width: '100%',
  height: '36px',
  fontSize: '14px',
  padding: `0 12px`,
  border: `1px solid ${PALETTE.SLATE_400}`,
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center'
})

const PollOptionInput = styled('input')({
  padding: `10px 12px`,
  fontSize: '14px',
  color: PALETTE.SLATE_900,
  borderRadius: '7px',
  border: `1.5px solid ${PALETTE.SLATE_400}`,
  ':hover, :focus, :active': {
    outline: `none`,
    border: `1.5px solid ${PALETTE.SKY_500}`
  }
})

const PollOption = React.forwardRef((props: Props, ref: Ref<HTMLDivElement | HTMLInputElement>) => {
  const {id, title, placeholder} = props
  const {onPollOptionSelected, pollState, updatePollOption} = usePollContext()

  if (pollState === 'creating') {
    const handlePollOptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
      updatePollOption(id, event.target.value)
    }

    return (
      <PollOptionInput
        key={id}
        placeholder={placeholder ?? ''}
        value={title}
        onChange={handlePollOptionUpdate}
      />
    )
  }

  return (
    <PollOptionRoot
      ref={ref}
      key={id}
      onClick={() => {
        onPollOptionSelected(id)
      }}
    >
      {title}
    </PollOptionRoot>
  )
})

export default PollOption
