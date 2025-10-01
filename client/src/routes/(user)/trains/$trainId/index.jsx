import { createFileRoute } from '@tanstack/react-router'
import { TrainSearchbyNo } from '../../../../features/user/trains/components'

export const Route = createFileRoute('/(user)/trains/$trainId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><TrainSearchbyNo/></div>
}
