import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";

import { trpc } from "../utils/trpc";

import { AlertCircle, ChevronDown, ChevronRight } from "react-feather";
import { Menu, Transition } from "@headlessui/react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Subscrition = {
  id: string;
  subscriptionName: string;
  currency: string;
  locale: string;
  cost: number;
  dueDate: String;
};

const sampleData: Subscrition[] = [
  {
    id: "192001",
    subscriptionName: "Spotify",
    currency: "IDR",
    locale: "id-ID",
    cost: 500000,
    dueDate: new Date("2022-07-12").toLocaleDateString(),
  },
  {
    id: "192001",
    subscriptionName: "Spotify",
    currency: "IDR",
    locale: "id-ID",
    cost: 500000,
    dueDate: new Date("2022-07-12").toLocaleDateString(),
  },
  {
    id: "192001",
    subscriptionName: "Spotify",
    currency: "IDR",
    locale: "id-ID",
    cost: 500000,
    dueDate: new Date("2022-07-12").toLocaleDateString(),
  },
  {
    id: "192001",
    subscriptionName: "Spotify",
    currency: "IDR",
    locale: "id-ID",
    cost: 500000,
    dueDate: new Date("2022-07-12").toLocaleDateString(),
  },
];

const formatCurrency = (locale: any, currency: any, value: any) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const columnHelper = createColumnHelper<Subscrition>();

const columns = [
  columnHelper.accessor("subscriptionName", {
    header: () => "Subscription Name",
  }),
  columnHelper.accessor((row) => `${row.currency} ${row.cost} ${row.locale}`, {
    id: "cost",
    header: () => "Cost",
    cell: (props) => {
      const valSplit = props.getValue().split(" ");
      return formatCurrency(valSplit[2], valSplit[0], valSplit[1]);
    },
  }),
  columnHelper.accessor("dueDate", {
    header: () => "Due Date",
  }),
];

const TableView = () => {
  const [data, setData] = useState(() => [...sampleData]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: any) => {
    console.log(row);
  };

  return (
    <>
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-zinc-900 -striped -highlight">
          <thead className="text-sm uppercase bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any, index: any) => {
              if (index % 2 != 0) {
                return (
                  <tr
                    key={row.id}
                    className="bg-white cursor-pointer hover:bg-zinc-200"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <td
                        key={cell.id}
                        className="py-4 px-6 text-zinc-900 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              } else {
                return (
                  <tr
                    key={row.id}
                    className="bg-zinc-100 cursor-pointer hover:bg-zinc-200"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <td
                        key={cell.id}
                        className="py-4 px-6 text-zinc-900 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Home: NextPage = () => {
  const nrouter = useRouter();
  return (
    <>
      <div className="container mx-auto md:mx-auto px-4 md:px-10">
        <div className="flex flex-col space-y-8">
          <div>
            <div className="flex items-center space-x-4 flex-row p-4 rounded-sm bg-emerald-300">
              <div>
                <AlertCircle />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="font-bold">Alert</div>
                <div className="">message</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <div className="flex flex-row items-center space-x-3">
              <div className="font-mono text-7xl">Rp. 0</div>
              <div>
                <button
                  onClick={() => nrouter.push("/create")}
                  type="button"
                  className="px-3 py-2 text-zinc-900 bg-zinc-200 focus:outline-none hover:bg-zinc-400 font-medium rounded-sm"
                >
                  Create New
                </button>
              </div>
            </div>
          </div>
          <div>
            <TableView />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
