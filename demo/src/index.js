import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SKU from '../../src';

import 'zent/css/index.css';
import '../../src/styles/index.scss';
import './styles/index.scss';

const skuTree = [
  {
    id: 10740,
    text: '颜色',
  },
  {
    id: 40732,
    text: '尺寸',
  },
];

const sku = [
  {
    id: 3,
    text: '蓝色',
  },
  {
    id: 10,
    text: '红色',
  },
  {
    id: 30,
    text: '绿色',
  },
  {
    id: 137,
    text: '黑色',
  },
  {
    id: 138,
    text: '灰色',
  },
];

const value = [
  {
    "id": 10740,
    "text": "颜色",
    "value": 10740,
    "leaf": [
      {
        "id": 3,
        "text": "蓝色",
        "value": 3,
        "is_show": false
      },
      {
        "id": 10,
        "text": "红色",
        "value": 10,
        "is_show": false
      },
      {
        "id": 30,
        "text": "绿色",
        "value": 30,
        "is_show": false
      }
    ]
  },
  {
    "id": 40732,
    "text": "尺寸",
    "value": 40732,
    "leaf": [
      {
        "id": 30,
        "text": "绿色",
        "value": 30,
        "is_show": false
      },
      {
        "id": 3,
        "text": "蓝色",
        "value": 3,
        "is_show": false
      }
    ]
  }
]

class Simple extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: value
    }
  }

  fetchSKUTree() {
    return new Promise(resolve => {
      resolve(skuTree);
    });
  }

  fetchSKU() {
    return new Promise(resolve => {
      resolve(sku);
    });
  }

  render() {
    const { value } = this.state;
    return <SKU disabled value={value} onChange={(res) => {
      this.setState(value);
    }} onFetchGroup={this.fetchSKUTree} onFetchSKU={this.fetchSKU} />;
  }
}

ReactDOM.render(<Simple />, document.querySelector('#demo'));
