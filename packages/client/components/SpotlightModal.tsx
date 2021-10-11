import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {Suspense, useEffect, useRef} from 'react'
import {PreloadedQuery, usePreloadedQuery} from 'react-relay'
import makeMinWidthMediaQuery from '~/utils/makeMinWidthMediaQuery'
import {DECELERATE, fadeUp} from '../styles/animation'
import {Elevation} from '../styles/elevation'
import {PALETTE} from '../styles/paletteV3'
import {ICON_SIZE} from '../styles/typographyV2'
import {Breakpoint, ElementHeight, ElementWidth, Times, ZIndex} from '../types/constEnums'
import {SpotlightModalQuery} from '../__generated__/SpotlightModalQuery.graphql'
import {SpotlightPortalId} from './GroupingKanban'
import Icon from './Icon'
import LoadingComponent from './LoadingComponent/LoadingComponent'
import MenuItemComponentAvatar from './MenuItemComponentAvatar'
import MenuItemLabel from './MenuItemLabel'
import PlainButton from './PlainButton/PlainButton'
import ReflectionGroup from './ReflectionGroup/ReflectionGroup'
import SpotlightGroups from './SpotlightGroups'

const dashWidestBreakpoint = makeMinWidthMediaQuery(Breakpoint.DASH_BREAKPOINT_WIDEST)
const desktopBreakpoint = makeMinWidthMediaQuery(Breakpoint.NEW_MEETING_SELECTOR)
const SELECTED_HEIGHT_PERC = 33.3

const ModalContainer = styled('div')({
  animation: `${fadeUp.toString()} 300ms ${DECELERATE} 300ms forwards`,
  background: '#FFFF',
  borderRadius: 8,
  boxShadow: Elevation.Z8,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  opacity: 0,
  overflow: 'hidden',
  height: '85vh',
  width: '90vw',
  zIndex: ZIndex.DIALOG,
  [desktopBreakpoint]: {
    width: '80vw'
  },
  [dashWidestBreakpoint]: {
    width: '70vw',
    height: '80vh'
  }
})

const SelectedReflectionSection = styled('div')({
  alignItems: 'flex-start',
  background: PALETTE.SLATE_100,
  borderRadius: '8px 8px 0px 0px',
  display: 'flex',
  flexWrap: 'wrap',
  height: `${SELECTED_HEIGHT_PERC}%`,
  justifyContent: 'center',
  padding: 16,
  position: 'relative',
  width: '100%'
})

const SimilarGroups = styled('div')({
  height: `${SELECTED_HEIGHT_PERC * 2}%`,
  width: '100%'
})

const Title = styled('div')({
  color: PALETTE.SLATE_800,
  fontSize: 16,
  fontWeight: 600,
  textAlign: 'center'
})

const TopRow = styled('div')({
  width: `calc(100% - 48px)`, // 48px accounts for icon size
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

const SpotlightGroupWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: `calc(${SELECTED_HEIGHT_PERC / 2}% - ${ElementHeight.REFLECTION_CARD / 2}px)`,
  left: `calc(50% - ${ElementWidth.REFLECTION_CARD / 2}px)`,
  zIndex: ZIndex.REFLECTION_IN_FLIGHT_LOCAL
})

const SearchInput = styled('input')({
  appearance: 'none',
  border: `1px solid ${PALETTE.SKY_500}`,
  borderRadius: 4,
  boxShadow: `0 0 1px 1px ${PALETTE.SKY_300}`,
  color: PALETTE.SLATE_700,
  display: 'block',
  fontSize: 14,
  lineHeight: '24px',
  outline: 'none',
  padding: '6px 0 6px 39px',
  width: '100%',
  '::placeholder': {
    color: PALETTE.SLATE_600
  }
})

const SearchItem = styled(MenuItemLabel)({
  overflow: 'visible',
  padding: 0,
  position: 'absolute',
  bottom: -16,
  width: ElementWidth.REFLECTION_CARD
})

const StyledMenuItemIcon = styled(MenuItemComponentAvatar)({
  position: 'absolute',
  left: 8,
  top: 8
})

