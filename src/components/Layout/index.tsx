import React, { ReactNode } from "react";
import Appbar from "../Appbar";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
};

type RouteList = {
  name: string;
  route: string;
};

const routeList: RouteList[] = [
  {
    name: "Create",
    route: "/create",
  },
];

const figureRouteName = () => {
  const router = useRouter();

  const nRouteObj: RouteList = Object.create(null);
  routeList.forEach((item) => {
    if (item.route === router.pathname) {
      nRouteObj.route = item.route;
      nRouteObj.name = item.name;
    }
  });

  return nRouteObj;
};

const AppbarControl = () => {
  const titlePages = figureRouteName();
  const router = useRouter();

  if (router.pathname !== "/_error" && router.pathname !== "/") {
    return <Appbar titlePages={titlePages.name} user="Duser" />;
  }

  return <></>;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <AppbarControl />
      <main>{children}</main>
    </>
  );
}
