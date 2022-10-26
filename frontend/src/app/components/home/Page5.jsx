import React from 'react';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';
import { page5 } from './data';

export default function Page5() {
  const children = page5.map((img, i) => (
    <Col
      key={i.toString()}
      md={6}
      sm={8}
      xs={24}
      style={{
          height: 80,
      }}
    >
      <img width={220} src={img} alt="" />
    </Col>
  ));
  return (
    <OverPack component="section" className="page-wrapper page5 text-center">
      <QueueAnim
        type="bottom"
        leaveReverse
        className="page"
        key="a"
      >
        <h2 key="h2">2000+用户正在使用</h2>
        <span className="separator" key="span" />
        <Row
          className="page text-center"
          key="a"
        >
          {children}
        </Row>
      </QueueAnim>
    </OverPack>
  );
}
