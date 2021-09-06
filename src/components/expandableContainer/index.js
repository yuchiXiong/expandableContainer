/**
 * 这个组件可以自动把你希望渲染的内容进行分组，当超出指定的行数以后，多余的内容便进入到更多按钮里
 */
import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import PropTypes from 'prop-types';
import './index.css';
import 'rc-tooltip/assets/bootstrap_white.css';

const VISIBLE_TYPE = Symbol('visibleType');

class ExpandableContainer extends Component {

  constructor(props) {
    super(props);
    this.resizeTimer = null;
    this.containerRef = React.createRef(null);
    this.moreBtnRef = React.createRef(null);
  }

  componentDidMount() {
    this.resetRender();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.props.dataSource.map(item => delete item[VISIBLE_TYPE]);
      this.resetRender();
    }, 50);
  }

  // ? 写这个东西的时候产生的疑惑
  // ? 1. componentDidMount 这个生命周期里到底能不能获取 DOM 节点
  resetRender = () => {
    const { dataSource } = this.props;
    const allCustomItem = this.containerRef.current.querySelectorAll('.customItem');

    const needBeProcessItemIndex = dataSource.map((item, index) => item[VISIBLE_TYPE] === undefined && index).filter(item => item).pop();
    if (!needBeProcessItemIndex) {
      return;
    }
    
    const currentItemVisiable = Math.abs(this.moreBtnRef.current.offsetTop - this.containerRef.current.offsetTop) > Math.abs(this.moreBtnRef.current.offsetHeight - allCustomItem[0].offsetHeight);

    if (currentItemVisiable) {
      dataSource[needBeProcessItemIndex][VISIBLE_TYPE] = 'visible';
    }

    this.forceUpdate(() => {
      if (currentItemVisiable) {
        this.resetRender();
      }
    });

  }

  // getRecommendTag = () => {
  //   this.props
  //     .dispatch({
  //       type: 'tag/recommendTagsList',
  //       payload: {
  //         tagName: this.props.keyword,
  //         limit: 20
  //       }
  //     })
  //     .then(res => {
  //       if (res) {
  //         // 样式中做了媒体查询
  //         // 当屏幕宽度大于 1680 时，内容区域宽度固定为 1364
  //         // 当屏幕宽度小于等于 1680 时，内容区域固定为 1134
  //         let fullContainerWidth = 0;
  //         if (document.documentElement.clientWidth > 1680) {
  //           fullContainerWidth = 1364;
  //         } else {
  //           fullContainerWidth = 1134;
  //         }

  //         // padding 区域 40px 内边距
  //         // 右边有 50px 的右边距
  //         // 推荐标签板块的标题 65px
  //         // 推荐标签板块 右外边距 20px
  //         fullContainerWidth = fullContainerWidth - 50 - 40 - 65 - 20;

  //         // 将标签数据扁平化
  //         let recommendTagsList = [
  //           // * 下面这行代码是在数据不够的时候用来做测试的
  //           // ...Array.from(new Array(100).keys()).map(item => ({tag: `Tag_${item}`, type: ['parent', 'child', 'same_level'][Math.floor(Math.random() * 2)]})),
  //           ...res.parent.map(item => ({ tag: item, type: 'parent' })),
  //           ...res.child.map(item => ({ tag: item, type: 'child' })),
  //           ...res.same_level.map(item => ({ tag: item, type: 'same_level' }))
  //         ];

  //         // 循环给数据打标签，将直接显示，与更多里的数据分类
  //         const typeArr = ['parent', 'child', 'same_level'];
  //         let index = 0;
  //         let widthSum = 0;
  //         while (true) {
  //           if (index >= recommendTagsList.length * 3) {
  //             break;
  //           }
  //           const currentTag = recommendTagsList.filter(
  //             item => item.type === typeArr[index % 3]
  //           )[Math.floor(index / 3)];
  //           index += 1;
  //           if (typeof currentTag === 'undefined') {
  //             continue;
  //           }
  //           // 把中文字符替换为2个英文字符以减少字宽之间的误差
  //           // 内容 + 左右内边距 14px + 右外边距 8px
  //           const currentTagWidth =
  //             currentTag.tag.replace(/[\u4e00-\u9fa5]/g, '01').length * 6.5 +
  //             14 +
  //             8;

  //           // 预留 20px 用来显示更多按钮
  //           if (widthSum + currentTagWidth + 20 >= fullContainerWidth) {
  //             break;
  //           }
  //           currentTag.visible = 'normal';
  //           widthSum += currentTagWidth;
  //         }

  //         recommendTagsList = [
  //           ...recommendTagsList.filter(
  //             item => item.type === 'parent' && item.visible === 'normal'
  //           ),
  //           ...recommendTagsList.filter(
  //             item => item.type === 'same_level' && item.visible === 'normal'
  //           ),
  //           ...recommendTagsList.filter(
  //             item => item.type === 'child' && item.visible === 'normal'
  //           ),
  //           ...recommendTagsList.filter(
  //             item => item.type === 'parent' && item.visible !== 'normal'
  //           ),
  //           ...recommendTagsList.filter(
  //             item => item.type === 'same_level' && item.visible !== 'normal'
  //           ),
  //           ...recommendTagsList.filter(
  //             item => item.type === 'child' && item.visible !== 'normal'
  //           )
  //         ];

  //         this.setState({
  //           recommendTagsList
  //         });
  //       }
  //     });
  // };

  render() {
    // const COLOR_MAPPING = {
    //   parent: { color: '#395AC5', backgroundColor: '#E6F7FF' },
    //   same_level: { color: '#FF943D', backgroundColor: '#FFFBE6' },
    //   child: { color: '#42AE2E', backgroundColor: '#F6FFED' }
    // };
    // const { recommendTagsList } = this.state;

    const {
      title,
      dataSource,

      renderItem
    } = this.props;

    return (
      <div className='container' ref={this.containerRef}>
        {
          typeof title === 'string' ? <span className='title'>{title}</span> : title
        }
        {
          dataSource.filter(item => item[VISIBLE_TYPE] !== 'visible').map(item => <span className='customItem' key={item.value}>
            {renderItem(item.value)}
          </span>)
        }
        {
          (dataSource.filter(item => item[VISIBLE_TYPE] === 'visible').length > 0
            || dataSource.every(item => item[VISIBLE_TYPE] === undefined)) && <Tooltip
              placement="bottom"
              trigger={['hover']}
              overlay={<div className='moreContainer'>
                {
                  dataSource.filter(item => item[VISIBLE_TYPE] === 'visible').map(item => <span className='ustomItem' key={item.value}>
                    {renderItem(item.value)}
                  </span>)
                }
              </div>}
            >
            <button className='moreBtn' ref={this.moreBtnRef}>more</button>
          </Tooltip>
        }
        {/* {recommendTagsList.length > 0 ? (
          <div className={styles.tagsFilterBox}>
            <span className={styles.optionBox}>推荐标签：</span>
            <span>
              {recommendTagsList
                .filter(item => item.visible === 'normal')
                .map(item => {
                  return (
                    <Tag
                      onClick={() => this.props.onSearch(item.tag)}
                      style={{
                        color: COLOR_MAPPING[item.type].color,
                        backgroundColor:
                          COLOR_MAPPING[item.type].backgroundColor,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {item.tag}
                    </Tag>
                  );
                })}
              {recommendTagsList.filter(item => item.visible !== 'normal')
                .length > 0 && (
                <Popover
                  overlayStyle={{ width: 520 }}
                  content={
                    <>
                      {['parent', 'same_level', 'child']
                        .filter(
                          tagType =>
                            recommendTagsList.filter(
                              item =>
                                item.type === tagType &&
                                item.visible !== 'normal'
                            ).length > 0
                        )
                        .map(tagType => (
                          <p
                            key={tagType}
                            style={{
                              maxHeight: 56,
                              overflow: 'hidden',
                              marginBottom: 0
                            }}
                          >
                            {recommendTagsList
                              .filter(
                                item =>
                                  item.visible !== 'normal' &&
                                  item.type === tagType
                              )
                              .map(item => {
                                return (
                                  <Tag
                                    onClick={() =>
                                      this.props.onSearch(item.tag)
                                    }
                                    style={{
                                      color: COLOR_MAPPING[item.type].color,
                                      backgroundColor:
                                        COLOR_MAPPING[item.type]
                                          .backgroundColor,
                                      border: 'none',
                                      margin: 4,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {item.tag}
                                  </Tag>
                                );
                              })}
                          </p>
                        ))}
                    </>
                  }
                  placement='bottom'
                >
                  <span className={styles.moreBtn}>…</span>
                </Popover>
              )}
            </span>
          </div>
        ) : null} */}
      </div>
    );
  }
}

ExpandableContainer.defaultProps = {
  line: 1,
  dataSource: [],
  renderItem: () => { },
}

ExpandableContainer.propsType = {
  title: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]), // 标题
  line: PropTypes.number, // 显示多少行，默认1
  dataSource: PropTypes.array.isRequired, // 数据源
  renderItem: PropTypes.array.isRequired, // 每一个列表项
};

export default ExpandableContainer;
