import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrl: './new-request.component.css'
})
export class NewRequestComponent {

  managerName: string | any

  constructor(
    private ticketservice: TicketService
  ) { }

  ngOnInit() {
    this.managerName = this.ticketservice.getManager()
    console.log(this.managerName)
  }
    travelForm:FormGroup = new FormGroup({
    name: new FormControl(''),
    from_location: new FormControl(''),
    to_location: new FormControl(''),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    lodging_required: new FormControl(''),
    hotel_preference: new FormControl(''),
    travel_mode: new FormControl(''),
    purpose_of_travel: new FormControl(''),
    additional_notes: new FormControl(''),
  })
ticketStatus: String=''

newTicket(){

  const ticketData = this.travelForm.value;
  
  this.ticketservice.ticketButton(ticketData).subscribe({
    next: (response:any)=>{
      this.ticketStatus = response;
      console.log(response)
      
      alert(this.ticketStatus)
      }
    })
  }

}