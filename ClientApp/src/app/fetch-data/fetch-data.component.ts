import { Component, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  ngServing: boolean;
  public forecasts: WeatherForecast[];
  public url: string;
  public error: any;

  constructor(http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {

    this.ngServing = baseUrl.indexOf('4200') !== -1;

    if (this.ngServing) {
      // being rendered from the browser
      baseUrl = baseUrl.replace('4200', '5000').replace('http://', 'http://foo.');
    }

    this.url = baseUrl + 'api/SampleData/WeatherForecasts';
    console.log(this.url);

    http.get<WeatherForecast[]>(this.url).subscribe(result => {
      this.forecasts = result;
    }, (error: HttpErrorResponse) => {
      console.error(error);
      this.error = `${error.status}  ${error.statusText}  ${error.message}`;
    });

  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
