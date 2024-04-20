import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TrafficLightComponent } from "./components/traffic-light/traffic-light.component";
import { TrafficService } from './services/traffic.service';
import { JunctionComponent } from "./components/junction/junction.component";
import { delay, interval, of, startWith, takeWhile } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, TrafficLightComponent, JunctionComponent]
})
export class AppComponent implements OnInit {
  title = 'smart-traffic-light';
  northCars: number = 5
  eastCars: number = 3

  constructor(private trafficService: TrafficService ){}

  ngOnInit(){

    this.trafficService.initTrafficLight(this.northCars, this.eastCars);
    this.trafficService.adjustTrafficLights();
    this.startTraffic();
    // this.checkTrafficLights();
    this.trafficService.startCarArrival();
  }

  startTraffic() {
    interval(2000) // car crossJunction time 2 seconds
      .subscribe(() => {
        if(!this.trafficService.diractionChanged){
          this.trafficService.crossJunction();
        } else {
          // Delay the execution by 1 second using RxJS delay operator
          of(this.trafficService.crossJunction()).pipe(
            delay(1000)
          ).subscribe();
        }
   
      });
  }
  checkTrafficLights(){
    interval(2000) // min time to traffic light to change
    .pipe(
      takeWhile(() => this.trafficService.northTrafficCount == 0 || this.eastCars == 0) // Continue until there are no more cars
    )
    .subscribe(() => {
      this.trafficService.adjustTrafficLights();
    });

  }

  addTraffic(diraction:string){
    this.trafficService.manuallyAddTraffic(diraction)
  }
  removeTraffic(diraction:string){
    this.trafficService.manuallyRemoveTraffic(diraction)
  }

}