const SearchIcon = styled(Icon)({
  color: PALETTE.SLATE_600,
  fontSize: ICON_SIZE.MD24
})

const StyledCloseButton = styled(PlainButton)({
  height: 24,
  position: 'absolute',
  right: 16
})

const CloseIcon = styled(Icon)({
  color: PALETTE.SLATE_600,
  cursor: 'pointer',
  fontSize: ICON_SIZE.MD24,
  '&:hover,:focus': {
    color: PALETTE.SLATE_800
  }
})

interface Props {
  closeSpotlight: () => void
  flipRef: (instance: HTMLDivElement) => void
  queryRef: PreloadedQuery<SpotlightModalQuery>
}

const SpotlightModal = (props: Props) => {
  const {closeSpotlight, flipRef, queryRef} = props
  const data = usePreloadedQuery<SpotlightModalQuery>(
    graphql`
      query SpotlightModalQuery($reflectionGroupId: ID!, $searchQuery: String!, $meetingId: ID!) {
        viewer {
          ...SpotlightGroups_viewer
          meeting(meetingId: $meetingId) {
            ... on RetrospectiveMeeting {
              ...SpotlightGroups_meeting
              ...ReflectionGroup_meeting
              id
              teamId
              localPhase {
                phaseType
              }
              localStage {
                isComplete
                phaseType
              }
              phases {
                phaseType
                stages {
                  isComplete
                  phaseType
                }
              }
              spotlightGroup {
                ...ReflectionGroup_reflectionGroup
                reflections {
                  id
                }
              }
            }
          }
        }
      }
    `,
    queryRef,
    {UNSTABLE_renderPolicy: 'full'}
  )

  const {viewer} = data
  const {meeting} = viewer
  const phaseRef = useRef(null)
  const spotlightReflectionIds = useRef<null | string[]>(null)
  const spotlightGroup = meeting?.spotlightGroup
  const firstReflectionId = spotlightGroup?.reflections[0]?.id
  const secondReflectionId = spotlightGroup?.reflections[1]?.id
  const showSpotlight = meeting && spotlightGroup

  useEffect(() => {
    if (!spotlightGroup) return
    const {current: ids} = spotlightReflectionIds
    if (!ids && firstReflectionId) {
      spotlightReflectionIds.current = [firstReflectionId]
    } else if (firstReflectionId && secondReflectionId && ids?.includes(secondReflectionId)) {
      spotlightReflectionIds.current = [...ids, firstReflectionId]
    } else if (!firstReflectionId || !ids?.includes(firstReflectionId)) {
      setTimeout(() => {
        closeSpotlight()
      }, Times.REFLECTION_DROP_DURATION)
    }
  }, [firstReflectionId])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && !e.currentTarget.value) {
      closeSpotlight()
    }
  }
  return (
    <>
      <ModalContainer ref={phaseRef}>
        <SelectedReflectionSection>
          <TopRow>
            <Title>Find cards with similar reflections</Title>
            <StyledCloseButton onClick={closeSpotlight}>
              <CloseIcon>close</CloseIcon>
            </StyledCloseButton>
          </TopRow>
          <SearchItem>
            <StyledMenuItemIcon>
              <SearchIcon>search</SearchIcon>
            </StyledMenuItemIcon>
            <SearchInput
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete='off'
              name='search'
              placeholder='Or search for keywords...'
              type='text'
            />
          </SearchItem>
        </SelectedReflectionSection>
        <SimilarGroups>
          <Suspense
            fallback={<LoadingComponent height={24} width={24} showAfter={0} spinnerSize={24} />}
          >
            <SpotlightGroups meeting={meeting} phaseRef={phaseRef} viewer={viewer} />
          </Suspense>
        </SimilarGroups>
      </ModalContainer>
      <SpotlightGroupWrapper ref={flipRef}>
        {showSpotlight && (
          <ReflectionGroup
            phaseRef={phaseRef}
            reflectionGroup={spotlightGroup}
            expandedReflectionGroupPortalParentId={SpotlightPortalId}
            meeting={meeting}
            spotlightReflectionIds={spotlightReflectionIds.current}
          />
        )}
      </SpotlightGroupWrapper>
    </>
  )
}

export default SpotlightModal
