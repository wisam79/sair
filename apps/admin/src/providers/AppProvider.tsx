"use client";

import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider, RefineSnackbarProvider } from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider } from "@refinedev/supabase";
import { authProvider } from "./authProvider";
import { supabaseClient } from "./supabaseClient";
import { Suspense } from "react";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RefineKbarProvider>
      <RefineSnackbarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "profiles",
                list: "/profiles",
                show: "/profiles/show/:id",
                meta: { label: "Users" },
              },
              {
                name: "routes",
                list: "/routes",
                create: "/routes/create",
                edit: "/routes/edit/:id",
                show: "/routes/show/:id",
                meta: { label: "Routes" },
              },
              {
                name: "trips",
                list: "/trips",
                meta: { label: "Live Trips" },
              },
              {
                name: "subscriptions",
                list: "/subscriptions",
                meta: { label: "Subscriptions" },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            {children}
          </Refine>
        </Suspense>
      </RefineSnackbarProvider>
    </RefineKbarProvider>
  );
};
