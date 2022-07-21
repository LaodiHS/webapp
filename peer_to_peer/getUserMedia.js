// Cope with browser differences.
let audioContext;
if (typeof AudioContext === 'function') {
  audioContext = new AudioContext();
} else if (typeof webkitAudioContext === 'function') {
  audioContext = new webkitAudioContext(); // eslint-disable-line new-cap
} else {
  console.log('Sorry! Web Audio not supported.');
}

// Create a filter node.
var filterNode = audioContext.createBiquadFilter();
// See https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-section
filterNode.type = 'highpass';
// Cutoff frequency. For highpass, audio is attenuated below this frequency.
filterNode.frequency.value = 10000;

// Create a gain node to change audio volume.
var gainNode = audioContext.createGain();
// Default is 1 (no change). Less than 1 means audio is attenuated
// and vice versa.
gainNode.gain.value = 0.5;

navigator.mediaDevices.getUserMedia({audio: true}, (stream) => {
  // Create an AudioNode from the stream.
  const mediaStreamSource =
    audioContext.createMediaStreamSource(stream);
  mediaStreamSource.connect(filterNode);
  filterNode.connect(gainNode);
  // Connect the gain node to the destination. For example, play the sound.
  gainNode.connect(audioContext.destination);
});