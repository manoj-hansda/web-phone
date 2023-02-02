import { signal } from '@preact/signals';
import { MediaConnection } from 'peerjs';
import { useEffect } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { HiSpeakerWave } from 'react-icons/hi2';
import { BsInfoCircle } from 'react-icons/bs';

import Card from './components/card';
import Container from './components/container';
import { closeConnection, connectPeers, getConnection, getLocalStream, peer, setRemoteStream } from './integrations/peerController';

import './app.css';

const deviceId = signal('');
const code = signal('');
const codeError = signal('');
const callStatus = signal<'idle' | 'incoming' |  'connecting' | 'connected'>('idle');
const callObject = signal<MediaConnection | null>(null);

const handleCodeChange = (evt: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => {
  if (evt.target instanceof HTMLInputElement) {
    code.value = evt.target.value;
  
    if (codeError.value) codeError.value = '';
  }
};


const setupPeerJs = () => {
   getLocalStream();

  peer.on('open', function () {
    deviceId.value = peer.id;
  });
  peer.on('call', function (call) {
    callStatus.value = 'incoming';
    callObject.value = call;
  });
}

export function App() {
  useEffect(() => {
    setupPeerJs();
  }, []);

  const handleCall = (evt: JSXInternal.TargetedEvent<HTMLFormElement, Event>) => {
    evt.preventDefault();
    
    if (!code) {
      codeError.value = 'Please enter code';
      return;
    }
    
    callStatus.value = 'connecting';

    connectPeers(code);

    const call = peer.call(code.value, (window as any).localStream);
    
    call.on('stream', function (stream) {
      setRemoteStream(stream);
      
      callStatus.value = 'connected';
    });
  };

  const handleAcceptCall = () => {
    if (callObject.value) {
      callObject.value.answer((window as any).localStream);
      
      callStatus.value = 'connected';

      callObject.value.on('stream', function (stream: any) {
        setRemoteStream(stream);
      });
    }
    getConnection().on('close', function () {
      disconnect();
    });
  };

  const disconnect = () => {
    callStatus.value = 'idle';
    closeConnection();
  };

  return (
    <>
      <Container>
        <Card>
          <h1 className="title">WEB PHONE</h1>
          

          {callStatus.value === 'idle' && (
            <>
              <form class="pure-form code-form" onSubmit={handleCall}>
                <input
                  type="text"
                  placeholder="code"
                  value={code}
                  onChange={handleCodeChange}
                />
                <div className="FormErrorMessage">
                  {codeError}
                </div>
              
              <button type="submit" className="pure-button pure-button-primary">
                Call
              </button>
              </form>

              <p className="device-id">
                Your device Id{' '}
                <div>
                  {deviceId}
                </div>
              </p>
            </>
          )}

          {callStatus.value === 'incoming' && (
            <div>
              <h3>Incoming Call</h3>

              <button className="pure-button pure-button-primary btn-accept-call" onClick={handleAcceptCall}>
                Accept
              </button>
            </div>
          )}

          {callStatus.value === 'connecting' && (
            <div>
              <div className="lds-ripple">
                <div></div>
                <div></div>
              </div>

              <p>connecting to {code}</p>
            </div>
          )}

          {callStatus.value === 'connected' && (
            <div>
              <p>Connected to {code}</p>

             
              <div class="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              

              <div className="flex-center">
                <button class="pure-button pure-button-primary">
                  <HiSpeakerWave />
                </button>
                <button class="pure-button pure-button-primary" onClick={disconnect}>
                  Disconnect
                </button>
              </div>
            </div>
          )}

          <div className="info">
            <BsInfoCircle />
            <p>Please use headphones</p>
          </div>

          <div hidden={callStatus.value !== 'connected'}>
            <div class="audio-controls">
              <audio controls id="remoteAudio" muted={true}></audio>
              <audio controls id="localAudio" muted={true}></audio>
            </div>
          </div>
        </Card>
      </Container>
    </>
  );
}
