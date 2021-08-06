import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountrySmall, Country } from '../interfaces/countries';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private term: string = "?fields=alpha3Code;name"

  get regions(): string[] {
    return [...this._regions]
  }

  private _baseUrl: string = "https://restcountries.eu/rest/v2";
  

  constructor(private http: HttpClient) { }

  getCountriesByRegion( region: string ): Observable<CountrySmall[]> {
    return this.http.get<CountrySmall[]>(`${this._baseUrl}/region/${region}${this.term}`);
  }
  
  getCountry(code: string): Observable<Country | null> {
    if(!code){
      return of(null)
    }
    return this.http.get<Country>(`${this._baseUrl}/alpha/${code}`);
  }
  
  getCountrySmall(code: string): Observable< CountrySmall > {    
        return this.http.get<CountrySmall>(`${this._baseUrl}/alpha/${code}${this.term}`);

  }

  getCountriesByBorders( borders: string[] ): Observable<CountrySmall[]> {
    const requests: Observable<CountrySmall>[] = [];
        
    if( !borders ) {
      return of([])
    }


    borders.forEach( code => {
      const request  = this.getCountrySmall(code);
      requests.push( request );
    });

    return combineLatest( requests );


  }
 

}
