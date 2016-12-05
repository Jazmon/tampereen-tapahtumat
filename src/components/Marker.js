// @flow
import React from 'react';
import {
  Image,
} from 'react-native';
import MapView from 'react-native-maps';

import defaultMarker from '../assets/markers/muut.png';
import movieMarker from '../assets/markers/elokuva.png';
import festivalMarker from '../assets/markers/festivaali.png';
import childrenMarker from '../assets/markers/lapset.png';
import fairMarker from '../assets/markers/messu.png';
import musicMarker from '../assets/markers/musiikki.png';
import danceMarker from '../assets/markers/tanssi.png';
import theatreMarker from '../assets/markers/teatteri.png';
import marketMarker from '../assets/markers/tori.png';
import sportsMarker from '../assets/markers/urheilu.png';
import entertainmentMarker from '../assets/markers/viihde.png';
// import speakMarker from '../assets/markers/info.png';
// import congressMarker from '../assets/markers/kongressi.png';
// import natureMarker from '../assets/markers/luonto.png';
import exhibitionMarker from '../assets/markers/nayttely.png';
// import locationInfoMarker from '../assets/markers/opastettu.png';
// import professionalMarker from '../assets/markers/pro.png';
// import foodMarker from '../assets/markers/ruoka.png';
// import literatureMarker from '../assets/markers/sanataide.png';
// import artMarker from '../assets/markers/taide.png';


type Props = {
  // id: string;
  latlng: LatLng;
  title: string;
  description: string;
  type: string;
  onPress: Function;
};

const Marker = (props: Props) => (
  <MapView.Marker
    // key={`marker-${props.id}`}
    coordinate={props.latlng}
    // title={props.title}
    // description={props.description}
    // image={getImagePath(props.type)}
    onPress={() => props.onPress(props)}
  >
    <Image
      source={getImagePath(props.type)}
      title={props.title}
      description={props.description}
      resizeMode="cover"
      style={{ width: 40, height: 40 }}
    />
    {/* <MapView.Callout>
      <View>
        <Text>{props.title}</Text>
      </View>
    </MapView.Callout> */}
  </MapView.Marker>
);

const getImagePath = (type: string) => {
  const markerImages = [
    { type: 'dance',
      source: danceMarker,
    },
    { type: 'other-event',
      source: defaultMarker,
    },
    { type: 'for-children',
      source: childrenMarker,
    },
    { type: 'festival',
      source: festivalMarker,
    },
    { type: 'music',
      source: musicMarker,
    },
    { type: 'market',
      source: marketMarker,
    },
    { type: 'sports',
      source: sportsMarker,
    },
    { type: 'movie',
      source: movieMarker,
    },
    { type: 'entertainment',
      source: entertainmentMarker,
    },
    { type: 'trade-fair',
      source: fairMarker,
    },
    { type: 'theatre',
      source: theatreMarker,
    },
    { type: 'exhibition',
      source: exhibitionMarker,
    },
  ];

  return markerImages.some((image) => image.type === type)
    ? markerImages.filter((image) => image.type === type)[0].source
    : defaultMarker;
};


export default Marker;
