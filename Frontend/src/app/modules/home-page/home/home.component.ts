import { JwtService } from '@/app/shared/services/utils/jwt.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  RouteReuseStrategy,
  Router,
NavigationEnd
} from '@angular/router';
import { AuthService } from 'src/app/shared/services/api/auth.service';

interface MenuItem {
  name: string;
  icon: string;
  router: string[];
  role: string;
}

const ICON_USER = 'fa fa-user';
const ICON_CHILD = 'fa fa-child';
const ICON_BUILDING = 'fa fa-building';
const ICON_CHALKBOARD_USER = 'fa-solid fa-chalkboard-user';
const ICON_LIST_CHECK = 'fas fa-list-check';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public mainMenu: MenuItem[] = [];
  public isMenuOpen = false;
  public institution?: string;
  public name?: string;
  public role?: string;
  public id?: string;
  public isRouteActive: boolean=false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceAuth: AuthService,
  ) {}

 
  
  ngOnInit(): void {
    this.isRouteActive = this.router.url === '/';
    this.getDataToken();
    this.buildMenu();
  }


  goToView(ruta: any): void {
    this.isRouteActive =false;
    const url = this.router
      .createUrlTree(ruta, { relativeTo: this.route })
      .toString();
    if (this.router.url === url) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl(url);

    this.isRouteActive = this.router.url === '/';
      });
    this.toggleMenu();
    } else {
      this.router.navigate(ruta, { relativeTo: this.route });


    this.toggleMenu();
    }
  }

  getDataToken() {
    this.id = this.serviceAuth.getUserId();
    this.name = this.serviceAuth.getUserName();
    this.role = this.serviceAuth.getUserRole();
    this.institution = this.serviceAuth.getInstitution();
  }
  // Build the menu
  buildMenu(): void {
    this.mainMenu = [
      {
        name: 'Usuarios',
        icon: ICON_USER,
        router: ['usuarios', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Instituciones',
        icon: ICON_BUILDING,
        router: ['institucion', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'DECE',
        icon: ICON_BUILDING,
        router: ['dece', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Docentes',
        icon: ICON_BUILDING,
        router: ['docente', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Estudiantes',
        icon: ICON_CHILD,
        router: ['estudiante', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Test Estudiantes',
        icon: ICON_LIST_CHECK,
        router: ['test', 'estudiante', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Test Docentes',
        icon: ICON_LIST_CHECK,
        router: ['test', 'question', 'listar'],
        role: 'ADMIN',
      },
      {
        name: 'Casos',
        icon: ICON_BUILDING,
        router: ['casos', 'listar'],
        role: 'DECE',
      },
      {
        name: 'Docentes',
        icon: ICON_BUILDING,
        router: ['casos','docentes'],
        role: 'DECE',
      },
      {
        name: 'Test Estudiantes',
        icon: ICON_LIST_CHECK,
        router: ['caso', 'estudiante', 'listar'],
        role: 'DECE',
      },
      {
        name: 'Test Docentes',
        icon: ICON_LIST_CHECK,
        router: ['caso', 'docente', 'listar'],
        role: 'DECE',
      },
      {
        name: 'Casos Asignados',
        icon: ICON_CHALKBOARD_USER,
        router: ['test', 'listar'],
        role: 'TEACHER',
      },
    ];
  }

  logouth () {
    this.serviceAuth.logout();
  };

  toggleMenu () {
    this.isMenuOpen = !this.isMenuOpen;
  };
}
