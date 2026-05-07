import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { environment } from './services/environment';

@Injectable({
  providedIn: 'root',
})


export class Weather {

  private apiKey = environment.openWeatherApiKey;


  private url = 'https://api.openweathermap.org/data/2.5/weather?q=Fargo,US&units=imperial&appid=${this.apiKey}';

  constructor(private http:HttpClient) {}

  getTemperature(): Observable<number> {
    return this.http.get<any>(this.url).pipe(
      map(response => Math.round(response.main.temp))
    );
  }
}