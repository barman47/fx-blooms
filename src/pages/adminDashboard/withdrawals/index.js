// // 

// // Serverless Veriff JS SDK and Incontext SDK integration example using React.JS

// import React, { useEffect } from 'react';
// import { Veriff } from '@veriff/js-sdk';
// import { createVeriffFrame } from '@veriff/incontext-sdk';

// // Put the API key of the integration
// const API_KEY = 'a8b57b7f-6166-4388-90fd-4cecb8e4396d';

// // In this example both Web SDKs are covered. You can use either of implementations

// const implementationType = 'JS_SDK';
// //const implementationType = 'INCONTEXT_SDK';

// function Withdrawals() {
//   useEffect(() => {
//     // here we generate a verification session needless of a server;
//     const veriff = Veriff({
//       host: 'https://stationapi.veriff.com',
//       apiKey: API_KEY,
//       parentId: 'veriff-root',
//       onSession: function (err, response) {
//         //Here the end user flow is triggered.
//         switch (implementationType) {
//           case 'JS_SDK':
//             // JS SDK implementation--> redirects user to the verification url
//             // window.location.replace(response.verification.url);
//             window.open(response.verification.url, '_blank');
//             console.log('response', response)
//             break;
//           case 'INCONTEXT_SDK':
//             // Incontext SDK implementation-->  user stays in the webpage
//             createVeriffFrame({ url: response.verification.url });
//             break;
//           default:
//             console.log('Nothing yet');
//         }
//       },
//     });

//     veriff.mount({
//       formLabel: {
//         givenName: 'First name',
//         lastName: 'Last name',
//         vendorData: 'Email'
//       },
//       submitBtnText: 'Get verified',
//       loadingText: 'Please wait...'
//     });

//     veriff.setParams({
//       person: {
//         givenName: 'egg',
//         lastName: 'eg '
//       },
//       vendorData: '7273hhhdhssgsg '
//     });
//   }, []);

//   return (
//     <div className="App">
//       <div id="veriff-root" />
//     </div>
//   );
// }

// export default Withdrawals;