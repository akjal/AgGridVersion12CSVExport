import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions, RowNode, MenuItemDef, IEnterpriseDatasource, IEnterpriseGetRowsParams,GridApi } from 'ag-grid';
import { AgGridNg2 } from 'ag-grid-angular';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('agGrid') agGrid: AgGridNg2;

  title = 'AgGrid13-ExcelExport';

  gridApi:GridApi;
  gridColumnApi;
  columnDefs = [
    {headerName: 'athlete', field: 'athlete' },
    {headerName: 'country', field: 'country' },
     {headerName: 'year', field: 'year'}
];

rowData = [
  { athlete: 'ABC', country: 'usa', year: 2018 },
  { athlete: 'BCF', country: 'uk', year: 2017 },
  { athlete: 'YTR', country: 'Germany', year: 2016 },

];

agGridOptions: GridOptions;

cacheOverflowSize:number;
maximumNumberOfCallToServer:number=0;
totalRowsLoaded:number=0;
cacheBlockSize:number;
rowModelType:any;


constructor(private http: HttpClient) {
  this.rowModelType= 'enterprise';
  this.cacheBlockSize= 100;

  var gridOptions  = {
    defaultColDef: {
      width: 120,
      resizable: true
  },
  columnDefs: this.columnDefs,
  rowData : this.rowData
  }
  this.agGridOptions = gridOptions;
}
loadData()
    {
      if(this.agGridOptions && this.agGridOptions.api)
      {
            this.agGrid.api.setEnterpriseDatasource(this.dataSource);

      }
    }


    dataSource: IEnterpriseDatasource = {
      getRows: (params: IEnterpriseGetRowsParams) => {
        this.apiService().subscribe(data => {
         var rowsThisPage = data.slice(params.request.startRow,params.request.startRow+params.request.endRow);
         this.totalRowsLoaded = this.totalRowsLoaded + this.cacheBlockSize;
         var lastRow = this.maximumNumberOfCallToServer >10 ? this.totalRowsLoaded : -1;
         this.maximumNumberOfCallToServer++;        
          params.successCallback(
            rowsThisPage,
            lastRow
        );
        })
      }
    }
  
    apiService():any {    
    
    return this.http
    .get("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"); 
      
    }
    onGridReady(params: any) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
             this.gridApi.setEnterpriseDatasource(this.dataSource);
      
    }

    exportCSV()
    {
      this.gridApi.exportDataAsCsv();      
    }
}
