import { createFileRoute } from '@tanstack/react-router'
import {PaymentGatewayPage} from '../../../../../features/user/trains/components'

export const Route = createFileRoute('/(user)/trains/$trainId/book/gateway')({
  component: RouteComponent,
  validateSearch: (search) => ({
    amount: Number(search.amount),
    bookingId: search.bookingId,
    passengers: search.passengers,
    scheduleId: search.scheduleId,
    from: search.from,
    to: search.to,
  }),
})

function RouteComponent() {
  return <div><PaymentGatewayPage/></div>
}