import React from 'react';
import { connect } from 'react-redux';

import './styles.css';
import itemTypes from './itemTypes';


class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: false,
      itemInstanceId: false,
      table: false
    };

    this.tooltip = React.createRef();
    this.touchMovement = false;
    this.mouseMoveXY = {
      x: 0,
      y: 0
    }
  }

  mouseMove = e => {
    let x = 0;
    let y = 0;
    let offset = 0;
    let tooltipWidth = 384;
    let tooltipHeight = this.state.hash ? this.tooltip.current.clientHeight : 0;
    let scrollbarAllowance = 24;

    x = e.clientX;
    y = e.clientY + offset;

    if (x + tooltipWidth + scrollbarAllowance > window.innerWidth) {
      x = x - tooltipWidth - offset;
    } else {
      x = x + offset;
    }

    if (y + tooltipHeight > window.innerHeight) {
      y = y - tooltipHeight - offset;
    }
    y = y < 0 ? 0 : y;

    if (this.state.hash) {
      this.mouseMoveXY = {
        x,
        y
      }
      this.tooltip.current.style.cssText = `top: ${y}px; left: ${x}px`;
    }
  };

  bindings = () => {
    let toolTipples = document.querySelectorAll('.tooltip');
    toolTipples.forEach(item => {
      item.addEventListener('mouseenter', e => {
        if (e.currentTarget.dataset.itemhash) {
          this.setState({
            hash: e.currentTarget.dataset.itemhash,
            itemInstanceId: e.currentTarget.dataset.iteminstanceid,
            table: e.currentTarget.dataset.table ? e.currentTarget.dataset.table : false
          });
        }
      });
      item.addEventListener('mouseleave', e => {
        this.setState({
          hash: false,
          itemInstanceId: false,
          table: false
        });
      });
      item.addEventListener('touchstart', e => {
        this.touchMovement = false;
      });
      item.addEventListener('touchmove', e => {
        this.touchMovement = true;
      });
      item.addEventListener('touchend', e => {
        if (!this.touchMovement) {
          if (e.currentTarget.dataset.itemhash) {
            this.setState({
              hash: e.currentTarget.dataset.itemhash,
              itemInstanceId: e.currentTarget.dataset.iteminstanceid,
              table: e.currentTarget.dataset.table ? e.currentTarget.dataset.table : false
            });
          }
        }
      });
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.location && prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        hash: false,
        itemInstanceId: false,
        table: false
      });
      this.bindings();
    }

    if (this.props.vendors !== prevProps.vendors) {
      this.bindings();
    }

    if (this.state.hash) {
      this.tooltip.current.addEventListener('touchstart', e => {
        this.touchMovement = false;
      });
      this.tooltip.current.addEventListener('touchmove', e => {
        this.touchMovement = true;
      });
      this.tooltip.current.addEventListener('touchend', e => {
        e.preventDefault();
        if (!this.touchMovement) {
          this.setState({
            hash: false,
            itemInstanceId: false,
            table: false
          });
        }
      });
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.mouseMove);

    this.bindings();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseMove);
  }

  render() {
    const { manifest, profile } = this.props;
    if (this.state.hash) {

      let render = itemTypes(profile, manifest, this.state.hash, this.state.itemInstanceId, this.state.table);

      return (
        <div id='tooltip' ref={this.tooltip} style={{ top: `${this.mouseMoveXY.y}px`, left: `${this.mouseMoveXY.x}px` }}>
          {render}
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    vendors: state.vendors
  };
}

export default connect(mapStateToProps)(Tooltip);