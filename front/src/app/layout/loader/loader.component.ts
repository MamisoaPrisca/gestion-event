import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../util/service/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [
    CommonModule
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  isLoading = false;
  private loaderSubscription : Subscription;

  constructor(private loaderService : LoaderService){
    this.loaderSubscription = this.loaderService.loading$.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
