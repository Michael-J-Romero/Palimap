const tempData1 = [
    {
      coords: { lat: 34.032432437404275, lng: -118.52211997152689 },
      title: "Donation Drop-Off Here",
      body: "This location is currently marked as 'Reconstruction'. Donation Drop-Off Here is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-28",
      type: "Reconstruction"
    },
    {
      coords: { lat: 34.04128062212254, lng: -118.51827621459961 },
      title: "Home Construction Underway",
      body: "This location is currently marked as 'Reconstruction'. Home Construction Underway is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-04",
      type: "Reconstruction"
    },
    {
      coords: { lat: 34.04954910712297, lng: -118.51868674398783 },
      title: "Construction Delays",
      body: "This location is currently marked as 'Construction Update'. Construction Delays is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-01",
      type: "Construction Update"
    },
    {
      coords: { lat: 34.03516388661733, lng: -118.53681564331055 },
      title: "Home Construction Underway",
      body: "This location is currently marked as 'Construction Update'. Home Construction Underway is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-15",
      type: "Construction Update"
    },
    {
      coords: { lat: 34.03897611613634, lng: -118.52967307211283 },
      title: "Construction Delays",
      body: "This location is currently marked as 'Fire Recovery'. Construction Delays is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-05",
      type: "Fire Recovery"
    },
    {
      coords: { lat: 34.055077219495494, lng: -118.51261138916016 },
      title: "Land Cleared for Build",
      body: "This location is currently marked as 'Reconstruction'. Land Cleared for Build is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-16",
      type: "Reconstruction"
    },
    {
      coords: { lat: 34.04665718183822, lng: -118.53396460653666 },
      title: "Volunteers Needed!",
      body: "This location is currently marked as 'Business opening'. Volunteers Needed! is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-10",
      type: "Business opening"
    },
    {
      coords: { lat: 34.04295897778511, lng: -118.54804083944681 },
      title: "Home Restoration Update",
      body: "This location is currently marked as 'Safety Alert'. Home Restoration Update is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-10",
      type: "Safety Alert"
    },
    {
      coords: { lat: 34.06244385418746, lng: -118.53997275473002 },
      title: "Donation Drop-Off Here",
      body: "This location is currently marked as 'Fire Recovery'. Donation Drop-Off Here is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-25",
      type: "Fire Recovery"
    },
    {
      coords: { lat: 34.05749494865576, lng: -118.53836059570312 },
      title: "Local Cafe Reopens",
      body: "This location is currently marked as 'Safety Alert'. Local Cafe Reopens is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-10",
      type: "Business opening"
    },
    {
      coords: { lat: 34.04381242380436, lng: -118.57945487142923 },
      title: "Land Cleared for Build",
      body: "This location is currently marked as 'Safety Alert'. Land Cleared for Build is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-20",
      type: "Safety Alert"
    },
    {
      coords: { lat: 34.04597456183738, lng: -118.56496810913086 },
      title: "Grand Opening Today!",
      body: "This location is currently marked as 'Help Wanted'. Grand Opening Today! is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-19",
      type: "Community Event"
    },
    {
      coords: { lat: 34.055475325242696, lng: -118.56211707235697 },
      title: "Small Business Reopens",
      body: "This location is currently marked as 'Safety Alert'. Small Business Reopens is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-10",
      type: "Business opening"
    },
    {
      coords: { lat: 34.07211351647015, lng: -118.5447792732847 },
      title: "Grand Opening Today!",
      body: "This location is currently marked as 'Community Event'. Grand Opening Today! is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-26",
      type: "Community Event"
    },
    {
      coords: { lat: 34.08291948006904, lng: -118.54031607748392 },
      title: "Neighborhood Cleanup",
      body: "This location is currently marked as 'Fire Recovery'. Neighborhood Cleanup is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-21",
      type: "Fire Recovery"
    },
    {
      coords: { lat: 34.06926961270679, lng: -118.5337929451597 },
      title: "Land Cleared for Build",
      body: "This location is currently marked as 'Business opening'. Land Cleared for Build is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-03-01",
      type: "Construction Update"
    },
    {
      coords: { lat: 34.06087954042017, lng: -118.50701377035502 },
      title: "Residents Moving Back",
      body: "This location is currently marked as 'Help Wanted'. Residents Moving Back is actively happening here, with ongoing efforts to rebuild and restore the area.",
      date: "2025-04-16",
      type: "Reconstruction"
    }
  ];
  //allData
  const zIndex={
    locationModal: 1000,
    map:999999,
    locationModal:10,
    header:1000,
    mapList:2,
    mapListMenu:3
  }
  const types = [
    { type: "Reconstruction", icon: "🏗️" ,count:12},
    { type: "Help Wanted", icon: "👷‍♂️" ,count:5},
    { type: "Community Event", icon: "🎉" ,count:3},
    { type: "Business opening", icon: "🏢" ,count:2},
    { type: "Construction Update", icon: "🚧" ,count:4},
    { type: "Fire Recovery", icon: " 🔥" ,count:6},
    { type: "Safety Alert", icon: "⚠️" ,count:3},
    ];

    const settings = {
      zIndex,
      HeroSlideshow:{
        duration: 8000, // milliseconds each image is shown
        fadeDuration: 800, // milliseconds for fade out
        startY: '-20%', // starting Y offset for pan
        endY: '-25%', // ending Y offset for pan
        scale: 1.0, // zoom level (e.g. 1.05 for slight zoom-in)
        overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))',
        images : [
          './heroImages/4.png ',
          './heroImages/6.jpg ',
          './heroImages/7.png ',
          './heroImages/1.webp ',
          './heroImages/2.webp ',
          './heroImages/5.png ',
          './heroImages/3.jfif ',
        ],
      }
    };
    const texts = [
      'Rebuilding Together',
      'Healing Landscapes',
      'Restoring Our Community',
      'A New Chapter Begins',
  ];

  const tempData = tempData1.map((item,id) => {
    let {  type } = item;
    return {
      id: id,
      image: getImage( id),
      icon:types.find((t) => t.type === type).icon,
      ...item,
    };
  });
    function getImage(i) {
      let id=1+i
      return (id) <= 8
      ?"./mapImages/" + id + ".jfif"
      : id <= 15
      ? "./mapImages/" + (id-8) + ".jpg"
      : id <= 20
      ? "./mapImages/" + (id-15) + ".webp"
      :"./mapImages/1.jpg";
  }
  const imageArray = []
    for (let i = 1; i <= 20; i++) {
        imageArray.push(getImage(i));
    }
    export  { settings,imageArray,types,tempData };
  export default function getData() {
    return tempData;
  }  