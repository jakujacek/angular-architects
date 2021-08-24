import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  airports: string[];
  baseUrl = `http://www.angular.at/api`;

  constructor(private http: HttpClient) {
    this.findAll().subscribe((data) => {
      this.airports = data;
    });
  }

  findAll(): Observable<string[]> {
    const url = `${this.baseUrl}/airport`;
    return this.http.get<string[]>(url);
  }
}
