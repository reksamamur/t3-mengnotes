import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

type Props = {
  user: string;
  titlePages?: string;
};

type Breads = {
  bread?: string;
};

const menuOptions = [
  {
    id: "01",
    name: "Profile",
    href: "/profile",
  },
  {
    id: "02",
    name: "Settings",
    href: "/settings",
  },
  {
    id: "03",
    name: "Sign out",
    href: "",
  },
];

const Breads = ({ bread }: Breads) => {
  if (bread) {
    return (
      <li aria-current="page">
        <div className="flex items-center">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="ml-2 text-zinc-900">{bread}</span>
        </div>
      </li>
    );
  }
  return null;
};

const Appbar = ({ titlePages, user }: Props) => {
  return (
    <>
      <nav className="sticky top-0 z-10 border-b border-zinc-100 backdrop-filter backdrop-blur-lg bg-opacity-30 firefox:bg-opacity-90 bg-white h-28 pt-10">
        <div className="container mx-auto md:mx-auto px-4 md:px-10">
          <div className="flex flex-row justify-between items-center align-middle">
            <nav
              className="flex py-3 font-medium text-xl"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a
                    href="/home"
                    className="inline-flex items-center hover:border-b-2 border-zinc-900 "
                  >
                    Menotes
                  </a>
                </li>
                <Breads bread={titlePages} />
              </ol>
            </nav>
            <div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex justify-center rounded-sm ring-1 ring-zinc-500 items-center hover:bg-zinc-200 cursor-pointer space-x-4 p-1 bg-white px-2 py-1 text-sm font-normal text-zinc-900">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://i.pravatar.cc/150?img=10"
                      alt=""
                    />
                    <div className="hidden md:block pr-3">
                      <div>{user}</div>
                    </div>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-sm bg-white ring-1 ring-zinc-500">
                    {menuOptions.map((item) => (
                      <Menu.Item key={item.id}>
                        {({ active }) => (
                          <a
                            className={`${
                              active ? "bg-zinc-200" : "text-zinc-900"
                            } group flex w-full items-center rounded-sm px-2 py-2 text-sm`}
                            href={item.href}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Appbar;
