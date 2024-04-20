import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, delay, interval, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  private trafficSubject = new BehaviorSubject<any>({
    northTrafficCount: 0,
    eastTrafficCount: 0,
    northToSouthGreen: true,
    eastToWestGreen: false
  });
  // Placeholder variables for traffic data
  northTrafficCount: number = 0;
  eastTrafficCount: number = 0;
  diractionChanged= false;

  // Placeholder variables for traffic light states
  northToSouthGreen: boolean = true;
  eastToWestGreen: boolean = false;

  constructor() { }

  initTrafficLight(northCars:number, eastCars:number){
    this.northTrafficCount = northCars;
    this.eastTrafficCount =  eastCars;
  }

  startCarArrival() {

    // Emit a value every 10 to 30 seconds
    interval(this.getRandomInterval()).subscribe(() => {
      // Simulate cars arriving along each road
      const randomValue = Math.round(Math.random())

      this.randomArrived();
  
    });
  }

  getRandomInterval(): number {
    // Generate a random number between 10 and 30
    return Math.floor(Math.random() * (30 - 10 + 1) + 10) * 1000; // Convert seconds to milliseconds
  }

  randomArrived() {
      // Generate a random number between 3 and 7
    const randomCars = Math.floor(Math.random() * (7 - 3 + 1) + 3)
    // Add the random number to northTrafficCount
   
    if(!this.diractionChanged){
      this.updateCars( randomCars)
    } else {
      // Delay the execution by 1 second using RxJS delay operator
      of( this.updateCars(randomCars)).pipe(
        delay(1000)
      ).subscribe();
    }
    this.adjustTrafficLights();
    this.emitData();

  }
 
  updateCars( randomCars:any){
    for(let i =0 ; i< randomCars; i++ ){
      if(Math.round(Math.random())){
        this.northTrafficCount++;
      }else{
        this.eastTrafficCount++;
      }

    }
     
  }

  manuallyAddTraffic(diraction:string) {
    if(diraction == 'fromNorth'){
      this.northTrafficCount++; 
    }else{
      this.eastTrafficCount++;
    }
 
    this.adjustTrafficLights();
    this.emitData();
  }
  manuallyRemoveTraffic(diraction:string){
    if(diraction == 'fromNorth'){
      this.northTrafficCount--; 
    }else{
      this.eastTrafficCount--;
    }
 
    this.adjustTrafficLights();
    this.emitData();

  }

  // Method to simulate cars crossing the junction
  crossJunction() {
    const removeCars = this.diractionChanged ? 0: 1;
    if (this.northToSouthGreen) {
    
      this.northTrafficCount = Math.max(0, this.northTrafficCount - removeCars);
      if( !this.northTrafficCount &&  this.eastTrafficCount ){
       // If there is no traffic on the current road but there are cars waiting at a different road
        this.adjustTrafficLights()
        return
      }
    } else if (this.eastToWestGreen) {
      this.eastTrafficCount = Math.max(0, this.eastTrafficCount - removeCars);
      if( this.northTrafficCount &&  !this.eastTrafficCount ){
        // If there is no traffic on the current road but there are cars waiting at a different road
        this.adjustTrafficLights();
        return
      }
    }
    this.diractionChanged = false
    this.emitData();
  }

  // Method to adjust traffic light timings based on traffic conditions
  adjustTrafficLights() {
    if (this.northTrafficCount >= this.eastTrafficCount) {
      this.diractionChanged = this.eastToWestGreen;
      this.northToSouthGreen = true;
      this.eastToWestGreen = false;
    } else {
      this.diractionChanged = this.northToSouthGreen;
      this.northToSouthGreen = false;
      this.eastToWestGreen = true;
    }
    this.emitData();
  }

   // Method to emit traffic data and traffic light states to subscribers
   private emitData() {
    this.trafficSubject.next({
      northTrafficCount: this.northTrafficCount,
      eastTrafficCount: this.eastTrafficCount,
      northToSouthGreen: this.northToSouthGreen,
      eastToWestGreen: this.eastToWestGreen,
      diractionChanged: this.diractionChanged,
    });
  }



  // Method to allow components to subscribe to traffic data and traffic light states
  getTrafficUpdates() {
    return this.trafficSubject.asObservable();
  }
}