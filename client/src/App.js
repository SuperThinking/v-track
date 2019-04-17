import React, { Component } from 'react';
import Axios from 'axios';
import Cookies from 'universal-cookie'
import './App.css';

const cookies = new Cookies();

class App extends Component {

  componentDidMount(pp) {
    cookies.set('ASPSESSIONIDSEQCBRDR', 'HPCDPLECKDNJCJJNPPMBLIFL', { path: '/' });
    cookies.set('_fbp', 'fb.2.1552418955019.1785587815', { path: '/' });
    cookies.set('_ga', 'GA1.3.974515615.1534053119', { path: '/' });
    cookies.set('_gcl_au', '1.1.1032236341.1552418954', { path: '/' });
    cookies.set('cookiesession1', '62078EF9SAE1AIWYJNQI1QZSOQTU92CC', { path: '/' });
    cookies.set('logstudregno', '16BCE1111', { path: '/' });
    cookies.set('mp_135768d17d3144ecf01fd49357a360ed_mixpanel', '%7B%22distinct_id%22%3A%20%221671be11db7d0-0a1da9512c4cfc-162a1c0b-100200-1671be11db8257%22%2C%22%24device_id%22%3A%20%221671be11db7d0-0a1da9512c4cfc-162a1c0b-100200-1671be11db8257%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.co.in%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.co.in%22%7D', { path: '/' });
    var data = { 'cookie': 'cookies.cookie' }
    Axios.get('http://localhost:5000/', data)
      .then((res) => {
        console.log(res);
      })
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;
