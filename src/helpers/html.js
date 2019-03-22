import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
    baseUrl: PropTypes.string,
    host: PropTypes.string
  };
  render() {
    const {assets, component, store, bodyClass , baseUrl , host } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    return (
      <html>
        <head>
          <title>Proyecto Material Pagination</title>
          <meta name="description" content="Proyecto Proyecto Material Pagination" />
          <meta name="keywords" content="material, test , prueba "/>
          <meta name="author" content="Juan Marquina"/>
          <meta charSet="utf-8"/>
          <link rel="shortcut icon" href="/media/image/favicon.png"/>
          <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />

          <meta httpEquiv="Expires" content="0" />
          <meta httpEquiv="Last-Modified" content="0" />
          <meta httpEquiv="Cache-Control" content="no-cache, mustrevalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />

          {Object.keys(assets.styles).map((style, key) =>
            <link href={ assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/> 
          )}

        </head>

        <body className={bodyClass}>
          <main>
            <article>
              <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
            </article>
          </main>

          <script
            src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossOrigin="anonymous"></script>

          <script dangerouslySetInnerHTML={{__html: `window.user=${serialize(component.props.userData)};`}} charSet="UTF-8"/>
          <script src={assets.javascript.main} charSet="UTF-8"/>
        </body>
      </html>
    );
  }
}