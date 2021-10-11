import useAtmosphere from '~/hooks/useAtmosphere'
import {commitLocalUpdate} from 'react-relay'
import {useLayoutEffect} from 'react'
import {SpotlightGroups_viewer} from '~/__generated__/SpotlightGroups_viewer.graphql'

const useSortGroupsIntoColumns = (
  similarReflectionGroups: SpotlightGroups_viewer['similarReflectionGroups'],
  columns: null | number[]
) => {
  const atmosphere = useAtmosphere()

  const sortGroups = () => {
    commitLocalUpdate(atmosphere, (store) => {
      const columnCount = columns?.length || 0
      similarReflectionGroups.forEach((group, idx) => {
        const reflectionGroup = store.get(group.id)
        const groupIdx = idx % columnCount
        reflectionGroup?.setValue(groupIdx, 'spotlightColumnIdx')
      })
    })
  }

  useLayoutEffect(() => {
    if (!columns?.length) return
    sortGroups()
  }, [columns?.length])
}

export default useSortGroupsIntoColumns
