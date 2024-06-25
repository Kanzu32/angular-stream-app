import { Routes } from '@angular/router';
import { ReadComponent } from './read/read.component';
import { CropComponent } from './crop/crop.component';

export const routes: Routes = [
    {
        path: '',
        component: ReadComponent,
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
