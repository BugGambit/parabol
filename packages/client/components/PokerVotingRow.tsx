import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {PokerVotingRow_scaleValue} from '../__generated__/PokerVotingRow_scaleValue.graphql'
import {PokerVotingRow_scores} from '../__generated__/PokerVotingRow_scores.graphql'
import {SetVotedUserEl} from './EstimatePhaseArea'
import MiniPokerCard from './MiniPokerCard'
import PokerVotingAvatarGroup from './PokerVotingAvatarGroup'
import PokerVotingRowBase from './PokerVotingRowBase'

interface Props {
  // can be null if the meeting had ended & then the scaleValues were modified
  scaleValue: PokerVotingRow_scaleValue | null
  scores: PokerVotingRow_scores
  setVotedUserEl: SetVotedUserEl
}

const PokerVotingRow = (props: Props) => {
  const {setVotedUserEl, scaleValue, scores} = props
  const fallbackLabel = scaleValue ? undefined : scores[0]?.label ?? '#'
  return (
    <PokerVotingRowBase>
      <MiniPokerCard scaleValue={scaleValue} fallbackLabel={fallbackLabel} />
      <PokerVotingAvatarGroup setVotedUserEl={setVotedUserEl} scores={scores} />
    </PokerVotingRowBase>
  )
}

export default createFragmentContainer(
  PokerVotingRow,
  {
    scaleValue: graphql`
    fragment PokerVotingRow_scaleValue on TemplateScaleValue {
      ...MiniPokerCard_scaleValue
    }`,
    scores: graphql`
    fragment PokerVotingRow_scores on EstimateUserScore @relay(plural: true) {
      ...PokerVotingAvatarGroup_scores
      label
    }`
  }
)
