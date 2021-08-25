import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { combineLatest, interval, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-lookahead',
  templateUrl: './flight-lookahead.component.html',
  styleUrls: ['./flight-lookahead.component.css'],
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {
  control: FormControl = new FormControl();
  to: FormControl = new FormControl();
  input$: Observable<string> = this.control.valueChanges;
  inputTo$: Observable<string> = this.to.valueChanges;
  flights$: Observable<Flight[]>;
  combined$: Observable<[string, string, boolean]>;
  online$: Observable<boolean>;
  diff$: Observable<number>;
  private refreshClickSubject = new Subject<void>();
  refreshClick$ = this.refreshClickSubject.asObservable();

  exitSubject = new Subject<void>();
  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.online$ = interval(2000).pipe(
      startWith(false),
      map((_) => Math.random() < 0.5),
      map((_) => true),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const debouncedInput = this.input$.pipe(
      filter((v) => v.length >= 3),
      debounceTime(300)
    );

    this.combined$ = combineLatest([
      debouncedInput,
      this.inputTo$,
      this.online$,
    ]);

    this.flights$ = merge(
      this.combined$,
      this.refreshClick$.pipe(
        map((_) => [this.control.value, this.to.value, true])
      )
    ).pipe(
      filter(([, to, online]) => online),
      switchMap((v) => this.find(v[0], v[1])),
      takeUntil(this.exitSubject)
    );
    this.diff$ = this.flights$.pipe(
      debounceTime(300),
      pairwise(),
      map(([a, b]) => {
        return Math.abs(a.length - b.length);
      })
    );
  }

  ngOnDestroy() {
    this.exitSubject.next();
  }

  find(from: string, to: string): Observable<Flight[]> {
    return this.flightService.find(from, to).pipe(
      catchError((err) => {
        console.log('err', err);
        return of([]);
      })
    );
  }

  refresh() {
    this.refreshClickSubject.next();
  }
}
