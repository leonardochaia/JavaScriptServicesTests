import { Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  ngServing: boolean;
  forecasts: WeatherForecast[];
  url: string;
  error: any;
  githubData: any;
  githubError: any;

  constructor(http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {

    this.ngServing = baseUrl.indexOf('4200') !== -1;

    if (this.ngServing) {
      // being rendered from the browser
      baseUrl = baseUrl.replace('4200', '5000').replace('http://', 'http://foo.');
    }

    this.url = baseUrl + 'api/SampleData/WeatherForecasts';

    http.get<WeatherForecast[]>(this.url).subscribe(result => {
      this.forecasts = result;
    }, (error: HttpErrorResponse) => {
      this.error = `${error.status}  ${error.statusText}  ${error.message}`;
    });

    http.get<any>(`https://api.github.com/`)
      .subscribe(data => {
        this.githubData = data;
      }, (error: HttpErrorResponse) => {
        this.githubError = `${error.status}  ${error.statusText}  ${error.message}`;
      });
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
