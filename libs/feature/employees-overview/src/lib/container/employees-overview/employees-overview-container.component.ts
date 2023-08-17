import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { EmployeesOverviewQuery } from "../../business/employees-overview/employees-overview.query";
import { EmployeesOverviewBusiness } from "../../business/employees-overview/employees-overview-business.service";
import { EmployeesOverviewSearch } from "../../business/employees-overview/employees-overview-search.model";
import { SearchMeta } from "../../data-access/standard.model";

@Component({
  selector: 'hub-feature-employees-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees-overview-container.component.html',
  styleUrls: ['./employees-overview-container.component.scss'],
})
export class EmployeesOverviewContainerComponent implements OnInit{


  constructor(private businessService: EmployeesOverviewBusiness) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    const filter: Partial<EmployeesOverviewSearch> = {
      firstName: 'Adam'
    }
    const meta: SearchMeta = {
      pagination: { index: 0, size: 10 }
    }
    this.businessService.searchEmployees$(filter, meta).subscribe(val => console.log(val))
  }



}
