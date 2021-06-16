/**
 * ユーザー機能のルーティングクラス
 *  @version 1.0
 *  @author
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminUserComponent } from './admin-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { NavigationGuardService as NavigationGuard } from '../../common/core-components/navigation/navigation-guard.service';

const GUARDS = [NavigationGuard];
export const routes: Routes = [
  {
    path: '',
    component: AdminUserComponent,
    children: [
      {
        path: '',
        redirectTo: 'user-list',
        pathMatch: 'full',
      },
      {
        path: 'user-list',
        component: UserListComponent,
        canActivate: GUARDS,
        data: {
          title: 'ユーザー一覧',
          icon: 'user'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserRoutingModule { }

