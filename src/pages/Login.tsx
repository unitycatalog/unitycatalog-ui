import { Flex, Layout, Typography } from 'antd';
import React from 'react';

export default function() {
  return (
    <Layout hasSider={false} style={{ height: '100vh', width: '100vw', background: 'linear-gradient(#131D35,#252342,#1E2E3A)'}}>
        <Flex vertical={true} align={'center'} justify={'center'} gap={'middle'} style={{ height: '100%', width: '100%'}}>
          <div>
            <img
              src="/uc-logo-horiz-reverse.svg"
              height={32}
              alt="uc-logo-horizontal"
            />
          </div>
          <div style={{ height: 276, width: 400, backgroundColor: '#F6F7F9', borderRadius: '16px'}}>
            <Flex vertical={true} align={'center'} justify={'center'} gap={'middle'}  style={{ padding: 24 }}>
                <Typography.Title level={4}>Login to Unity Catalog</Typography.Title>
            </Flex>
          </div>
        </Flex>
    </Layout>
  );
}