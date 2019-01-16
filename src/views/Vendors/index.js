import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import getVendors from '../../utils/getVendors';
import Items from '../../components/Items';

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
    const { t, manifest, vendors } = this.props;

    if (vendors) {
      const vendorDefinition = manifest.DestinyVendorDefinition[vendors.tess.Response.vendor.data.vendorHash];

      console.log(vendors, vendorDefinition);

      // clone displayCategories object
      let displayCategories = vendorDefinition.displayCategories;

      Object.values(vendors.tess.Response.sales.data).forEach(item => {
        // find categoryIndex of sales item
        let displayCategoryIndex = vendors.tess.Response.categories.data.categories.find(category => category.itemIndexes.includes(item.vendorItemIndex)).displayCategoryIndex;

        // check if item array exists on cloned displayCategories object
        displayCategories[displayCategoryIndex].items = displayCategories[displayCategoryIndex].items ? displayCategories[displayCategoryIndex].items : [];

        // add item to cloned displayCategories object
        displayCategories[displayCategoryIndex].items.push(item);
      });

      console.log(displayCategories);

      let output = displayCategories.map(category => {
        if (category.items) {
          return (
            <div className='category'>
              {category.displayProperties.name}
              <ul className='list items'>
                <Items hashes={category.items.map(item => item.itemHash)} manifest={manifest} />
              </ul>
            </div>
          );
        } else {
          return null;
        }
      });
      
      return (
        <div className={cx('view', this.props.theme.selected)} id='vendors'>
          <div className='pane'>
            <div className='header'>
              <div className='sub-header sub'>
                <div>{t('Vendors')}</div>
              </div>
              <div className='description'>
                {t("The data driving this content is bassed on the developers' own character's progression and may result in visual discrepancies. It is updated every 4 hours daily and for the most part is accurate.")}
              </div>
            </div>
            <div className='inventories'>
              <ul className='list'>
                {Object.values(vendors).map(vendor => {
                  if (vendor.ErrorCode === 1) {
                    let vendorDefinition = manifest.DestinyVendorDefinition[vendor.Response.vendor.data.vendorHash];
                    let isActive = (match, location) => {
                      if (this.props.vendorHash === undefined && vendorDefinition.hash === 3361454721) {
                        return true;
                      } else if (match) {
                        return true;
                      } else {
                        return false;
                      }
                    };
                    return (
                      <li className='linked'>
                        <NavLink isActive={isActive} to={ `/vendors/${vendorDefinition.hash}` } exact>
                          {vendorDefinition.displayProperties.name}
                        </NavLink>
                      </li>
                    )
                  } else {
                    return null;
                  }
                })}
              </ul>
            </div>
          </div>
          <div className='items'>
            {output}
          </div>
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
    vendors: state.vendors,
    theme: state.theme
  };
}

export default compose(
  connect(mapStateToProps),
  withNamespaces()
)(Vendors);
