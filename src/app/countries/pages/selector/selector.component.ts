import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country, CountrySmall } from '../../interfaces/countries';
import { delay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  countriesForm: FormGroup = this.fb.group({
    region          : ['', Validators.required],
    country         : ['', Validators.required],
    borderCountries : ['', Validators.required]
  })

  regions: string[] = []
  countries: CountrySmall[] = [];
  countriesBorders: CountrySmall[] = [];
  

  loading: boolean = false;

  constructor( private fb: FormBuilder,
              private countriesService: CountriesService) { 
  }


  ngOnInit(): void {
    this.regions = this.countriesService.regions;
    console.log(this.regions)

    this.countriesForm.get('region')?.valueChanges
        .pipe(
          tap(( _ ) => this.countriesForm.get('country')?.reset('')),
          tap(() => this.loading = true),
          delay(1000),
          switchMap(region => this.countriesService.getCountriesByRegion(region))
          )
        .subscribe(countries => {
          this.countries = countries;
          this.loading = false;
          // console.log(this.countries);
        });
        
    this.countriesForm.get('country')?.valueChanges
    .pipe(
      tap(() => this.countriesForm.get('borderCountries')?.reset('')),
          tap(() => this.loading = true),
          switchMap(alphaCode => this.countriesService.getCountry(alphaCode)),
          switchMap( country => this.countriesService.getCountriesByBorders(country?.borders!) )
          )
        .subscribe(countries => {
          this.countriesBorders = countries || [];
          this.loading = false;
          // console.log(this.country?.borders)
        });
  }      
          
  save() {
    console.log("hola")
  }

}
