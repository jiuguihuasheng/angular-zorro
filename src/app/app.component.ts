/**
 *  ルートコンポーネント
 *  @version 1.0
 *  @author
 */
import { Component, OnInit } from '@angular/core';
import { Globals } from './common/global';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserInfo, UserInfoService } from './common/core-services/user-info.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  breadcrumbs: Array<Object>;
  constructor(
    public globals: Globals,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private titleBrow: Title,
    public userInfoService: UserInfoService
  ) {
  }

  ngOnInit() {
    this.initUserInfo();
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.globals.currentActiveRoute = event['urlAfterRedirects'];
      // ###########################################Title設定 start###########################################
      this.breadcrumbs = [];
      let currentRoute = this.activeRoute.root;
      let url = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(route => {
          if (route.outlet === 'primary') {
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            if (route.snapshot.data) {
              this.breadcrumbs.push({
                label: route.snapshot.data,
                url: url,
                routeSnapshot: routeSnapshot.url[0] ? routeSnapshot.url[0].path : false
              });
            }
            currentRoute = route;
          }
        });
      } while (currentRoute);
      if (this.breadcrumbs && this.breadcrumbs.length > 0) {
        this.globals.title = this.breadcrumbs[this.breadcrumbs.length - 1]['label']['title'];
        this.titleBrow.setTitle(this.globals.title);
        this.globals.titleIcon = this.breadcrumbs[this.breadcrumbs.length - 1]['label']['icon'];
      }
      // ###########################################Title設定 end###########################################
    });
  }

  initUserInfo = () => {
    const currentPermission = sessionStorage.getItem('currentPermission');
    if (currentPermission) {
      this.userInfoService.currPermission = currentPermission;
    } else {
      sessionStorage.setItem('currentPermission', '05');
      this.userInfoService.currPermission = '05';
    }
    this.userInfoService.token = 'token';
    this.userInfoService.userInfo = new UserInfo();
    this.userInfoService.userInfo.userName = '田中太郎様';
    this.userInfoService.userInfo.userId = '2222';
    this.userInfoService.userInfo.permissions = ['05'];
    this.userInfoService.userInfo.lastLoginTime = '2020/02/23 16:10';
  }
}
