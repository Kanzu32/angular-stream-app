import { Routes } from '@angular/router';
import { HostComponent } from './host/host.component';
import { ReadComponent } from './read/read.component';
import { CropComponent } from './crop/crop.component';

export const routes: Routes = [
    {
        path: '',
        component: HostComponent,
    },
    {
        path: 'host',
        component: HostComponent,
    },
    {
        path: 'read',
        component: ReadComponent,
    },
    {
        path: 'crop',
        component: CropComponent,
    },
];
