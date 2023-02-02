import Peer from 'peerjs';

export const peer = new Peer(
  '' +
    Math.floor(Math.random() * 2 ** 18)
      .toString(36)
      .padStart(4, '0'),
  {
    host: location.hostname,
    debug: 1,
    path: '/webphone',
  }
);

(window as any).peer = peer;

let conn: any;

export const getStreamCode = () => {
  const code = window.prompt('Please enter the sharing code');
  return code;
};

export const getLocalStream = () => {
  const constraints = { video: false, audio: true };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      setLocalStream(stream);
    })
    .catch((err) => {
      console.log('u got an error:' + err);
    });
};

export const setLocalStream = (stream: any) => {
  (window as any).localAudio.srcObject = stream;
  (window as any).localAudio.autoplay = true;
  (window as any).localStream = stream;
};

export const setRemoteStream = (stream: any) => {
  (window as any).remoteAudio.srcObject = stream;
  (window as any).remoteAudio.autoplay = true;
  (window as any).peerStream = stream;
};

export const connectPeers = (code: any) => {
  conn = peer.connect(code);
};

peer.on('connection', function (connection) {
  conn = connection;
  const peer_id = connection.peer;
});

export const closeConnection = () => {
  conn.close();
};

export const getConnection = () => conn;

peer.on('error', (err) => console.error(err));
