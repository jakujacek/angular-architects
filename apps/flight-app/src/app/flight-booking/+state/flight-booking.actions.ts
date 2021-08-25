import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';

export const flightsLoaded = createAction(
  '[FlightBooking] Load FlightBookings Success',
  props<{ flights: Flight[] }>()
);

export const updateFlights = createAction(
  '[FlightBooking] Load FlightBookings Success',
  props<{ flight: Flight }>()
);
