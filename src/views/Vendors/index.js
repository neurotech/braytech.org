import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import getVendors from '../../utils/getVendors';

import './styles.css';

class Vendors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.vendors) {
      getVendors();
    }
  }

  render() {
    const { t } = this.props;
    
    return (
      null
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    profile: state.profile,
    vendors: state.vendors,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Vendors);
