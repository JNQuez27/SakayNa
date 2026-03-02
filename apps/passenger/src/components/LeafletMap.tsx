import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../theme';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MapRoute {
  id: string;
  coordinates: Array<{ latitude: number; longitude: number }>;
  color: string;
  width?: number;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
  emoji?: string;
}

export interface LeafletMapRef {
  animateTo: (lat: number, lng: number, zoom?: number) => void;
  fitBounds: (coords: Array<{ latitude: number; longitude: number }>) => void;
  updateMarker: (id: string, lat: number, lng: number) => void;
  setUserLocation: (lat: number, lng: number) => void;
  addMarker: (marker: MapMarker) => void;
  setMapType: (type: 'default' | 'satellite' | 'terrain') => void;
}

interface Props {
  center: { latitude: number; longitude: number };
  zoom?: number;
  routes?: MapRoute[];
  markers?: MapMarker[];
  userLocation?: { latitude: number; longitude: number } | null;
  style?: ViewStyle;
  onRoutePress?: (routeId: string) => void;
  onMarkerPress?: (markerId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  HTML generator                                                     */
/* ------------------------------------------------------------------ */

function generateHTML(props: Props): string {
  const { center, zoom = 14, routes = [], markers = [], userLocation } = props;

  const routesJSON = JSON.stringify(
    routes.map((r) => ({
      id: r.id,
      coords: r.coordinates.map((c) => [c.latitude, c.longitude]),
      color: r.color,
      width: r.width || 4,
    })),
  );

  const markersJSON = JSON.stringify(
    markers.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      title: m.title || '',
      color: m.color || '#E74C3C',
      emoji: m.emoji || '',
    })),
  );

  const userLocJSON = userLocation
    ? JSON.stringify([userLocation.latitude, userLocation.longitude])
    : 'null';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    html,body,#map{width:100%;height:100%;}
    .user-pulse{
      width:24px;height:24px;border-radius:50%;
      background:rgba(66,133,244,0.2);
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
      animation:pulse 2s infinite;
    }
    @keyframes pulse{
      0%{transform:translate(-50%,-50%) scale(1);opacity:1;}
      100%{transform:translate(-50%,-50%) scale(2.5);opacity:0;}
    }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map',{
    center:[${center.latitude},${center.longitude}],
    zoom:${zoom},
    zoomControl:false,
    attributionControl:false
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    crossOrigin:true
  }).addTo(map);

  /* ---- tile layers for map type switching ---- */
  var tileLayers = {
    'default': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,crossOrigin:true}),
    'satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,crossOrigin:true}),
    'terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{maxZoom:17,crossOrigin:true})
  };
  var currentTileLayer = null;

  function setMapType(type){
    if(currentTileLayer) map.removeLayer(currentTileLayer);
    var layer = tileLayers[type] || tileLayers['default'];
    layer.addTo(map);
    currentTileLayer = layer;
  }

  L.control.attribution({position:'bottomright',prefix:false})
    .addAttribution('<a href="https://osm.org">OSM</a>')
    .addTo(map);

  var markerObjects = {};
  var userLocLayer = null;
  var userPulseLayer = null;

  /* ---- draw routes ---- */
  var routes = ${routesJSON};
  routes.forEach(function(r){
    var line = L.polyline(r.coords,{color:r.color,weight:r.width,opacity:0.85,lineJoin:'round'}).addTo(map);
    line.on('click',function(){
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'routePress',id:r.id}));
    });
  });

  /* ---- draw markers ---- */
  function makeIcon(color,emoji){
    if(emoji){
      return L.divIcon({
        html:'<div style="font-size:24px;text-align:center;line-height:32px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));">'+emoji+'</div>',
        iconSize:[32,32],iconAnchor:[16,32],className:''
      });
    }
    return L.divIcon({
      html:'<div style="width:14px;height:14px;border-radius:50%;background:'+color+';border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>',
      iconSize:[14,14],iconAnchor:[7,7],className:''
    });
  }

  var markersData = ${markersJSON};
  markersData.forEach(function(m){
    var icon = makeIcon(m.color,m.emoji);
    var mk = L.marker([m.lat,m.lng],{icon:icon}).addTo(map);
    if(m.title) mk.bindPopup('<b>'+m.title+'</b>');
    mk.on('click',function(){
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'markerPress',id:m.id}));
    });
    markerObjects[m.id] = mk;
  });

  /* ---- user location ---- */
  function drawUserLoc(lat,lng){
    if(userLocLayer) map.removeLayer(userLocLayer);
    if(userPulseLayer) map.removeLayer(userPulseLayer);
    userPulseLayer = L.marker([lat,lng],{
      icon: L.divIcon({
        html:'<div class="user-pulse"></div><div style="width:14px;height:14px;border-radius:50%;background:#4285F4;border:3px solid white;box-shadow:0 2px 8px rgba(66,133,244,0.5);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div>',
        iconSize:[24,24],iconAnchor:[12,12],className:''
      }),
      interactive:false
    }).addTo(map);
  }

  var userLoc = ${userLocJSON};
  if(userLoc) drawUserLoc(userLoc[0],userLoc[1]);

  /* ---- message handler ---- */
  function handleMsg(e){
    try{
      var msg = JSON.parse(e.data);
      switch(msg.type){
        case 'animateTo':
          map.flyTo([msg.lat,msg.lng],msg.zoom||map.getZoom(),{duration:0.8});
          break;
        case 'fitBounds':
          var bounds = L.latLngBounds(msg.coords.map(function(c){return[c[0],c[1]];}));
          map.fitBounds(bounds,{padding:[msg.padding||40,msg.padding||40],animate:true});
          break;
        case 'updateMarker':
          if(markerObjects[msg.id]){
            markerObjects[msg.id].setLatLng([msg.lat,msg.lng]);
          }
          break;
        case 'setUserLocation':
          drawUserLoc(msg.lat,msg.lng);
          break;
        case 'addMarker':
          var ic = makeIcon(msg.color||'#E74C3C',msg.emoji||'');
          var nm = L.marker([msg.lat,msg.lng],{icon:ic}).addTo(map);
          if(msg.title) nm.bindPopup('<b>'+msg.title+'</b>');
          markerObjects[msg.id] = nm;
          break;
        case 'setMapType':
          setMapType(msg.mapType);
          break;
      }
    }catch(err){}
  }
  document.addEventListener('message',function(e){handleMsg(e);});
  window.addEventListener('message',function(e){handleMsg(e);});

  /* notify RN that map is ready */
  setTimeout(function(){
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'mapReady'}));
  },300);
