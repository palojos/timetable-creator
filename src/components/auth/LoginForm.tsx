import React from 'react';
import uuidv4 from 'uuid/v4';
import config from '@app/config';



export class LoginForm extends React.Component {

  componentDidMount() {
    const frm = document.forms
    if( frm[0] ) {
      frm[0].submit();
    }
  }

  render() {
    let nonce = uuidv4();
    window.localStorage["login:nonce"] = nonce;
    return (
      <form id="login-form" method="GET" action={config.gapi.urls.login}>
        <input type="hidden" name="client_id" value={config.gapi.client_id} />
        <input type="hidden" name="redirect_uri" value={config.gapi.redirect_uri} />
        <input type="hidden" name="scope" value={config.gapi.scope} />
        <input type="hidden" name="include_granted_scopes" value="true" />
        <input type="hidden" name="state" value={nonce} />
        <input type="hidden" name="response_type" value="token" />
      </form>
    );
  }
}
