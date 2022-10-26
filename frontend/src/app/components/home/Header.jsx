import React from 'react';
import { Button } from 'antd';

export default function Header(props) {
  return (
    <header {...props}>
      <a className="logo-wrapper" href="https://antv.alipay.com/zh-cn/index.html" target="_blank">
        <i className="logo" />
        <span>AntV</span>
      </a>
      <div className="button">
        <Button>返回旧版</Button>
      </div>
    </header>
  );
}
