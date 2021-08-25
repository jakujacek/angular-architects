import { Flight } from '@flight-workspace/flight-lib';
import { createReducer, on } from '@ngrx/store';
import { flightsLoaded, updateFlights } from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface State {
  flights: Flight[];
}

export const initialState: State = {
  flights: [],
};

export interface FlightBookingAppState {
  flightBooking: State;
}

export const reducer = createReducer(
  initialState,

  on(flightsLoaded, (state, action) => {
    const flights = action.flights;
    return { ...state, flights };
  }),

  on(updateFlights, (state, action) => {
    const flight = action.flight || state.flights[0];
    const flights = state.flights.map((f) => (f.id === flight.id ? flight : f));
    return { ...state, flights };
  })
);
