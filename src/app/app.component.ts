import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: DatabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initDB();
  }

  private async initDB() {
    try {
      await this.storageService.initDb();
    } catch (error) {
      this.router.navigate(['error']);
    }
  }
}
