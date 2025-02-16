export interface BreadcrumbItem {
  active: boolean;
  href: string;
  text: string;
}

export interface IPropsBreadcrumb {
  childrens?: BreadcrumbItem[];
}