import { Component, Input, OnInit } from '@angular/core';
import { TrafficService } from '../../services/traffic.service';

@Component({
  selector: 'app-traffic-light',
  standalone: true,
  imports: [],
  templateUrl: './traffic-light.component.html',
  styleUrl: './traffic-light.component.scss'
})
export class TrafficLightComponent implements OnInit {
  @Input() name: string = ''; // Input property to specify the name of the traffic light
  @Input() redOn = false;
  @Input() yellowOn = false;
  @Input() greenOn = false;

  constructor(private trafficService: TrafficService) { }

  ngOnInit(): void {
    // Subscribe to traffic updates
    this.trafficService.getTrafficUpdates().subscribe((data: any) => {
      // Update traffic light state based on data received from the service
      this.redOn = this.name === 'N-S' ? !data.northToSouthGreen : data.northToSouthGreen;
      this.greenOn = this.name === 'N-S' ? data.northToSouthGreen : !data.northToSouthGreen;
      this.yellowOn = data.diractionChanged
      if( this.greenOn && this.yellowOn){
      this.greenOn =false;
      this.redOn = true;
      }else if( this.redOn && this.yellowOn) {
      this.redOn = false;
      }
    });
  }
}
