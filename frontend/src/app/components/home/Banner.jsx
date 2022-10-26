import React from "react";
import PropTypes from "prop-types";
import QueueAnim from "rc-queue-anim";
import { Button } from "antd";
import { Element } from "rc-scroll-anim";
import BannerImage from "./BannerImage";
import { assets } from "./data";

class Banner extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        isMobile: PropTypes.bool,
        navToShadow: PropTypes.func,
    };
    static defaultProps = {
        className: "banner",
    };
    render() {
        const { className, isMobile, navToShadow } = this.props;
        return (
            <Element
                component="section"
                className={`${className}-wrapper page`}
                onChange={navToShadow}
            >
                <div className={className}>
                    <div className={`${className}-img-wrapper`}>
                        {isMobile ? (
                            <img
                                width="100%"
                                src={`${assets}/image/home/intro-landscape-3a409.svg`}
                                alt=""
                            />
                        ) : (
                            <BannerImage />
                        )}
                    </div>
                    <QueueAnim
                        type={isMobile ? "bottom" : "right"}
                        className={`${className}-text-wrapper`}
                        delay={300}
                    >
                        <h1 key="h1">让数据栩栩如生</h1>
                        <p className="main-info" key="p">
                            AntV
                            是蚂蚁金服全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、无限可能的数据可视化最佳实践。
                        </p>
                        <a
                            target="_blank"
                            href="https://antv.alipay.com/zh-cn/g2/3.x/index.html"
                            key="a"
                        >
                            <Button type="primary">开始使用</Button>
                        </a>
                    </QueueAnim>
                </div>
            </Element>
        );
    }
}

export default Banner;
