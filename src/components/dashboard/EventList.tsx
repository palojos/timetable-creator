import React from 'react';
import { Schema } from '@app/store';
import { connect } from 'react-redux';
import { applyEventFilter } from '@app/components/util';

const mapStateToProps = (state: Schema.Store) => {
  return {
    events: applyEventFilter(state)
  }
}
