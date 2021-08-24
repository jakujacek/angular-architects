import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuggageDomainModule } from '@flight-workspace/luggage/domain';
import { LuggageUiCardModule } from '@flight-workspace/luggage/ui-card';
import { LoggerModule } from '@flight-workspace/logger-lib';
import { CheckinComponent } from './checkin.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    LoggerModule,
    LuggageDomainModule,
    LuggageUiCardModule,
    RouterModule.forChild([
      {
        path: '',
        component: CheckinComponent,
      },
    ]),
  ],
  declarations: [CheckinComponent],
  exports: [CheckinComponent],
})
export class LuggageFeatureCheckinModule {}
