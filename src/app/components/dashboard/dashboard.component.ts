import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuantityService } from '../../services/quantity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  selectedType = 'LENGTH';
  selectedOperation = 'ADD';

  units: string[] = ['FEET', 'INCHES', 'CENTIMETERS'];

  input = {
    thisQuantityDTO: {
      value: 0,
      unit: 'FEET',
      measurementType: 'LENGTH'
    },
    thatQuantityDTO: {
      value: 0,
      unit: 'INCHES',
      measurementType: 'LENGTH'
    }
  };

  result: any = null;
  historyList: any[] = [];

  constructor(
    private service: QuantityService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //  TYPE CHANGE
  onTypeChange() {

    switch(this.selectedType) {
      case 'LENGTH':
        this.units = ['FEET', 'INCHES', 'CENTIMETERS', 'YARDS'];
        break;
      case 'WEIGHT':
        this.units = ['KILOGRAM', 'GRAM', 'POUND'];
        break;
      case 'VOLUME':
        this.units = ['LITRE', 'MILLILITRE', 'GALLON'];
        break;
      case 'TEMPERATURE':
        this.units = ['CELSIUS', 'FAHRENHEIT'];
        break;
    }

    this.input.thisQuantityDTO.measurementType = this.selectedType;
    this.input.thatQuantityDTO.measurementType = this.selectedType;

    this.input.thisQuantityDTO.unit = this.units[0];
    this.input.thatQuantityDTO.unit = this.units[1] || this.units[0];

    this.cdr.detectChanges();
  }

  //  CALCULATE
  calculate(op: string) {

    this.historyList = [];
    this.result = null;
    this.cdr.detectChanges(); //  reset reflect karne ke liye

    let apiCall;

    switch(op) {
      case 'ADD': apiCall = this.service.add(this.input); break;
      case 'SUBTRACT': apiCall = this.service.subtract(this.input); break;
      case 'COMPARE': apiCall = this.service.compare(this.input); break;
      case 'CONVERT': apiCall = this.service.convert(this.input); break;
      case 'DIVIDE': apiCall = this.service.divide(this.input); break;
    }

    apiCall?.subscribe({
      next: (res: any) => {

        if (op === 'COMPARE') {
          const compareValue = res.resultValue;

          this.result = compareValue == 1
            ? "Quantities Are Equal!"
            : "Quantities Are Not Equal!";
        } else {
          this.result = res;
        }

        this.cdr.detectChanges(); //  final update
      },
      error: () => {
        this.result = "Something went wrong";
        this.cdr.detectChanges();
      }
    });
  }

  //  HISTORY



loadHistory() {
  const token = localStorage.getItem('token');
  console.log(token);
  
  if (!token) {
    this.result = "Please login first to view history";
    this.historyList = [];
    this.cdr.detectChanges();
    return;
  }

  this.result = null;       // result hide
  this.historyList = [];    // reset

  this.service.getHistory(this.selectedOperation, token).subscribe({
    next: (res: any) => {
      if (!res || res.length === 0) {
        this.result = "No history found";
        this.historyList = [];
      } else {
        this.historyList = res;   //  store array
      }

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Error loading history:", err);
      this.result = "Error loading history";
      this.historyList = [];
      this.cdr.detectChanges();
    }
  });
}

  //  COUNT
  loadCount() {

    this.historyList = [];
    this.result = null;
    this.cdr.detectChanges();

    this.service.getCount(this.selectedOperation).subscribe({
      next: (res) => {
        this.result = `${this.selectedOperation} Count: ${res}`;
        this.cdr.detectChanges();
      },
      error: () => {
        this.result = "Error loading count";
        this.cdr.detectChanges();
      }
    });
  }

  //  SELECT TYPE
  selectType(type: string) {

    this.selectedType = type;

    this.result = null;
    this.historyList = [];

    this.onTypeChange();
    this.cdr.detectChanges();
  }

  //  LOGOUT
  // logout() {
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  // }


//   ngOnInit() {
//   const token = this.route.snapshot.queryParamMap.get('token');

//   if (token) {
//     console.log("Google Token Received:", token);

//     localStorage.setItem('token', token);

    
//     this.router.navigate([], {
//       queryParams: {},
//       replaceUrl: true
//     });
//   }
// }
// }

isLoggedIn = false;
logout() {
  localStorage.removeItem("token");
  this.isLoggedIn = false;   // UI update instantly
  window.location.href = "/login";
}

ngOnInit() {
  const token = this.route.snapshot.queryParamMap.get('token');

  if (token) {
    console.log("Google Token Received:", token);

    localStorage.setItem('token', token);

    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true
    });
  }

  // IMPORTANT: always check login state
  this.isLoggedIn = !!localStorage.getItem('token');
}

goToLogin() {
  this.router.navigate(['/login']);
}
}