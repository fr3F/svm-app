export const AUDIO_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>
<script>
var ctx=null, audioEl=null, mediaSource=null;
var masterN=null, dryN=null, wetN=null, convN=null, panN=null;
var graphReady=false, pannerActive=false;
var dur=0;
var params={speed:1, semitones:0, pitchHz:440, reverb:0, is8D:false};
var panAngle=0, panTimer=null, tickTimer=null, keepAliveTimer=null;
var currentRt60=-1;

function send(o){ try{window.ReactNativeWebView.postMessage(JSON.stringify(o));}catch(e){} }

// Identité (1 sample) — graph prêt sans IR lourd au démarrage
function makeIdentityIR(){
  var buf=ctx.createBuffer(1,1,ctx.sampleRate);
  buf.getChannelData(0)[0]=1;
  return buf;
}

// IR synthétique Schroeder — généré uniquement quand reverb > 0
function makeReverbIR(rt60){
  var sr=ctx.sampleRate;
  var len=Math.ceil(Math.min(rt60,3)*sr);
  var imp=ctx.createBuffer(2,len,sr);
  for(var c=0;c<2;c++){
    var d=imp.getChannelData(c);
    for(var i=0;i<len;i++)
      d[i]=(Math.random()*2-1)*Math.exp(-6.9078*i/(rt60*sr));
  }
  return imp;
}

function initGraph(){
  masterN=ctx.createGain(); masterN.gain.value=1;
  dryN=ctx.createGain();    dryN.gain.value=1;
  wetN=ctx.createGain();    wetN.gain.value=0;
  convN=ctx.createConvolver();
  convN.buffer=makeIdentityIR();
  masterN.connect(dryN);
  masterN.connect(convN);
  convN.connect(wetN);
  dryN.connect(ctx.destination);
  wetN.connect(ctx.destination);
  mediaSource=ctx.createMediaElementSource(audioEl);
  mediaSource.connect(masterN);
  graphReady=true;
}

function clampRate(){
  return Math.max(0.25,Math.min(4,
    params.speed * Math.pow(2, params.semitones/12) * (params.pitchHz/440)
  ));
}

function applyRate(){
  if(audioEl) audioEl.playbackRate=clampRate();
}

function applyReverb(){
  if(!dryN||!ctx) return;
  var rt60=params.reverb/100*3; // reverb param 0-100 → 0-3s RT60
  if(rt60<=0.05){
    dryN.gain.setTargetAtTime(1,ctx.currentTime,0.05);
    wetN.gain.setTargetAtTime(0,ctx.currentTime,0.05);
    currentRt60=0;
    return;
  }
  // Regénérer IR seulement si RT60 a significativement changé
  if(Math.abs(rt60-currentRt60)>0.05){
    convN.buffer=makeReverbIR(rt60);
    currentRt60=rt60;
  }
  var wet=Math.min(0.55, rt60/3*0.55);
  dryN.gain.setTargetAtTime(1-wet*0.4,ctx.currentTime,0.05);
  wetN.gain.setTargetAtTime(wet,ctx.currentTime,0.05);
}

function apply8D(){
  if(!graphReady) return;
  if(params.is8D && !pannerActive){
    panN=ctx.createPanner();
    panN.panningModel='HRTF'; panN.distanceModel='linear';
    panN.refDistance=1; panN.maxDistance=10; panN.rolloffFactor=0;
    try{dryN.disconnect(ctx.destination);}catch(e){}
    try{wetN.disconnect(ctx.destination);}catch(e){}
    dryN.connect(panN); wetN.connect(panN); panN.connect(ctx.destination);
    pannerActive=true;
    start8D();
  } else if(!params.is8D && pannerActive){
    stop8D();
    try{dryN.disconnect(panN);}catch(e){}
    try{wetN.disconnect(panN);}catch(e){}
    try{panN.disconnect(ctx.destination);}catch(e){}
    panN=null; pannerActive=false;
    dryN.connect(ctx.destination);
    wetN.connect(ctx.destination);
  }
}

function start8D(){
  stop8D();
  panTimer=setInterval(function(){
    panAngle=(panAngle+3)%360;
    var rad=panAngle*Math.PI/180;
    if(panN){
      panN.positionX.setTargetAtTime(Math.sin(rad)*3,ctx.currentTime,0.01);
      panN.positionZ.setTargetAtTime(-Math.cos(rad)*3,ctx.currentTime,0.01);
    }
  },50);
}
function stop8D(){ if(panTimer){clearInterval(panTimer);panTimer=null;} }

