import React from 'react';
import { Layout, Menu } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CatalogDetails from './components/CatalogDetails';
import SchemaDetails from './components/SchemaDetails';
import TableDetails from './components/TableDetails';
import VolumeDetails from './components/VolumeDetails';
import FunctionDetails from './components/FunctionDetails';
import SchemaBrowser from './components/SchemaBrowser';
import CatalogsList from './components/CatalogsList';

const router = createBrowserRouter([
  {
    path: '/',
    Component() {
      return <CatalogsList />;
    },
  },
  {
    path: '/data/:catalog',
    Component() {
      return <CatalogDetails />;
    },
  },
  {
    path: '/data/:catalog/:schema',
    Component() {
      return <SchemaDetails />;
    },
  },
  {
    path: '/data/:catalog/:schema/:table',
    Component() {
      return <TableDetails />;
    },
  },
  {
    path: '/volumes/:catalog/:schema/:volume',
    Component() {
      return <VolumeDetails />;
    },
  },
  {
    path: '/functions/:catalog/:schema/:ucFunction',
    Component() {
      return <FunctionDetails />;
    },
  },
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {/* Header */}
        <Layout.Header style={{ display: 'flex', alignItems: 'center' }}>
          <div></div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['catalogs']}
            items={[{ key: 'catalogs', label: 'Catalogs' }]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Layout.Header>
        {/* Content */}
        <Layout.Content
          style={{
            height: 'calc(100vh - 64px)',
            backgroundColor: '#fff',
            display: 'flex',
          }}
        >
          {/* Left: Schema Browser */}
          <div
            style={{
              width: '30%',
              minWidth: 260,
              maxWidth: 400,
              borderRight: '1px solid lightgrey',
            }}
          >
            <SchemaBrowser />
          </div>

          {/* Right: Main details content */}
          <div style={{ overflowY: 'scroll', flex: 1, padding: 16 }}>
            <RouterProvider
              router={router}
              fallbackElement={<p>Loading...</p>}
            />
          </div>
        </Layout.Content>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
