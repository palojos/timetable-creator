import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';
import { Schema } from '@app/store';
import { ui } from '@app/actions';

const mapStateToProps = (state: Schema.Store ) => {
  return {
    error: state.ui.error,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    close: (err: Schema.UIError) => {
      dispatch(ui.closeError(err));
    }
  }
}

const ErrorView = (props: any) => {

  const Errors = props.error.map((err: Schema.UIError) => {
    return(
      <ErrorAlert
        key={err.id}
        error={err}
        close={props.close}
       />
    );
  });

  return(
    <Row>
      <Col>
        {Errors}
      </Col>
    </Row>
  );

}

const Error = connect(mapStateToProps, mapDispatchToProps)(ErrorView);

export { Error };

const ErrorAlert = (props: any) => {

  const handleDismiss = () => {
    props.close(props.error);
  }

  return (
    <Alert color="danger" isOpen={true} toggle={handleDismiss}>
      {props.error.message}
    </Alert>
  );
}
