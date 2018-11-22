import React from 'react';
import { render } from 'react-dom';

import { App } from '@app/components';

render(React.createElement(App, {}),
  document.getElementById('react-root'));