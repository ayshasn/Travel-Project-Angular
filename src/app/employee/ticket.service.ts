
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


// const options = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Authorization': 'Token d09c66c4592aaafd95108f22c80f9bb9a8e2d6ce'
//   })
// }



@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(
    private http: HttpClient,private router:Router){
     let dateTime = new Date() 
  }
  
  storeToken(token: any) {
    localStorage.setItem('authToken', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // logout() {
  //   localStorage.removeItem('authToken');
  //   console.log('User logged out');
  // }

  employee_login(loginData: any) {
    const loginparams = {
      username: loginData.username,
      password: loginData.password,
      expected_role: 'employee'   // Pass role for backend validation
    };
    console.log("Loginparams", loginparams);
    return this.http.post<{ token: string }>('http://127.0.0.1:8000/userlogin/', loginparams);
  }
  
  
  

  getTicketDetails(): Observable<any> {
    const token = this.getToken();
    const options = { headers: new HttpHeaders({ 'Authorization': `Token ${token}` }) };  
    return this.http.get('http://127.0.0.1:8000/employee/dashboard/', options)
  }
  ticketButton(data: any): Observable<any> {
    const token = this.getToken();
    const options = { headers: new HttpHeaders({ 'Authorization': `Token ${token}` }) }; 
    return this.http.post('http://127.0.0.1:8000/submit-request/', data, options)
  }
  deleteTicket(id: any): Observable<any> {
    const token = this.getToken();
    const options = { headers: new HttpHeaders({ 'Authorization': `Token ${token}` }) }; 
    return this.http.delete(`http://127.0.0.1:8000/employee/cancel-request/${id}/`,options);
  }
  viewRequest(requestId: number) {

    let stringRequest = <unknown>requestId
    stringRequest = <number>stringRequest
    console.log("Navigate to Request_id",stringRequest)
    let url = 'http://127.0.0.1:8000/employee/view-request/' + stringRequest
    console.log(url)

    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.get<any[]>(url,{headers});

  }

  manager_login(loginForm: FormGroup) {
    const loginparams = {
      username: loginForm.value.username,
      password: loginForm.value.password,
      expected_role:"manager"
    };
    console.log("Loginparams", loginparams)

    return this.http.post<{ token: string }>('http://127.0.0.1:8000/userlogin/', loginparams);

  }

  getRequestDetails(sortBy: string,filterEmployee:string,filterStatus:string): Observable<any> {
    const token = this.getToken();  // Assuming you have this function to get the token
    const headers = new HttpHeaders().set('Authorization',`Token ${token}` ) 
    let params = new HttpParams();

    if (sortBy) {
      params = params.set('date_sort', sortBy);
    }
    // if (filterFrom) {
    //   params = params.set('from', filterFrom);
    // }
    // if (filterTo) {
    //   params = params.set('to', filterTo);
    // }

    if (filterStatus) {
      params = params.set('status', filterStatus);
      console.log(params)
    }

    if(filterEmployee){
      params = params.set('search',filterEmployee)
    }
    return this.http.get('http://127.0.0.1:8000/manager/view-requests/', {params,headers});
  }

  storeManager(managerName: string) {
    console.log("Manager Name",managerName)
    localStorage.setItem('managerName', managerName);
  }
  getManager() {
    return localStorage.getItem('managerName');
  }


  // manager vieweing a specific request 
  viewRequestManager(requestId: number) {

    let stringRequest = <unknown>requestId
    stringRequest = <number>stringRequest
    console.log("Navigate to Request_id",stringRequest)
    let url = 'http://127.0.0.1:8000/manager/view-request/' + stringRequest
    console.log(url)

    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    
    return this.http.get<any[]>(url,{headers});

  }
  updateManagerNote(requestId: number, updateData: any) {
    const url = `http://127.0.0.1:8000/manager/action/${requestId}/`;
    const token = this.getToken();
    if (!token) {
      console.error('User not authenticated');
      return throwError(() => new Error('User not authenticated'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.put<any>(url, updateData, { headers });
  } 

}