// Keepalive : empêche Android de suspendre l'AudioContext
function startKeepAlive(){
  if(keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer=setInterval(function(){
    if(ctx && ctx.state==='suspended'){
      ctx.resume().catch(function(){});
    }
  },2000);
}
function stopKeepAlive(){
  if(keepAliveTimer){clearInterval(keepAliveTimer);keepAliveTimer=null;}
}

function load(uri){
  try{
    if(tickTimer){clearInterval(tickTimer);tickTimer=null;}
    stopKeepAlive();
    stop8D();
    if(audioEl){try{audioEl.pause();}catch(e){} audioEl.src=''; audioEl=null;}
    mediaSource=null; graphReady=false; pannerActive=false; panN=null;
    dur=0; currentRt60=-1;
    if(ctx){try{ctx.close();}catch(e){} ctx=null;}

    ctx=new(window.AudioContext||window.webkitAudioContext)();
    audioEl=document.createElement('audio');
    audioEl.preload='auto';
    audioEl.crossOrigin='anonymous';
    audioEl.src=uri;
    audioEl.preservesPitch=false;
    if('mozPreservePitch' in audioEl) audioEl.mozPreservePitch=false;
    if('webkitPreservesPitch' in audioEl) audioEl.webkitPreservesPitch=false;

    audioEl.onloadedmetadata=function(){
      dur=audioEl.duration||0;
    };

    audioEl.oncanplaythrough=function(){
      if(graphReady) return;
      try{ initGraph(); }catch(e){
        send({type:'error',message:'graph:'+e.message}); return;
      }
      if(!dur||!isFinite(dur)) dur=audioEl.duration||0;
      applyRate();
      send({type:'loaded',duration:dur});
      startTick();
      startKeepAlive();
    };

    audioEl.ondurationchange=function(){
      var d=audioEl.duration;
      if(d&&isFinite(d)) dur=d;
    };

    audioEl.onstalled=function(){
      // Tentative de récupération si le buffer se vide
      if(audioEl&&!audioEl.paused){
        audioEl.load();
        audioEl.play().catch(function(){});
      }
    };

    audioEl.onended=function(){ send({type:'ended'}); };
    audioEl.onerror=function(){
      var msg=(audioEl.error&&audioEl.error.message)?audioEl.error.message:'unknown';
      send({type:'error',message:'audio:'+msg});
    };
  }catch(e){ send({type:'error',message:'load:'+e.message}); }
}

function play(){
  if(!audioEl||!graphReady) return;
  if(ctx.state==='suspended') ctx.resume();
  audioEl.play().catch(function(e){ send({type:'error',message:'play:'+e.message}); });
}

function pause(){
  if(audioEl) audioEl.pause();
}

function seek(pos){
  if(!audioEl||!graphReady) return;
  if(ctx.state==='suspended') ctx.resume();
  audioEl.currentTime=pos;
  audioEl.play().catch(function(){});
}

function setEffects(p){
  var prev8D=params.is8D;
  params=Object.assign({},params,p);
  applyRate();
  applyReverb();
  if(params.is8D!==prev8D) apply8D();
}

function startTick(){
  if(tickTimer) clearInterval(tickTimer);
  tickTimer=setInterval(function(){
    if(!audioEl) return;
    // Réveiller l'AudioContext si suspendu
    if(ctx&&ctx.state==='suspended'&&!audioEl.paused){
      ctx.resume().catch(function(){});
    }
    var pos=audioEl.currentTime;
    var playing=!audioEl.paused&&!audioEl.ended;
    var d=audioEl.duration;
    if(d&&isFinite(d)) dur=d;
    send({type:'status',position:pos,duration:dur,isPlaying:playing});
  },250);
}

function handleMsg(data){
  try{
    var m=JSON.parse(data);
    if(m.type==='load')         load(m.uri);
    else if(m.type==='play')    play();
    else if(m.type==='pause')   pause();
    else if(m.type==='seek')    seek(m.position);
    else if(m.type==='effects') setEffects(m.params);
  }catch(e){}
}
window.addEventListener('message',  function(e){handleMsg(e.data);});
document.addEventListener('message', function(e){handleMsg(e.data);});
</script></body></html>`;