<\/script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const LeafletMap = forwardRef<LeafletMapRef, Props>((props, ref) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  // HTML is generated once; further updates go through postMessage
  const html = useRef(generateHTML(props)).current;

  const send = (msg: object) => {
    webViewRef.current?.postMessage(JSON.stringify(msg));
  };

  useImperativeHandle(ref, () => ({
    animateTo: (lat, lng, zoom) => send({ type: 'animateTo', lat, lng, zoom }),
    fitBounds: (coords) =>
      send({
        type: 'fitBounds',
        coords: coords.map((c) => [c.latitude, c.longitude]),
      }),
    updateMarker: (id, lat, lng) => send({ type: 'updateMarker', id, lat, lng }),
    setUserLocation: (lat, lng) => send({ type: 'setUserLocation', lat, lng }),
    addMarker: (marker) =>
      send({
        type: 'addMarker',
        id: marker.id,
        lat: marker.latitude,
        lng: marker.longitude,
        title: marker.title || '',
        color: marker.color || '#E74C3C',
        emoji: marker.emoji || '',
      }),
    setMapType: (mapType) => send({ type: 'setMapType', mapType }),
  }));

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'routePress') props.onRoutePress?.(msg.id);
      if (msg.type === 'markerPress') props.onMarkerPress?.(msg.id);
      if (msg.type === 'mapReady') setLoading(false);
    } catch {}
  };

  return (
    <View style={[StyleSheet.absoluteFillObject, props.style]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={StyleSheet.absoluteFillObject}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        mixedContentMode="compatibility"
        allowFileAccess
        cacheEnabled
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
});

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
