import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import QRCode from 'react-qr-code';
import {} from '@team-flow/data-access';
import { useEnable2FaMutation } from '../../../../libs/data-access/src/lib/generated/generated';
import { useState } from 'react';
export function App() {
  const [qr, setQr] = useState<string>('');
  const [enable2FA, { data }] = useEnable2FaMutation({
    onCompleted: (data) => {
      // enable2FA();
      if (data?.enable2FA?.__typename === 'TwoFA') {
        console.log(data?.enable2FA.otpauth);
        setQr(data?.enable2FA.otpauth);
      }
    },
  });

  return (
    <>
      Hello to Team Flow
      <button onClick={() => enable2FA()}>enable 2fa</button>
      <div style={{ width: '200px' }}>
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={qr}
          viewBox={`0 0 256 256`}
        />
      </div>
    </>
  );
}

export default App;
