/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { flightsLoaded, updateFlights } from '../+state/flight-booking.actions';
import {
  FlightBookingAppState,
} from '../+state/flight-booking.reducer';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent implements OnInit {
  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  flights$: Observable<Flight[]>;

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true,
  };

  constructor(
    private flightService: FlightService,
    private store: Store<FlightBookingAppState>
  ) {}

  ngOnInit() {
    this.flights$ = this.store.select((state) => state.flightBooking.flights);
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService
      .find(this.from, this.to, this.urgent)
      .subscribe((flights) => {
        this.store.dispatch(flightsLoaded({ flights }));
      });
  }

  delay(): void {
    this.flights$.subscribe((data) => {
      const flight = data[0];
      let oldDate = new Date(flight.date);
      let newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
      let newFlight = { ...flight, date: newDate.toISOString() };
      this.store.dispatch(updateFlights({ flight: newFlight }));
    });
  }
}
