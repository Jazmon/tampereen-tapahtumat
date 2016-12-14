// @flow
import React from 'react';

import { Lokka } from 'lokka';
import { Transport } from 'lokka-transport-http';

import './i18n';
// import { Provider } from 'react-redux';
// import configureStore from './configureStore';

import App from './App';
import config from '../config';

// const store = configureStore();

const client = new Lokka({
  transport: new Transport(config.apiUrl),
});

type State = {
  events: Array<ApiEvent>;
  loading: boolean;
}

class Root extends React.Component {

  state: State = { events: [], loading: false };

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents = async () => {
    this.setState({ loading: true });

    const imageFragment = client.createFragment(`
      fragment on Event {
        image {
          uri
          title
        }
      }
    `);

    client.query(`
      {
        events {
          id
          title
          description
          latitude
          longitude
          type
          free
          ticketLink
          times {
            start
            end
          }
          ...${imageFragment}
          contactInfo {
            address
            link
            email
          }
        }
      }
    `).then(result => {
      const events = result.events.map(event => ({
        ...event,
        times: event.times.map(time => ({
          start: new Date(time.start),
          end: new Date(time.end),
        })),
      }));
      this.setState({ events, loading: false });
    })
    .catch(err => {
      console.error(err);
      // TODO: handling
    });
  }

  render() {
    return <App {...this.state} />;
  }
}

//
// const Root = () => (
//   <App />
// );
/*
<Provider store={store}>
  <App />
</Provider>
*/
export default Root;
