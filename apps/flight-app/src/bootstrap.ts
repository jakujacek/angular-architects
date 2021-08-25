import { AppModule } from './app/app.module';
import { bootstrap } from '@angular-architects/module-federation-tools';
import { environment } from './environments/environment';

bootstrap(AppModule, {
  production: environment.production,
});
