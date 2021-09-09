import { useState } from 'react';
import Slider from 'rc-slider';
import ExpandableContainer from './components/expandableContainer';
import MOCK_DATA from './mock.json';

import 'rc-slider/assets/index.css';
import './index.css';

function App() {

  const [row, setRow] = useState<number>(5);

  return (
    <>
      <h1>ExpandableContainer</h1>
      <p>这个组件可以自动把你希望渲染的内容进行分组，当超出指定的行数以后，多余的内容便进入到更多按钮里</p>
      <ul>
        <li>支持响应式</li>
      </ul>
      <hr />

      <h2>基本用法</h2>
      <section className='section'>
        <ExpandableContainer
          title='热门书籍'
          dataSource={MOCK_DATA}
          renderItem={(item) => <p className='renderItem'>{item}</p>
          }
        />
      </section>
      <hr />

      <h2>多行</h2>
      <div
        style={{
          width: 300,
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <span style={{ width: 50 }}>{row} 行</span>
        <Slider value={row} min={1} max={5} defaultValue={5} onChange={(row) => setRow(row)} />
      </div>
      <section className='section'>
        <ExpandableContainer
          title='年度热门书籍'
          dataSource={MOCK_DATA}
          renderItem={(item) => <p className='renderItem'>{item}</p>
          }
          line={row}
        />
      </section>
    </>
  );
}

export default App;
