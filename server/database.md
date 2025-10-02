# Database

## Models

1. User
2. Train
3. Station
4. Coach
5. Seat
6. Route
7. Reservations
8. Tickets

### User

| Field    | Type   | Description |
| -------- | ------ | ----------- |
| id       | uuid   |
| email    | string |             |
| password | string |             |
| name     | string |             |

### Train

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | uuid   |             |
| name  | string |             |
| code  | string |             |

### Station

| Field | Type   | Description |
| ----- | ------ | ----------- |
| id    | uuid   |             |
| name  | string |             |
| code  | string |             |
| city  | string |             |

### Coach

| Field   | Type   | Description |
| ------- | ------ | ----------- |
| id      | uuid   |             |
| trainId | uuid   |             |
| type    | string |             |
| code    | string |             |
| seats   | number |             |

### Seat

| Field   | Type   | Description |
| ------- | ------ | ----------- |
| id      | uuid   |             |
| coachId | uuid   |             |
| trainId | uuid   |             |
| number  | number |             |

### Route

| Field                | Type | Description |
| -------------------- | ---- | ----------- |
| id                   | uuid |             |
| trainId              | uuid |             |
| sourceStationId      | uuid |             |
| destinationStationId | uuid |             |

### Reservations

| Field   | Type | Description |
| ------- | ---- | ----------- |
| id      | uuid |             |
| userId  | uuid |             |
| routeId | uuid |             |
| seatId  | uuid |             |
| date    | date |             |

### Tickets

| Field   | Type | Description |
| ------- | ---- | ----------- |
| id      | uuid |             |
| userId  | uuid |             |
| trainId | uuid |             |
| routeId | uuid |             |
| seatId  | uuid |             |
| date    | date |             |
