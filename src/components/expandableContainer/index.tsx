/**
 * 这个组件可以自动把你希望渲染的内容进行分组，当超出指定的行数以后，多余的内容便进入到更多按钮里
 */
import React, { Component, RefObject } from 'react';
import Tooltip from 'rc-tooltip';
import './index.css';
import 'rc-tooltip/assets/bootstrap_white.css';

interface dataSourceInterface {
  value: string
}

interface IProps {
  dataSource: Array<dataSourceInterface> | [],
  title: JSX.Element | string,
  renderItem: (val: string) => React.ReactNode,
  line?: number
}

interface IState {
  dataSourceByGroup: Array<Array<dataSourceInterface>>
}

class ExpandableContainer extends Component<IProps, IState> {

  containerRef: RefObject<HTMLDivElement>; // 容器 DOM 节点
  titleContainerRef: RefObject<HTMLDivElement>; // 标题 DOM 节点
  moreContainerRef: RefObject<HTMLDivElement>;
  moreBtnRef: RefObject<HTMLButtonElement>;
  resizeTimer: NodeJS.Timeout | null;

  constructor(props: IProps) {
    super(props);
    this.containerRef = React.createRef<HTMLDivElement>(); // 容器 DOM 节点
    this.titleContainerRef = React.createRef<HTMLDivElement>(); // 标题 DOM 节点
    this.moreContainerRef = React.createRef<HTMLDivElement>();
    this.moreBtnRef = React.createRef<HTMLButtonElement>();
    this.resizeTimer = null;
    this.state = {
      dataSourceByGroup: []
    }
  }

  componentDidMount() {
    this.dataSourceGroupByViewport();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.line !== this.props.line || prevProps.dataSource !== this.props.dataSource) {
      this.setState({
        dataSourceByGroup: []
      }, () => this.dataSourceGroupByViewport());
    }
  }

  handleResize = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      this.setState({
        dataSourceByGroup: []
      }, () => this.dataSourceGroupByViewport());
    }, 100);
  }

  /**
   * 对数据进行分组
   * 
   * @returns {number} splitIndex - 分割位下标
   */
  dataSourceGroupByViewport = (): void => {
    const { dataSourceByGroup } = this.state;
    const { dataSource, line = 1 } = this.props;

    const containerDOM = this.containerRef.current;
    const titleContainerWidth = this.titleContainerRef.current?.offsetWidth ?? 0;
    const customItemDOMs = this.containerRef.current?.querySelectorAll('.customItem') ?? [];
    const moreBtnDOM = this.moreBtnRef.current;

    if (!containerDOM || customItemDOMs.length === 0 || !moreBtnDOM) {
      return;
    }

    let widthTotal: number = 0;
    let groupIndex: number = 0;

    for (let i = 0; i < customItemDOMs.length; i += 1) {
      const current = customItemDOMs[i];
      widthTotal += current.clientWidth;

      const currentRowContainerWidth = widthTotal + (groupIndex === line - 1 ? moreBtnDOM?.clientWidth : 0) + (groupIndex === 0 ? titleContainerWidth : 0);


      if (containerDOM?.clientWidth <= currentRowContainerWidth) {
        widthTotal = current.clientWidth;
        groupIndex !== line && (groupIndex += 1);
        console.log('!');
      }
      dataSourceByGroup[groupIndex] = (dataSourceByGroup[groupIndex] || []).concat(dataSource[i]);
    }

    this.setState({
      dataSourceByGroup: [...dataSourceByGroup],
    });
  }

  renderTitle = (): React.ReactNode => {
    const { title } = this.props;
    if (typeof title === 'string') {
      return <span>{title}</span>
    } else {
      return title;
    }
  }

  render() {

    const {
      dataSource,
      renderItem,
      line = 1
    } = this.props;

    const {
      dataSourceByGroup,
    } = this.state;

    return (
      <div className='container' ref={this.containerRef}>
        <div ref={this.titleContainerRef}>
          {this.renderTitle()}
        </div>
        {
          (dataSourceByGroup.length > 0
            ? [...dataSourceByGroup].splice(0, line).flat()
            : dataSource).map(item => <span className='customItem' key={item.value}>
              {renderItem(item.value)}
            </span>)
        }

        {(dataSourceByGroup.length === 0 || dataSourceByGroup.length > line) && <Tooltip
          placement="bottom"
          trigger={['hover']}
          overlay={<div className='moreContainer' ref={this.moreContainerRef}>
            {
              dataSourceByGroup.length > 0 && dataSourceByGroup[dataSourceByGroup.length - 1].map(item => <span className='customItem' key={item.value}>
                {renderItem(item.value)}
              </span>)
            }
          </div>}
        >
          <button className='moreBtn' ref={this.moreBtnRef}>more</button>
        </Tooltip>}

      </div>
    );
  }
}

export default ExpandableContainer;
