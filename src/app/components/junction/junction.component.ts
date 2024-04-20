import { Component, Input, OnInit } from '@angular/core';
import { TrafficService } from '../../services/traffic.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-junction',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './junction.component.html',
  styleUrl: './junction.component.scss'
})
export class JunctionComponent implements OnInit{
   northCars:number =0;
   eastCars:number =0;
   northToSouthGreen: boolean = false;
   yellowLight= false;

   constructor(private trafficService: TrafficService) { }

   ngOnInit(): void {
    // Subscribe to traffic updates
    this.trafficService.getTrafficUpdates().subscribe((data: any) => {
      this.northCars = data.northTrafficCount;
      this.eastCars = data.eastTrafficCount;
      this.northToSouthGreen = data.northToSouthGreen;
      this.yellowLight = data.diractionChanged
    });
  }

}
