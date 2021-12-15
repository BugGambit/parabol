import {compositeId, id} from './templates'
import legitify from './legitify'

export default function makeUpdateAgendaItemSchema() {
  return legitify({
    id: compositeId,
    content: (value: any) => value.trim().max(63, 'Try something a little shorter'),
    isActive: (value: any) => value.boolean(),
    pinned: (value: any) => value.boolean(),
    sortOrder: (value: any) => value.float(),
    teamId: id,
    teamMemberId: compositeId
  })
}
