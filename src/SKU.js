import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Notify from 'zent/es/notify';
import { I18nReceiver as Receiver } from 'zent/es/i18n';

import SKUGroup from './components/SKUGroup';
import SKUButton from './components/SKUButton';

const noop = res => res;

const noopPromise = () => new Promise(noop);
class SKU extends PureComponent {
  static childContextTypes = {
    prefix: PropTypes.string,
    maxSKUTextLength: PropTypes.number,
    maxLeafTextLength: PropTypes.number,
    optionValue: PropTypes.string,
    optionText: PropTypes.string,
    onFetchSKU: PropTypes.func,
    onCreateGroup: PropTypes.func,
    onCreateSKU: PropTypes.func,
  };

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.array,
    disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    maxSize: PropTypes.number,
    maxSKUTextLength: PropTypes.number,
    maxLeafTextLength: PropTypes.number,
    skuTree: PropTypes.array,
    optionValue: PropTypes.string,
    optionText: PropTypes.string,
    onFetchGroup: PropTypes.func,
    onFetchSKU: PropTypes.func,
    onCreateGroup: PropTypes.func,
    onCreateSKU: PropTypes.func,
    onChange: PropTypes.func,
    prefix: PropTypes.string,
    isShowAddSkuImage: PropTypes.bool,
    customBtn: PropTypes.node
  };

  static defaultProps = {
    className: '',
    value: [],
    maxSize: 3,
    maxSKUTextLength: 4,
    maxLeafTextLength: 20,
    skuTree: [],
    optionValue: 'id',
    optionText: 'text',
    onFetchGroup: noopPromise,
    onFetchSKU: noopPromise,
    onCreateGroup: noopPromise,
    onCreateSKU: noopPromise,
    onChange: noop,
    prefix: 'zent',
    isShowAddSkuImage: true,
    customBtn: null
  };

  constructor(props) {
    super(props);
    this.state = {
      skuTree: [].concat(props.skuTree),
      data: props.value,
    };
  }

  getChildContext() {
    return {
      prefix: `${this.props.prefix}-sku`,
      maxSKUTextLength: this.props.maxSKUTextLength,
      maxLeafTextLength: this.props.maxLeafTextLength,
      optionValue: this.props.optionValue,
      optionText: this.props.optionText,
      onFetchSKU: this.props.onFetchSKU,
      onCreateGroup: this.props.onCreateGroup,
      onCreateSKU: this.props.onCreateSKU,
    };
  }

  componentWillMount() {
    const { onFetchGroup } = this.props;
    if (typeof onFetchGroup === 'function') {
      onFetchGroup().then(skuTree => {
        this.setState({ skuTree: [].concat(skuTree) });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value,
    });
  }

  addSKU = () => {
    let { data } = this.state;
    data.push({
      leaf: [],
    });
    data = [].concat(data);
    this.setState({ data });
  };

  rebuildSKU = i18n => (sku, index) => {
    let { optionValue } = this.props;
    let { data, skuTree } = this.state;
    if (
      data.some(
        (item, idx) => item[optionValue] === sku[optionValue] && index !== idx
      )
    ) {
      Notify.error(i18n.notify);
      data = [].concat(data);
      this.setState({ data });
      return false;
    }
    if (data[index]) {
      data[index] = sku;
    } else {
      data.push(sku);
    }
    if (!skuTree.some(item => item[optionValue] === sku[optionValue])) {
      skuTree.push(sku);
      this.setState({ skuTree: [].concat(skuTree) });
    }
    data = [].concat(data);

    this.setState({ data });
    this.props.onChange(data);
  };

  deleteSKU(index) {
    let { data } = this.state;
    data.splice(index, 1);
    data = [].concat(data);
    this.setState({ data });
    this.props.onChange(data);
  }

  render() {
    const { className, prefix, maxSize, onCreateGroup, disabled, isShowAddSkuImage, customBtn } = this.props;

    const { skuTree, data } = this.state;

    return (
      <Receiver componentName="Sku">
        {i18n => (
          <div className={cx(`${prefix}-sku`, className)}>
            {data.map((item, index) => (
              <SKUGroup
                key={index}
                index={index}
                sku={item}
                i18n={i18n}
                isShowAddSkuImage={isShowAddSkuImage}
                skuTree={skuTree}
                onSKUChange={this.rebuildSKU(i18n)}
                onSKUDelete={this.deleteSKU.bind(this, index)}
                onSKUCreate={onCreateGroup}
              />
            ))}
            {data.length < maxSize && (
              <SKUButton
                onClick={this.addSKU}
                i18n={i18n}
                customBtn={ data.length ? customBtn : null}
                disabled={disabled}
              />
            )}
          </div>
        )}
      </Receiver>
    );
  }
}

export default SKU;
