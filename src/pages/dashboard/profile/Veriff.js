// 

// Serverless Veriff JS SDK and Incontext SDK integration example using React.JS

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Veriff } from '@veriff/js-sdk';
import { createVeriffFrame } from '@veriff/incontext-sdk';
import { API_KEY } from '../../../utils/constants';
import { makeStyles } from '@material-ui/core/styles';

// In this example both Web SDKs are covered. You can use either of implementations

const implementationType = 'JS_SDK';
//const implementationType = 'INCONTEXT_SDK';

const useStyles = makeStyles(theme => ({
  app: {
    marginTop: theme.spacing(42)
  },
}))

function VeriffVerify() {
  const classes = useStyles();
  const { customerId } = useSelector(state => state.customer)

  useEffect(() => {
    // here we generate a verification session needless of a server;
    const veriff = Veriff({
      host: 'https://stationapi.veriff.com',
      apiKey: API_KEY,
      parentId: 'veriff-root',
      onSession: function (err, response) {
        //Here the end user flow is triggered.
        switch (implementationType) {
          case 'JS_SDK':
            // JS SDK implementation--> redirects user to the verification url
            // window.location.replace(response.verification.url);
            window.open(response.verification.url, '_blank');
            console.log('response',response)
            break;
          case 'INCONTEXT_SDK':
            // Incontext SDK implementation-->  user stays in the webpage
            createVeriffFrame({ url: response.verification.url });
            break;
          default:
            console.log('Nothing yet');
        }
      },
    });

    veriff.setParams({
      // person: {
      //   givenName: 'egg',
      //   lastName: 'eg '
      // },
      vendorData: customerId
    });

    veriff.mount({
      formLabel: {
        givenName: 'First name',
        lastName: 'Last name',
      },
      submitBtnText: 'Get verified',
      loadingText: 'Please wait...'
    });
  }, [customerId]);

  return (
    <div className={classes.app}>
      <div id="veriff-root" style={{ margin: '0 auto'}} />
    </div>
  );
}

export default VeriffVerify;